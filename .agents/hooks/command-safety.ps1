[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Shared PreToolUse/BeforeTool guard for Antigravity (.agents/hooks.json),
# Claude Code (.claude/settings.json), Codex (.codex/config.toml) and Gemini
# CLI (.gemini/settings.json). Detects which caller's payload/response shape
# it received and replies in kind, so the destructive-command policy below
# is defined exactly once.
function Write-Decision {
    param(
        [string]$Shape,
        [string]$Decision,   # allow | deny | ask
        [string]$Reason = $null
    )
    if ($Shape -eq "antigravity") {
        $out = @{ decision = if ($Decision -eq "ask") { "force_ask" } else { $Decision } }
        if ($Reason) { $out.reason = $Reason }
    } elseif ($Shape -eq "gemini") {
        # Gemini CLI's BeforeTool hook has no "ask" tier - only allow/deny.
        $out = @{ decision = if ($Decision -eq "ask") { "deny" } else { $Decision } }
        if ($Reason) { $out.reason = $Reason }
    } else {
        $specific = @{ hookEventName = "PreToolUse"; permissionDecision = $Decision }
        if ($Reason) { $specific.permissionDecisionReason = $Reason }
        $out = @{ hookSpecificOutput = $specific }
    }
    $out | ConvertTo-Json -Compress -Depth 5
    exit 0
}

$rawInput = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($rawInput)) { Write-Decision -Shape "claude" -Decision "allow" }

try {
    $payload = $rawInput | ConvertFrom-Json
} catch {
    Write-Decision -Shape "claude" -Decision "allow"
}

if ($payload.toolCall) {
    $shape = "antigravity"
    $toolName = $payload.toolCall.name
    $cmd = $payload.toolCall.args.CommandLine
} else {
    # Claude, Codex and Gemini CLI all send {tool_name, tool_input.command};
    # only hook_event_name tells them apart (PreToolUse vs BeforeTool).
    $toolName = $payload.tool_name
    $cmd = $payload.tool_input.command
    $shape = if ($payload.hook_event_name -eq "BeforeTool") { "gemini" } else { "claude" }
}

$shellTools = @('run_command', 'Bash', 'shell', 'local_shell', 'exec_command', 'shell_command', 'run_shell_command')
if ($shellTools -notcontains $toolName) { Write-Decision -Shape $shape -Decision "allow" }

if ([string]::IsNullOrWhiteSpace($cmd)) { Write-Decision -Shape $shape -Decision "allow" }

$trimmed = $cmd.Trim().Trim('"').Trim("'").Trim()

# Strip any leading rtk/rtk.exe wrapper to check the underlying command
$clean = $trimmed -replace '^(rtk(\.exe)?|&?\s*["''][^"'']*[\\/]rtk\.exe["'']?)\s+', ''

# Patterns for destructive commands that risk unrecoverable state loss
$destructiveRules = @(
    @{ Pattern = 'git\s+reset\s+--(hard|merge|keep)'; Description = "Hard git reset discards uncommitted work or rewrites history." },
    @{ Pattern = 'git\s+clean\s+(-[a-zA-Z]*f[a-zA-Z]*|--force)'; Description = "Forced git clean permanently deletes untracked files." },
    @{ Pattern = 'git\s+push\s+.*(--force|-f\b|\+)'; Description = "Force push can overwrite remote branch history." },
    @{ Pattern = 'git\s+branch\s+.*(-D|--delete\s+--force)'; Description = "Forced branch deletion permanently removes unmerged branches." },
    @{ Pattern = 'git\s+restore\s+(\.|--staged|\*|src)'; Description = "Git restore discards local working tree changes." },
    @{ Pattern = 'rm\s+(-[a-zA-Z]*r[a-zA-Z]*f[a-zA-Z]*|-[a-zA-Z]*f[a-zA-Z]*r[a-zA-Z]*)'; Description = "Recursive forced file/directory deletion." },
    @{ Pattern = '(Remove-Item|ri|rmdir|rd)\s+.*(-Recurse|-r)\b.*(-Force|-fo)\b'; Description = "Recursive forced PowerShell item deletion." },
    @{ Pattern = '(Remove-Item|ri|rmdir|rd)\s+.*(-Force|-fo)\b.*(-Recurse|-r)\b'; Description = "Recursive forced PowerShell item deletion." },
    @{ Pattern = 'rmdir\s+/s\s+/q'; Description = "Quiet recursive Windows directory removal." },
    @{ Pattern = 'firebase\s+firestore:delete\s+--all-collections'; Description = "Bulk deletion of Firestore database collections." }
)

foreach ($rule in $destructiveRules) {
    if ($clean -match $rule.Pattern) {
        Write-Decision -Shape $shape -Decision "ask" -Reason "Potentially destructive command detected: '$trimmed'. $($rule.Description) Explicit user confirmation is required."
    }
}

Write-Decision -Shape $shape -Decision "allow"
