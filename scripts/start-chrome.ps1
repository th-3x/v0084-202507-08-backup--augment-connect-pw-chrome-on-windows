param(
    [string]$Mode = "default",
    [int]$Port = 9222,
    [string]$Address = "127.0.0.1",
    [string]$UserDataDir = "C:\temp\chrome-debug",
    [string]$WindowSize = "1200,800"
)

Write-Host "Starting Chrome with remote debugging..." -ForegroundColor Green
Write-Host "Mode: $Mode" -ForegroundColor Cyan
Write-Host ""

# Load environment variables if .env file exists
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
    Write-Host "Loaded configuration from .env file" -ForegroundColor Yellow
}

# Set configuration based on mode
if ($Mode -eq "preset") {
    $Port = [int]($env:CHROME_PORT -or 9223)
    $Address = $env:CHROME_ADDRESS -or "127.0.0.1"
    $UserDataDir = $env:USER_DATA_DIR -or "/tmp/chrome-testing-profile"
    $WindowSize = $env:WINDOW_SIZE -or "800,600"
    Write-Host "Using preset configuration from environment" -ForegroundColor Cyan
}

# Convert Unix path to Windows path if needed
if ($UserDataDir.StartsWith("/tmp/")) {
    $UserDataDir = "C:\temp\" + $UserDataDir.Substring(5)
}

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Port: $Port" -ForegroundColor Gray
Write-Host "  Address: $Address" -ForegroundColor Gray
Write-Host "  User Data Dir: $UserDataDir" -ForegroundColor Gray
Write-Host "  Window Size: $WindowSize" -ForegroundColor Gray
Write-Host ""

# Create user data directory
if (!(Test-Path $UserDataDir)) {
    New-Item -ItemType Directory -Path $UserDataDir -Force | Out-Null
    Write-Host "Created Chrome data directory: $UserDataDir" -ForegroundColor Yellow
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
Write-Host "Starting Chrome on port $Port..." -ForegroundColor Yellow

# Start Chrome with remote debugging
try {
    $arguments = @(
        "--remote-debugging-port=$Port",
        "--remote-debugging-address=$Address",
        "--no-first-run",
        "--no-default-browser-check",
        "--user-data-dir=$UserDataDir",
        "--window-size=$WindowSize",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor"
    )

    Start-Process -FilePath $chromeExe -ArgumentList $arguments -PassThru | Out-Null

    Write-Host ""
    Write-Host "✅ Chrome started successfully with remote debugging enabled!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Connection details:" -ForegroundColor Cyan
    Write-Host "  URL: http://$Address`:$Port/json/version" -ForegroundColor Gray
    Write-Host "  Mode: $Mode" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Now you can run the Playwright demo with: npm run dev" -ForegroundColor Yellow
    Write-Host ""

} catch {
    Write-Host "❌ Failed to start Chrome: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running this command manually:" -ForegroundColor Yellow
    Write-Host "& `"$chromeExe`" --remote-debugging-port=$Port --remote-debugging-address=$Address --no-first-run --no-default-browser-check --user-data-dir=`"$UserDataDir`"" -ForegroundColor Gray
}

Write-Host "Press Enter to continue..." -ForegroundColor Gray
Read-Host
