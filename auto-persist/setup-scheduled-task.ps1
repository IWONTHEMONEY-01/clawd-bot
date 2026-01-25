# Setup Windows Scheduled Task for Auto-Persist
# Run this script as Administrator

$TaskName = "ClawdbotAutoPersist"
$ScriptPath = Join-Path $PSScriptRoot "run-persist.cmd"
$WorkingDir = Split-Path $PSScriptRoot -Parent

# Remove existing task if present
Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue

# Create trigger: every 5 minutes
$Trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Minutes 5)

# Create action
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$ScriptPath`"" -WorkingDirectory $WorkingDir

# Create settings
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RunOnlyIfNetworkAvailable:$false

# Register task
Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $Action -Settings $Settings -Description "Auto-persist Clawdbot state to git every 5 minutes"

Write-Host "Scheduled task '$TaskName' created successfully!"
Write-Host "The task will run every 5 minutes to backup your Clawdbot state."
Write-Host ""
Write-Host "To view: Task Scheduler -> Task Scheduler Library -> $TaskName"
Write-Host "To remove: Unregister-ScheduledTask -TaskName $TaskName"
