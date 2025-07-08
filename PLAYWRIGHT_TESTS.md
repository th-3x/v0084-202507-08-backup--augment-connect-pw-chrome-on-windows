# Playwright Remote Chrome Tests

## 🎯 **Quick Start**

1. **Install Playwright:**
   ```bash
   npm install
   npm install @playwright/test --save-dev
   npx playwright install
   ```

2. **Start Chrome with remote debugging:**
   ```bash
   # Use your configured port (from .env CHROME_PORT)
   .\scripts\start-chrome-preset.bat
   ```

3. **Run tests with UI:**
   ```bash
   npm run test:ui
   # OR
   npx playwright test --ui
   ```

## 🔧 **Configuration**

The tests automatically use your `.env` configuration:
- `CHROME_ADDRESS` - Chrome host (default: 127.0.0.1)
- `CHROME_PORT` - Chrome port (default: 9222)

## 🧪 **Available Tests**

### **Simple Remote Test** (`tests/simple-remote.spec.ts`)
- Basic navigation to example.com
- Simple form filling
- Screenshot capture

### **Comprehensive Remote Test** (`tests/remote-chrome.spec.ts`)
- Navigation testing
- Form interaction
- Web scraping
- Screenshot capture
- Content verification

## 🚀 **Running Tests**

### **UI Mode (Recommended)**
```bash
npm run test:ui
```
- Interactive test runner
- Visual debugging
- Step-by-step execution

### **Headless Mode**
```bash
npm run test:playwright
```

### **Specific Tests**
```bash
# Simple test only
npm run test:simple

# Remote Chrome tests only
npm run test:remote
```

### **Command Line Options**
```bash
# Run with specific browser
npx playwright test --project=remote-chrome

# Run in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/simple-remote.spec.ts
```

## 📊 **Test Results**

Tests will:
- ✅ Connect to your remote Chrome instance
- ✅ Navigate to test websites
- ✅ Fill forms and interact with elements
- ✅ Take screenshots (saved to `./screenshots/`)
- ✅ Generate HTML reports

## 🔍 **Troubleshooting**

### **Connection Issues**
```
Error: connect ECONNREFUSED 127.0.0.1:9222
```
**Solution:** Start Chrome with remote debugging:
```bash
.\scripts\start-chrome-preset.bat
```

### **Port Issues**
Make sure your `.env` file has the correct port:
```env
CHROME_PORT=9222  # or your custom port
CHROME_ADDRESS=127.0.0.1
```

### **Test Failures**
- Check Chrome is running and accessible
- Verify network connectivity
- Check console output for detailed errors

## 📁 **File Structure**

```
tests/
├── simple-remote.spec.ts     # Basic tests
├── remote-chrome.spec.ts     # Comprehensive tests
playwright.config.ts          # Playwright configuration
test-ui.bat                   # Quick UI test launcher
```

## 🎯 **Example Output**

When tests run successfully:
```
✅ Simple remote Chrome test completed!
✅ Form test completed!
📰 First article: Samsung Embeds IronSource Spyware...
📊 Found 30 articles
```

The tests demonstrate the same functionality as your main application but in a structured testing framework!
