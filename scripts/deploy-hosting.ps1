$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "..\deploy-hosting.log"
function Log($msg) {
  $line = "[$(Get-Date -Format 'HH:mm:ss')] $msg"
  Add-Content -Path $logFile -Value $line
  Write-Host $line
}

Set-Location (Join-Path $PSScriptRoot "..")
"" | Set-Content -Path $logFile

$voltiqConfig = Join-Path $env:USERPROFILE ".voltiq_firebase_config"
if (Test-Path (Join-Path $voltiqConfig "configstore\firebase-tools.json")) {
  $env:XDG_CONFIG_HOME = $voltiqConfig
} else {
  $env:XDG_CONFIG_HOME = Join-Path $PWD ".firebase-config"
  New-Item -ItemType Directory -Force -Path $env:XDG_CONFIG_HOME | Out-Null
}
Log "XDG_CONFIG_HOME=$env:XDG_CONFIG_HOME"

$firebase = Join-Path $env:APPDATA "npm\firebase.cmd"
if (-not (Test-Path $firebase)) {
  Log "ERROR: firebase.cmd not found at $firebase"
  Read-Host "Press Enter to close"
  exit 1
}

Log "Building production bundle..."
npm run build 2>&1 | ForEach-Object { Log $_ }
if ($LASTEXITCODE -ne 0) {
  Log "ERROR: build failed with exit code $LASTEXITCODE"
  Read-Host "Press Enter to close"
  exit $LASTEXITCODE
}

Log "Checking Firebase auth..."
$accounts = & $firebase login:list 2>&1 | ForEach-Object { $_.ToString() }
$accounts | ForEach-Object { Log $_ }

if ($accounts -match "No authorized accounts") {
  Log "Starting Firebase login - complete sign-in in your browser..."
  & $firebase login 2>&1 | ForEach-Object { Log $_ }
  if ($LASTEXITCODE -ne 0) {
    Log "ERROR: firebase login failed"
    Read-Host "Press Enter to close"
    exit $LASTEXITCODE
  }
}

Log "Deploying hosting..."
& $firebase deploy --only hosting --non-interactive 2>&1 | ForEach-Object { Log $_ }
if ($LASTEXITCODE -ne 0) {
  Log "Retrying deploy without --non-interactive..."
  & $firebase deploy --only hosting 2>&1 | ForEach-Object { Log $_ }
}
if ($LASTEXITCODE -ne 0) {
  Log "ERROR: deploy failed with exit code $LASTEXITCODE"
  Read-Host "Press Enter to close"
  exit $LASTEXITCODE
}

Start-Sleep -Seconds 5
Log "Verifying live headers..."
$response = Invoke-WebRequest -Uri "https://voltiq-dashboard.web.app/" -Method Head -UseBasicParsing
$coep = $response.Headers["Cross-Origin-Embedder-Policy"]
$coop = $response.Headers["Cross-Origin-Opener-Policy"]
Log "Cross-Origin-Embedder-Policy: $coep"
Log "Cross-Origin-Opener-Policy: $coop"

if (-not $coep -or -not $coop) {
  Log "ERROR: COEP/COOP headers still missing after deploy"
  Read-Host "Press Enter to close"
  exit 1
}

Log "SUCCESS: https://voltiq-dashboard.web.app/"
Read-Host "Deploy complete. Press Enter to close"