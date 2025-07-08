@echo off
echo Starting Chrome with PRESET configuration...
echo.

REM Load environment variables and start Chrome with preset config
powershell -ExecutionPolicy Bypass -Command "& '%~dp0start-chrome.ps1' -Mode preset"

pause
