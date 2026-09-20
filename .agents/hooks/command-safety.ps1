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
        $output = @{
            decision = "force_ask"
            reason   = "Potentially destructive command detected: '$trimmed'. $($rule.Description) Explicit user confirmation is required."
        }
        $output | ConvertTo-Json -Compress
        exit 0
    }
}

@{ decision = "allow" } | ConvertTo-Json -Compress
exit 0
