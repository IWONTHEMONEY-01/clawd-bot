@echo off
REM Run the persist service once (for Task Scheduler)
cd /d "%~dp0.."
node "%~dp0persist-service.js" --once
