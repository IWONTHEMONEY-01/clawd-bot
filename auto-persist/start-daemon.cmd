@echo off
REM Start the persist service in daemon mode
cd /d "%~dp0.."
node "%~dp0persist-service.js" --daemon
