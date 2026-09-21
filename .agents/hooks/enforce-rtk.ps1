[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Shared PreToolUse/BeforeTool guard for Antigravity (.agents/hooks.json),
# Claude Code (.claude/settings.json), Codex (.codex/config.toml) and Gemini
# CLI (.gemini/settings.json). Detects which caller's payload/response shape
# it received and replies in kind, so the RTK-enforcement policy below is
# defined exactly once.
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

# 1. Already uses RTK directly (name or absolute executable path)
if ($trimmed -match '^(rtk\b|rtk\.exe\b|&?\s*["''][^"'']*[\\/]rtk\.exe["'']?\b)') {
    Write-Decision -Shape $shape -Decision "allow"
}

# 2. RTK diagnostics, resolution, and self-inspection (prevent recursion/deadlocks)
if ($trimmed -match '\b(Get-Command|gcm)\s+(-Name\s+)?rtk\b' -or
    $trimmed -match '\bwhere(\.exe)?\s+rtk\b' -or
    $trimmed -match '^\s*\(\s*(Get-Command|gcm)\s+rtk\s*\)' -or
    $trimmed -match '^rtk\s+(gain|discover|cc-economics|config|trust|untrust|verify|--version|-V|--help|-h)\b') {
    Write-Decision -Shape $shape -Decision "allow"
}

# 3. Native PowerShell cmdlets and local script executions
if ($trimmed -match '^\s*(Get-|Set-|New-|Test-Path|Select-Object|Where-Object|Measure-Command|Measure-Object|Format-|Out-|Start-|Stop-|Copy-Item|Move-Item|ForEach-Object|Write-|Join-Path|Split-Path|Resolve-Path)\b' -or
    $trimmed -match '^\s*(&\s*)?[\.\\]+[\\/].*\.ps1\b') {
    Write-Decision -Shape $shape -Decision "allow"
}

# 4. Handle Windows built-in aliases without native executables (e.g. ls -> Get-ChildItem)
if ($trimmed -match '^ls(\s+.*)?$') {
    $hasLsExe = [bool](Get-Command ls -CommandType Application -ErrorAction SilentlyContinue)
    if (-not $hasLsExe) {
        Write-Decision -Shape $shape -Decision "allow"
    }
}

# 5. Resolve the RTK binary (handling Windows WinGet shims transparently)
$rtkGcm = Get-Command rtk -ErrorAction SilentlyContinue
if (-not $rtkGcm) {
    # If RTK is not installed on PATH, fail open to avoid breaking workflow
    Write-Decision -Shape $shape -Decision "allow"
}

$rtkBin = "rtk"
if ($rtkGcm.Target -and (Test-Path -Path $rtkGcm.Target)) {
    $rtkBin = $rtkGcm.Target
} elseif ($rtkGcm.Source) {
    $rtkBin = $rtkGcm.Source
}

# 6. Query the official RTK hook engine for command rewriting
try {
    $rtkOutput = & $rtkBin hook check "$trimmed" 2>$null
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0 -and $rtkOutput -match '^rtk\s+' -and $rtkOutput.Trim() -ne $trimmed) {
        $suggested = $rtkOutput.Trim()
        Write-Decision -Shape $shape -Decision "deny" -Reason "Command '$trimmed' bypasses RTK. Use '$suggested' instead to compress output and eliminate token waste."
    }
} catch {
    # Fail open on unexpected invocation failure
    Write-Decision -Shape $shape -Decision "allow"
}

# Command is either unsupported by RTK or non-rewritable
Write-Decision -Shape $shape -Decision "allow"
