@echo off
echo 🎭 Playwright Chrome Connection PoC Demo
echo ========================================
echo.

echo Step 1: Testing Chrome connections...
node scripts/test-connection.js

echo.
echo Step 2: Running the main application...
echo.

npm run dev

echo.
echo Demo completed!
pause
