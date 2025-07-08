@echo off
echo Starting multiple Chrome instances for testing...
echo.

echo Starting Chrome instance 1 (port 9222)...
powershell -ExecutionPolicy Bypass -Command "& '%~dp0start-chrome.ps1' -Port 9222 -UserDataDir 'C:\temp\chrome-debug-1'"

timeout /t 2 /nobreak > nul

echo Starting Chrome instance 2 (port 9223 - preset)...
powershell -ExecutionPolicy Bypass -Command "& '%~dp0start-chrome.ps1' -Mode preset"

timeout /t 2 /nobreak > nul

echo Starting Chrome instance 3 (port 9224)...
powershell -ExecutionPolicy Bypass -Command "& '%~dp0start-chrome.ps1' -Port 9224 -UserDataDir 'C:\temp\chrome-debug-3'"

echo.
echo ✅ Started multiple Chrome instances:
echo   - Port 9222: Standard configuration
echo   - Port 9223: Preset configuration  
echo   - Port 9224: Additional instance
echo.
echo You can now test all connections with: node scripts/test-connection.js
echo.

pause
