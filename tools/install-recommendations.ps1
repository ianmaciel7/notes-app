param(
    [switch]$SkipReverClone,
    [switch]$SkipUiClone
)

$ErrorActionPreference = "Stop"

function Resolve-Node {
  $candidates = @(
    "C:\nvm4w\nodejs\node.exe",
    "C:\Program Files\nodejs\node.exe",
    "C:\Users\ianma\AppData\Local\nvm\versions\node\v24.19.0\node.exe"
  )
  if ($env:NVM_SYMLINK -and (Test-Path $env:NVM_SYMLINK)) {
    $candidates += (Join-Path $env:NVM_SYMLINK "node.exe")
  }
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  foreach ($candidate in $candidates | Select-Object -Unique) {
    if (Test-Path $candidate) { return $candidate }
  }
  throw "Node.js não encontrado. Verifique seu Node/NVM."
}

function Test-Command([string]$name) {
  $c = Get-Command $name -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  return $null
}

function Has-Network {
  param([string]$Url)
  try {
    Invoke-WebRequest -UseBasicParsing -Uri $Url -Method Head -TimeoutSec 8 | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Has-WSL {
  $wslCmd = Get-Command wsl -ErrorAction SilentlyContinue
  if (-not $wslCmd) { return $false }
  try {
    & $wslCmd.Source --status 1>$null 2>$null
    return $LASTEXITCODE -eq 0
  } catch {
    return $false
  }
}

function Ensure-Bun {
  $bunCmd = Test-Command bun
  if ($bunCmd) {
    Write-Host "bun: encontrado em $bunCmd"
    return $bunCmd
  }

  function Install-BunFromScript {
    Write-Host "Instalador alternativo: script oficial do bun (sem winget)."
    $installer = Join-Path $env:TEMP ("bun-install-" + [guid]::NewGuid().ToString("N") + ".ps1")
    try {
      Invoke-WebRequest -Uri "https://bun.sh/install.ps1" -UseBasicParsing -OutFile $installer -ErrorAction Stop
      & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $installer
    } catch {
      throw "Falha no instalador oficial do bun: $($_.Exception.Message)"
    } finally {
      if (Test-Path $installer) { Remove-Item $installer -Force -ErrorAction SilentlyContinue }
    }
    $candidates = @(
      "$env:LOCALAPPDATA\bun\bin\bun.exe",
      "$env:USERPROFILE\.bun\bin\bun.exe",
      "$env:ProgramFiles\bun\bin\bun.exe"
    )
    foreach ($candidate in $candidates) {
      if (Test-Path $candidate) {
        $bin = Split-Path $candidate -Parent
        $env:Path = "$bin;$env:Path"
        return $candidate
      }
    }
    throw "Instalador do bun não expôs 'bun.exe' no expected path."
  }

  $wingetCmd = Test-Command winget
  $wingetCli = $null
  if ($wingetCmd) {
    $wingetCli = $wingetCmd
  } else {
    $candidates = @(
      "C:\Program Files\WindowsApps\Microsoft.DesktopAppInstaller_1.29.280.0_x64__8wekyb3d8bbwe\winget.exe",
      "$env:LOCALAPPDATA\Microsoft\WindowsApps\winget.exe"
    )
    foreach ($candidate in $candidates) {
      if (Test-Path $candidate) {
        $wingetCli = $candidate
        break
      }
    }
  }

  if ($wingetCli) {
    Write-Host "bun não encontrado. Tentando instalação via winget..."
    $wingetArgs = "install --id Oven-sh.Bun --accept-source-agreements --accept-package-agreements --silent"
    try {
      if ($wingetCli -like "* *") {
        & cmd.exe /c ('"{0}" {1}' -f $wingetCli, $wingetArgs)
      } else {
        & cmd.exe /c "$wingetCli $wingetArgs"
      }
      $bunCmd = Test-Command bun
      if ($bunCmd) {
        Write-Host "bun instalado via winget: $bunCmd"
        return $bunCmd
      }
    } catch {
      Write-Warning "Instalação via winget falhou: $($_.Exception.Message)"
    }
  }

  if (Has-Network -Url "https://bun.sh/install.ps1") {
    try {
      return Install-BunFromScript
    } catch {
      Write-Warning "$($_.Exception.Message)"
      Write-Host "Alternativa: baixe manualmente em https://bun.sh e reinicie o terminal."
    }
  }

  if (-not (Has-Network -Url "https://registry.npmjs.org/bun")) {
    Write-Warning "Sem acesso a https://registry.npmjs.org. Pulei instalação automática do bun."
    Write-Host "Instalação manual (Windows): baixe em https://bun.sh e reinicie o terminal."
    return $null
  }

  Write-Host "bun não encontrado. Instalando via npm..."
  try {
    & $script:npmCmd i -g bun
    return (Test-Command bun)
  } catch {
    Write-Warning "Falha ao instalar bun via npm: $($_.Exception.Message)"
    Write-Host "Como alternativa, baixe em https://bun.sh e reinicie o terminal."
    return $null
  }
}

Write-Host "=== bootstrap ==="
$nodeCmd = Resolve-Node
$nodeDir = Split-Path $nodeCmd -Parent
$script:nodeCmd = $nodeCmd
$env:Path = "$nodeDir;$env:Path"

$npmCmd = Test-Command npm
if (-not $npmCmd) { throw "npm não encontrado." }
$script:npmCmd = $npmCmd

Write-Host "Node: $(&$nodeCmd --version)"
Write-Host "NPM : $(&$npmCmd --version)"

Write-Host "=== WSL e ui-clone-skills ==="
if (-not (Has-WSL)) {
  Write-Host "WSL indisponível; pulando ui-clone-skills."
  $SkipUiClone = $true
}
if (-not $SkipUiClone) {
  Write-Host "WSL disponível: você pode usar ui-clone-skills em WSL2."
}

Write-Host "=== bun ==="
$bunCmd = Ensure-Bun
if ($bunCmd) {
  Write-Host "bun: $(& $bunCmd --version)"
} else {
  Write-Warning "Sem bun no momento. rever-browser depende de bun para rodar."
}

Write-Host "=== instalar agentes do rever-browser (ACP) ==="
if (Has-Network -Url "https://registry.npmjs.org/@agentclientprotocol/claude-agent-acp") {
  try {
    & $npmCmd i -g @agentclientprotocol/claude-agent-acp
    & $npmCmd i -g @agentclientprotocol/codex-acp
  } catch {
    Write-Warning "Falha ao instalar pacotes ACP: $($_.Exception.Message)"
  }
} else {
  Write-Warning "Sem acesso a registry npm. Instale estes pacotes quando houver internet."
}

$toolsRoot = "C:\Users\ianma\workspace\notes-app\tools"
New-Item -ItemType Directory -Path $toolsRoot -Force | Out-Null
$reverDir = Join-Path $toolsRoot "rever-browser"

Write-Host "=== rever-browser ==="
if (-not $SkipReverClone) {
  if (-not (Test-Path $reverDir)) {
    if (Has-Network -Url "https://github.com/greekr4/rever-browser") {
      try {
        Set-Location $toolsRoot
        git clone https://github.com/greekr4/rever-browser.git
      } catch {
        Write-Warning "Falha no clone do rever-browser: $($_.Exception.Message)"
      }
    } else {
      Write-Warning "Sem acesso a github.com. Faça clone manual em $reverDir."
      Write-Host "Manual: git clone https://github.com/greekr4/rever-browser.git"
    }
  } else {
    Write-Host "rever-browser já existe em $reverDir"
  }
}

if (Test-Path $reverDir) {
  if ($bunCmd) {
    try {
      Set-Location $reverDir
      & $bunCmd install
    } catch {
      Write-Warning "bun install falhou: $($_.Exception.Message)"
    }
  } else {
    Write-Warning "Pulei bun install; adicione bun antes de continuar."
  }
}

Write-Host "=== registrar skill no Claude/Code ==="
if (Test-Command npx) {
  if (Has-Network -Url "https://registry.npmjs.org/skills") {
    try {
      npx skills add greekr4/rever-browser-skill --global --agent claude-code
    } catch {
      Write-Warning "Não foi possível registrar a skill automaticamente: $($_.Exception.Message)"
      Write-Host "Quando possível, rode:"
      Write-Host "npx skills add greekr4/rever-browser-skill --global --agent claude-code"
    }
  } else {
    Write-Warning "Sem acesso a npm registry. Registre a skill depois de recuperar internet."
  }
}

Write-Host "=== resumo ==="
Write-Host "Node: $nodeCmd"
Write-Host "NPM : $npmCmd"
Write-Host "Bun  : $([string]($(if ($bunCmd) { $bunCmd } else { 'não encontrado' })))"
Write-Host "Rever dir: $reverDir"
if (-not $SkipUiClone) { Write-Host "ui-clone-skills: só em WSL2/macOS (não recomendado neste perfil)" }
