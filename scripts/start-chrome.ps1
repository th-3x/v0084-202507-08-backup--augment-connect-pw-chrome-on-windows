Write-Host "Starting Chrome with remote debugging..." -ForegroundColor Green
Write-Host ""

# Create temp directory for Chrome user data
$chromeDataDir = "C:\temp\chrome-debug"
if (!(Test-Path $chromeDataDir)) {
    New-Item -ItemType Directory -Path $chromeDataDir -Force | Out-Null
    Write-Host "Created Chrome data directory: $chromeDataDir" -ForegroundColor Yellow
}

# Find Chrome executable
$chromePaths = @(
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
)

$chromeExe = $null
foreach ($path in $chromePaths) {
    if (Test-Path $path) {
        $chromeExe = $path
        break
    }
}

if ($null -eq $chromeExe) {
    Write-Host "❌ Chrome executable not found in standard locations!" -ForegroundColor Red
    Write-Host "Please install Google Chrome or update the path in this script." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Searched locations:" -ForegroundColor Yellow
    foreach ($path in $chromePaths) {
        Write-Host "  - $path" -ForegroundColor Gray
    }
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Found Chrome at: $chromeExe" -ForegroundColor Green
Write-Host "Starting Chrome on port 9222..." -ForegroundColor Yellow

# Start Chrome with remote debugging
try {
    Start-Process -FilePath $chromeExe -ArgumentList @(
        "--remote-debugging-port=9222",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=$chromeDataDir",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor"
    ) -PassThru | Out-Null
    
    Write-Host ""
    Write-Host "✅ Chrome started successfully with remote debugging enabled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can verify by visiting: http://127.0.0.1:9222/json/version" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Now you can run the Playwright demo with: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host "❌ Failed to start Chrome: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running this command manually:" -ForegroundColor Yellow
    Write-Host "& `"$chromeExe`" --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=`"$chromeDataDir`"" -ForegroundColor Gray
}

Write-Host "Press Enter to continue..." -ForegroundColor Gray
Read-Host
