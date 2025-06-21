# Playwright Chrome Connection PoC

A TypeScript Playwright Proof of Concept with clean architecture that connects to both local and remote Chrome instances.

## 🎯 Project Status: ✅ COMPLETE

This PoC successfully demonstrates:
- ✅ **Clean Architecture** with TypeScript
- ✅ **Dual Chrome Connection** (local + remote fallback)
- ✅ **Three Working Use Cases** (scraping, forms, screenshots)
- ✅ **Robust Error Handling** and retry logic
- ✅ **Comprehensive Documentation** and helper scripts

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment configuration
cp .env.example .env
# Edit .env file to set your remote Chrome IP if needed

# 3. Start Chrome with remote debugging
scripts/start-chrome.bat  # Windows
# OR manually: chrome.exe --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug

# 4. Test connections
node scripts/test-connection.js

# 5. Run the demo
npm run dev
```

## 🏗️ Features

- **Clean Architecture**: Domain, Infrastructure, Application, and Presentation layers
- **Dual Connection Support**: Connects to local Chrome (127.0.0.1:9222) with fallback to remote Chrome (35.197.149.222:9222)
- **Three Use Cases**:
  1. **Web Scraping**: Extract data from websites (Hacker News demo)
  2. **Form Automation**: Fill forms automatically (W3Schools demo)
  3. **Screenshot Capture**: Take full-page screenshots (Example.com demo)
- **Robust Error Handling**: Retry logic with exponential backoff
- **TypeScript**: Full type safety and modern ES features

## 📋 Prerequisites

### Local Chrome Setup
1. Install Google Chrome
2. Start Chrome with remote debugging:
   ```bash
   # Windows
   chrome.exe --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=C:\temp\chrome-debug

   # macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=/tmp/chrome-debug

   # Linux
   google-chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --user-data-dir=/tmp/chrome-debug
   ```

3. Verify Chrome is accessible: http://127.0.0.1:9222/json/version

### Remote Chrome (Optional)
- Ensure remote Chrome instance at 35.197.149.222:9222 is accessible
- Configure firewall rules if necessary

## ⚙️ Configuration

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file to customize connection settings:**
   ```env
   # Chrome Connection Configuration
   LOCAL_CHROME_PORT=9222
   LOCAL_CHROME_HOST=127.0.0.1
   REMOTE_CHROME_PORT=9222
   REMOTE_CHROME_HOST=your-remote-chrome-ip-here

   # Application Configuration
   DEFAULT_TIMEOUT=30000
   RETRY_ATTEMPTS=3
   SCREENSHOT_PATH=./screenshots
   ```

3. **Important Security Note:**
   - The `.env` file is ignored by git to protect sensitive data
   - Never commit actual IP addresses or credentials to version control
   - Use `.env.example` as a template for other developers

## 🏛️ Architecture

```
src/
├── domain/           # Business logic and interfaces
│   ├── entities/     # Domain entities
│   ├── repositories/ # Repository interfaces
│   └── services/     # Service interfaces
├── infrastructure/   # External concerns
│   ├── repositories/ # Repository implementations
│   └── services/     # Service implementations
├── application/      # Use cases and application services
│   ├── usecases/     # Business use cases
│   └── services/     # Application orchestration
├── presentation/     # Controllers and UI
│   └── controllers/  # Application controllers
├── shared/           # Shared utilities and types
│   ├── types/        # Type definitions
│   └── utils/        # Utility functions
└── config/           # Configuration management
```

## 🎮 Usage

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 📚 Documentation

- **[USAGE_GUIDE.md](USAGE_GUIDE.md)** - Detailed step-by-step usage instructions
- **[TESTING_LOG.md](TESTING_LOG.md)** - Complete testing log and results
- **[ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md)** - Detailed architecture documentation

## 🔧 Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run built application
- `npm run dev` - Run in development mode with ts-node
- `npm run test` - Run tests (when implemented)
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build directory

## 🎯 Use Cases Demonstrated

### 1. Web Scraping Use Case
- Navigates to Hacker News
- Extracts article titles, metadata, and scores
- Demonstrates data extraction capabilities

### 2. Form Automation Use Case
- Navigates to W3Schools form example
- Fills multiple form fields automatically
- Shows form interaction capabilities

### 3. Screenshot Use Case
- Captures full-page screenshot of example.com
- Saves with timestamp to screenshots directory
- Demonstrates visual testing capabilities

## 🛡️ Error Handling

The application implements comprehensive error handling:

- **Connection Fallback**: Tries local Chrome first, then remote
- **Retry Logic**: Configurable retry attempts with exponential backoff
- **Graceful Degradation**: Continues with available connections
- **Detailed Logging**: Comprehensive logging for troubleshooting

## 🔍 Troubleshooting

### Chrome Connection Issues
1. Verify Chrome is running with remote debugging
2. Check if port 9222 is accessible
3. Ensure no firewall blocking
4. Try accessing http://127.0.0.1:9222/json/version

### Remote Connection Issues
1. Verify remote Chrome instance is running
2. Check network connectivity
3. Ensure remote debugging is enabled
4. Verify firewall rules allow connection

## 🧪 Testing Results

✅ **Build Process**: TypeScript compilation successful  
✅ **Import Resolution**: All modules load correctly  
✅ **Application Execution**: Clean architecture layers communicate properly  
✅ **Connection Logic**: Dual connection with fallback working  
✅ **Error Handling**: Comprehensive error handling with retry logic  
✅ **Use Cases**: All three use cases properly implemented  

## 🚀 Production Ready

This PoC demonstrates a production-ready architecture that can be extended with:
- Additional use cases
- More sophisticated error handling
- Monitoring and metrics
- Configuration management
- Testing framework integration

---

**Built with Clean Architecture principles using TypeScript and Playwright** 🎭
