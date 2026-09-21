[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Shared PostToolUse/AfterTool guard for Antigravity (.agents/hooks.json),
# Claude Code (.claude/settings.json), Codex (.codex/config.toml) and Gemini
# CLI (.gemini/settings.json). Runs `biome format --write` + `biome check`
# and an incremental `tsc --noEmit` on any .ts/.tsx file just edited, and
# feeds remaining lint/type issues back to the model where the host tool
# supports it.
#
# Schemas verified against each tool's own docs on 2026-09-21:
# - Claude Code / Codex PostToolUse: {tool_name, tool_input.file_path,
#   tool_response, hook_event_name}. Output:
#   {hookSpecificOutput:{hookEventName:"PostToolUse", additionalContext}}
# - Gemini CLI AfterTool: {tool_name, tool_input, tool_response,
#   hook_event_name:"AfterTool"}. Output:
#   {hookSpecificOutput:{additionalContext}} (same field name as above).
# - Antigravity PostToolUse: {toolCall:{name,args}, stepIdx, error, ...}.
#   Output MUST be exactly `{}` - no decision/context field exists; a
#   write-through fix (biome --write) is the only thing Antigravity gets
#   from this hook, never a text nudge back to the model.
function Write-Result {
    param(
        [string]$Shape,
        [string]$Feedback = $null
    )
    if ($Shape -eq "antigravity") {
        # Antigravity's PostToolUseResponse accepts no fields at all;
        # returning anything else fails protojson parsing on their side.
        Write-Output "{}"
        exit 0
    }
    if ($Feedback) {
        $out = @{ hookSpecificOutput = @{ hookEventName = if ($Shape -eq "gemini") { "AfterTool" } else { "PostToolUse" }; additionalContext = $Feedback } }
    } else {
        $out = @{}
    }
    $out | ConvertTo-Json -Compress -Depth 5
    exit 0
}

$rawInput = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($rawInput)) { Write-Result -Shape "claude" }

try {
    $payload = $rawInput | ConvertFrom-Json
} catch {
    Write-Result -Shape "claude"
}

function Get-FirstValue {
    param($Obj, [string[]]$Keys)
    foreach ($k in $Keys) {
        if ($Obj -and $Obj.PSObject.Properties.Name -contains $k -and $Obj.$k) {
            return [string]$Obj.$k
        }
    }
    return $null
}

if ($payload.toolCall) {
    $shape = "antigravity"
    $filePath = Get-FirstValue $payload.toolCall.args @('TargetFile', 'FilePath', 'file_path', 'path', 'Path', 'filePath')
} else {
    $shape = if ($payload.hook_event_name -eq "AfterTool") { "gemini" } else { "claude" }
    $filePath = Get-FirstValue $payload.tool_input @('file_path', 'path', 'absolute_path')
}

if ([string]::IsNullOrWhiteSpace($filePath) -or ($filePath -notmatch '\.(ts|tsx)$')) {
    Write-Result -Shape $shape
}

try {
    $repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path

    $absPath = if ([System.IO.Path]::IsPathRooted($filePath)) { $filePath } else { Join-Path $repoRoot $filePath }
    if (-not (Test-Path -LiteralPath $absPath -PathType Leaf)) { Write-Result -Shape $shape }

    $pnpmCmd = Get-Command pnpm -ErrorAction SilentlyContinue
    if (-not $pnpmCmd) { Write-Result -Shape $shape }

    Push-Location $repoRoot
    try {
        $rel = Resolve-Path -LiteralPath $absPath -Relative

        # Format + apply safe lint fixes directly to the file.
        & pnpm exec biome check --write $rel *> $null

        # Report anything biome couldn't fix automatically.
        $biomeOut = & pnpm exec biome check $rel 2>&1 | Out-String
        $biomeIssues = if ($LASTEXITCODE -ne 0) { $biomeOut.Trim() } else { $null }

        # Incremental type check (tsconfig.json has "incremental": true, so
        # repeat runs reuse .tsbuildinfo and stay fast).
        $tscOut = & pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | Out-String
        $tscIssues = $null
        if ($LASTEXITCODE -ne 0) {
            $needle = $rel -replace '\\', '/'
            $relevant = ($tscOut -split "`r?`n") | Where-Object { $_ -replace '\\', '/' -match [regex]::Escape($needle) }
            if ($relevant) { $tscIssues = ($relevant -join "`n").Trim() }
        }

        $parts = @()
        if ($biomeIssues) { $parts += "Biome issues remaining in ${rel}:`n$biomeIssues" }
        if ($tscIssues) { $parts += "TypeScript errors in ${rel}:`n$tscIssues" }
        $feedback = if ($parts.Count -gt 0) { $parts -join "`n`n" } else { $null }

        Write-Result -Shape $shape -Feedback $feedback
    } finally {
        Pop-Location
    }
} catch {
    Write-Result -Shape $shape
}
