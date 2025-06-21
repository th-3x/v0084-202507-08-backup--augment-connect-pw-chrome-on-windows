@echo off
echo Starting Chrome with remote debugging...
echo.

REM Create temp directory
if not exist "C:\temp\chrome-debug" mkdir "C:\temp\chrome-debug"

REM Start Chrome - try different possible locations
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug
    goto :success
)

if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug
    goto :success
)

if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug
    goto :success
)

echo Chrome not found in standard locations!
echo Please install Google Chrome or run manually:
echo chrome.exe --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug
pause
exit /b 1

:success
echo.
echo Chrome should now be running with remote debugging enabled.
echo You can verify by visiting: http://127.0.0.1:9222/json/version
echo.
echo Now run: npm run dev
echo.
pause
