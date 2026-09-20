[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$rawInput = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($rawInput)) {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

try {
    $payload = $rawInput | ConvertFrom-Json
} catch {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

if ($payload.toolCall.name -ne "run_command") {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

$cmd = $payload.toolCall.args.CommandLine
if ([string]::IsNullOrWhiteSpace($cmd)) {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

$trimmed = $cmd.Trim().Trim('"').Trim("'").Trim()

# 1. Already uses RTK directly (name or absolute executable path)
if ($trimmed -match '^(rtk\b|rtk\.exe\b|&?\s*["''][^"'']*[\\/]rtk\.exe["'']?\b)') {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

# 2. RTK diagnostics, resolution, and self-inspection (prevent recursion/deadlocks)
if ($trimmed -match '\b(Get-Command|gcm)\s+(-Name\s+)?rtk\b' -or
    $trimmed -match '\bwhere(\.exe)?\s+rtk\b' -or
    $trimmed -match '^\s*\(\s*(Get-Command|gcm)\s+rtk\s*\)' -or
    $trimmed -match '^rtk\s+(gain|discover|cc-economics|config|trust|untrust|verify|--version|-V|--help|-h)\b') {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

# 3. Native PowerShell cmdlets and local script executions
if ($trimmed -match '^\s*(Get-|Set-|New-|Test-Path|Select-Object|Where-Object|Measure-Command|Measure-Object|Format-|Out-|Start-|Stop-|Copy-Item|Move-Item|ForEach-Object|Write-|Join-Path|Split-Path|Resolve-Path)\b' -or
    $trimmed -match '^\s*(&\s*)?[\.\\]+[\\/].*\.ps1\b') {
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

# 4. Handle Windows built-in aliases without native executables (e.g. ls -> Get-ChildItem)
if ($trimmed -match '^ls(\s+.*)?$') {
    $hasLsExe = [bool](Get-Command ls -CommandType Application -ErrorAction SilentlyContinue)
    if (-not $hasLsExe) {
        @{ decision = "allow" } | ConvertTo-Json -Compress
        exit 0
    }
}

# 5. Resolve the RTK binary (handling Windows WinGet shims transparently)
$rtkGcm = Get-Command rtk -ErrorAction SilentlyContinue
if (-not $rtkGcm) {
    # If RTK is not installed on PATH, fail open to avoid breaking workflow
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
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
        $output = @{
            decision = "deny"
            reason   = "Command '$trimmed' bypasses RTK. Use '$suggested' instead to compress output and eliminate token waste."
        }
        $output | ConvertTo-Json -Compress
        exit 0
    }
} catch {
    # Fail open on unexpected invocation failure
    @{ decision = "allow" } | ConvertTo-Json -Compress
    exit 0
}

# Command is either unsupported by RTK or non-rewritable
@{ decision = "allow" } | ConvertTo-Json -Compress
exit 0
