# Playwright Chrome Connection PoC - Step-by-Step Usage Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 1.5: Setup Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env file to set your remote Chrome IP address
# Replace 'your-remote-chrome-ip-here' with your actual remote Chrome IP
```

### Step 2: Start Chrome with Remote Debugging
**Windows:**
```bash
# Option A: Use the provided script
scripts\start-chrome.bat

# Option B: Manual command (Command Prompt)
chrome.exe --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug

# Option C: PowerShell command (use & to execute)
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug

# Option D: PowerShell with Start-Process
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--remote-debugging-port=9222", "--no-first-run", "--no-default-browser-check", "--user-data-dir=C:\temp\chrome-debug"
```

**macOS:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=/tmp/chrome-debug
```

**Linux:**
```bash
google-chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=/tmp/chrome-debug
```

### Step 3: Verify Chrome Connection
```bash
# Test connections
node scripts/test-connection.js

# Or visit in browser
# http://127.0.0.1:9222/json/version
```

### Step 4: Run the Demo
```bash
# Development mode
npm run dev

# Or production build
npm run build
npm start
```

## Detailed Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Google Chrome installed
- Network access (for remote connection testing)

### Environment Configuration

1. **Review .env file:**
```env
# Chrome Connection Configuration
LOCAL_CHROME_PORT=9222
LOCAL_CHROME_HOST=127.0.0.1
REMOTE_CHROME_PORT=9222
REMOTE_CHROME_HOST=35.197.149.222

# Application Configuration
DEFAULT_TIMEOUT=30000
RETRY_ATTEMPTS=3
SCREENSHOT_PATH=./screenshots
```

2. **Customize if needed:**
   - Change `REMOTE_CHROME_HOST` to your remote Chrome instance
   - Adjust `DEFAULT_TIMEOUT` for slower networks
   - Modify `RETRY_ATTEMPTS` for different retry behavior

### Chrome Setup Options

#### Option 1: Local Chrome (Recommended for Testing)
```bash
# Windows
chrome.exe --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug --disable-web-security

"C:\Users\v2\AppData\Local\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug --disable-web-security

# This creates a separate Chrome instance that won't interfere with your regular browsing
```

#### Option 2: Remote Chrome (Production Use)
1. Set up Chrome on remote server with same parameters
2. Ensure port 9222 is accessible through firewall
3. Update `REMOTE_CHROME_HOST` in .env file

### Verification Steps

#### 1. Test Chrome Connection
```bash
# Run connection test
node scripts/test-connection.js

# Expected output for working local Chrome:
# ✅ Local Chrome connection successful!
#    Browser: Chrome/120.0.6099.109
#    WebKit: 537.36
```

#### 2. Test HTTP Endpoint
```bash
# Windows
curl http://127.0.0.1:9222/json/version

# Should return JSON with browser information
```

#### 3. Run Full Demo
```bash
npm run dev

# Expected output:
# 🎭 Playwright Chrome Connection PoC
# =====================================
# 🔗 Attempting connection to 127.0.0.1:9222
# ✅ Successfully connected to local Chrome
# 🚀 Running all use cases...
```

## Understanding the Output

### Successful Connection
```
🔗 Attempting connection to 127.0.0.1:9222
✅ Successfully connected to local Chrome: local://127.0.0.1:9222

🚀 Running all use cases with session: session_1703123456789_abc123def

=== Web Scraping Use Case ===
Starting web scraping for: https://news.ycombinator.com
✅ Web scraping completed successfully
Execution time: 2341ms

=== Form Automation Use Case ===
Starting form automation for: https://www.w3schools.com/html/html_forms.asp
✅ Form automation completed successfully
Execution time: 1876ms

=== Screenshot Use Case ===
Starting screenshot capture for: https://example.com
✅ Screenshot captured successfully
Screenshot saved to: ./screenshots/example-2024-01-01T12-00-00-000Z.png
Execution time: 1234ms

✅ All use cases completed successfully!
🔌 Browser connection closed
```

### Connection Failure (Expected without Chrome)
```
🔗 Attempting connection to 127.0.0.1:9222
❌ Failed to connect to Chrome at 127.0.0.1:9222: connect ECONNREFUSED

🔗 Attempting connection to 35.197.149.222:9222
❌ Failed to connect to Chrome at 35.197.149.222:9222: connect ECONNREFUSED

❌ Application execution failed: Failed to establish connection to any Chrome instance

🔧 Troubleshooting Information:
1. Make sure Chrome is running with remote debugging enabled
2. Verify Chrome is accessible at: http://127.0.0.1:9222/json/version
3. Check firewall settings for remote connections
```

## Customizing Use Cases

### Adding New Use Cases

1. **Create Use Case Class:**
```typescript
// src/application/usecases/CustomUseCase.ts
export class CustomUseCase {
  constructor(
    private automationService: IAutomationService,
    private browserRepository: IBrowserRepository
  ) {}

  async execute(sessionId: string): Promise<UseCaseResult<any>> {
    // Your custom automation logic here
  }
}
```

2. **Register in Application Service:**
```typescript
// src/application/services/PlaywrightApplicationService.ts
private customUseCase: CustomUseCase;

constructor(...) {
  // ... existing code
  this.customUseCase = new CustomUseCase(automationService, browserRepository);
}

async runAllUseCases(): Promise<void> {
  // ... existing use cases
  await this.customUseCase.execute(sessionId);
}
```

### Modifying Existing Use Cases

Edit the use case files in `src/application/usecases/`:
- `WebScrapingUseCase.ts` - Change target website or selectors
- `FormAutomationUseCase.ts` - Modify form fields or target forms
- `ScreenshotUseCase.ts` - Adjust screenshot options or target pages

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors
- **Cause**: Import path issues
- **Solution**: Ensure all imports use relative paths (not @ aliases with ts-node)

#### 2. Chrome connection refused
- **Cause**: Chrome not running with remote debugging
- **Solution**: Start Chrome with `--remote-debugging-port=9222`

#### 3. Timeout errors
- **Cause**: Slow network or overloaded Chrome
- **Solution**: Increase `DEFAULT_TIMEOUT` in .env file

#### 4. Permission errors on screenshots
- **Cause**: Screenshots directory not writable
- **Solution**: Ensure `./screenshots` directory exists and is writable

### Debug Mode

Enable verbose logging by modifying the application:
```typescript
// Add to src/index.ts
process.env.DEBUG = 'pw:*';  // Enable Playwright debug logs
```

### Network Issues

For remote connections:
1. Test network connectivity: `ping 35.197.149.222`
2. Test port accessibility: `telnet 35.197.149.222 9222`
3. Check firewall rules on both client and server

## Production Deployment

### Security Considerations
- Use HTTPS for remote connections in production
- Implement authentication for remote Chrome access
- Run Chrome in sandboxed environment
- Monitor and log all automation activities

### Performance Optimization
- Use connection pooling for multiple concurrent sessions
- Implement caching for frequently accessed pages
- Add monitoring and metrics collection
- Use load balancing for multiple Chrome instances

### Scaling
- Deploy multiple Chrome instances behind a load balancer
- Use container orchestration (Docker/Kubernetes)
- Implement session management and cleanup
- Add health checks and auto-recovery
