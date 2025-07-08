@echo off
echo Starting Playwright UI tests with remote Chrome...
echo.

echo Configuration:
echo CHROME_ADDRESS: %CHROME_ADDRESS%
echo CHROME_PORT: %CHROME_PORT%
echo.

echo Make sure Chrome is running on the configured address and port!
echo.

npx playwright test --ui

pause
