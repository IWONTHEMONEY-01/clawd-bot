# Setup GitHub authentication for unattended access (Windows)
# Run with: powershell -ExecutionPolicy Bypass -File setup-github.ps1

$ErrorActionPreference = "Stop"
$ClawdbotDir = Split-Path $PSScriptRoot -Parent

Write-Host "=== GitHub Setup for Clawdbot Auto-Persist ===" -ForegroundColor Cyan
Write-Host ""

# Check git config
$gitEmail = git config --global user.email
$gitName = git config --global user.name

if (-not $gitEmail) {
    $gitEmail = Read-Host "Enter your Git email"
    git config --global user.email $gitEmail
}

if (-not $gitName) {
    $gitName = Read-Host "Enter your Git name"
    git config --global user.name $gitName
}

Write-Host ""
Write-Host "Create a Personal Access Token at: https://github.com/settings/tokens"
Write-Host "Required scopes: repo (full control)"
Write-Host ""

$token = Read-Host "Enter your GitHub Personal Access Token" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

$username = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter your repository name (e.g., clawdbot-state)"

# Configure credential helper
git config --global credential.helper wincred

# Set up remote
Set-Location $ClawdbotDir
git remote remove origin 2>$null
$remoteUrl = "https://${username}:${tokenPlain}@github.com/${username}/${repoName}.git"
git remote add origin $remoteUrl

# Store credentials
$credentialFile = "$env:USERPROFILE\.git-credentials"
"https://${username}:${tokenPlain}@github.com" | Out-File -Append -FilePath $credentialFile -Encoding ASCII
git config --global credential.helper store

Write-Host ""
Write-Host "Testing connection..." -ForegroundColor Yellow

try {
    git ls-remote origin 2>&1 | Out-Null
    Write-Host "Connection successful!" -ForegroundColor Green

    Write-Host "Pushing to GitHub..."
    git push -u origin master 2>&1
    if ($LASTEXITCODE -ne 0) {
        git push -u origin main
    }

    Write-Host ""
    Write-Host "=== Setup Complete ===" -ForegroundColor Green
    $safeUrl = (git remote get-url origin) -replace ":[^@]+@", ":***@"
    Write-Host "Remote: $safeUrl"
} catch {
    Write-Host "Connection failed. Please check your token and try again." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "The auto-persist service will now push to GitHub every 5 minutes."
