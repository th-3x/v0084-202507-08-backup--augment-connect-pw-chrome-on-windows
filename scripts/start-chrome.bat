@echo off
echo Starting Chrome with remote debugging...
echo.

REM Create temp directory for Chrome user data
if not exist "C:\temp\chrome-debug" mkdir "C:\temp\chrome-debug"

REM Start Chrome with remote debugging
echo Starting Chrome on port 9222...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --remote-debugging-port=9222 ^
  --no-first-run ^
  --no-default-browser-check ^
  --user-data-dir=C:\temp\chrome-debug ^
  --disable-web-security ^
  --disable-features=VizDisplayCompositor

echo.
echo Chrome should now be running with remote debugging enabled.
echo You can verify by visiting: http://127.0.0.1:9222/json/version
echo.
echo Press any key to continue...
pause > nul
