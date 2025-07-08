# Configuration Guide - Multiple Chrome Instances

## 🔧 **Enhanced Configuration Options**

The application now supports multiple Chrome instances with intelligent fallback and preset configurations.

### **Connection Priority Order**
1. **Local Chrome** (127.0.0.1:9222)
2. **Remote Chrome Hosts** (multiple IPs, tried in order)
3. **Preset Chrome** (custom port/configuration)

## 📋 **Environment Variables**

### **Basic Chrome Configuration**
```env
# Local Chrome (highest priority)
LOCAL_CHROME_HOST=127.0.0.1
LOCAL_CHROME_PORT=9222

# Multiple Remote Chrome Hosts (comma-separated)
REMOTE_CHROME_HOSTS=35.197.149.222,35.197.149.223,35.197.149.224
REMOTE_CHROME_PORT=9222
```

### **Preset Chrome Configuration**
```env
# Alternative Chrome instance with custom settings
CHROME_PORT=9223
CHROME_ADDRESS=127.0.0.1
USER_DATA_DIR=/tmp/chrome-testing-profile
WINDOW_SIZE=800,600
```

### **Application Settings**
```env
# Timeouts and retries
DEFAULT_TIMEOUT=30000
RETRY_ATTEMPTS=3

# Output configuration
SCREENSHOT_PATH=./screenshots

# Logging
ENABLE_AUTOMATION_LOGGING=true
LOG_LEVEL=info
LOG_FILE=./logs/automation.log
```

## 🚀 **Usage Examples**

### **Example 1: Single Remote Host**
```env
REMOTE_CHROME_HOSTS=35.197.149.222
```

### **Example 2: Multiple Remote Hosts with Fallback**
```env
REMOTE_CHROME_HOSTS=35.197.149.222,35.197.149.223,backup-server.com
```

### **Example 3: Development Setup**
```env
LOCAL_CHROME_HOST=127.0.0.1
LOCAL_CHROME_PORT=9222
CHROME_PORT=9223
CHROME_ADDRESS=127.0.0.1
USER_DATA_DIR=C:\temp\chrome-testing
WINDOW_SIZE=1200,800
```

### **Example 4: Production Setup**
```env
LOCAL_CHROME_HOST=10.0.1.100
REMOTE_CHROME_HOSTS=10.0.1.101,10.0.1.102,10.0.1.103
REMOTE_CHROME_PORT=9222
DEFAULT_TIMEOUT=60000
RETRY_ATTEMPTS=5
```

## 🛠️ **Chrome Startup Scripts**

### **Standard Chrome**
```bash
# Windows
.\scripts\start-chrome.bat

# PowerShell
.\scripts\start-chrome.ps1
```

### **Preset Configuration Chrome**
```bash
# Windows
.\scripts\start-chrome-preset.bat

# PowerShell
.\scripts\start-chrome.ps1 -Mode preset
```

### **Multiple Chrome Instances**
```bash
# Start multiple instances for testing
.\scripts\start-multiple-chrome.bat
```

### **Custom Configuration**
```powershell
# PowerShell with custom parameters
.\scripts\start-chrome.ps1 -Port 9224 -Address "0.0.0.0" -UserDataDir "C:\temp\custom-chrome"
```

## 🔍 **Testing Connections**

### **Test All Configured Connections**
```bash
node scripts/test-connection.js
```

**Sample Output:**
```
🔍 Testing Chrome Remote Debugging Connections...

Testing local Chrome (127.0.0.1:9222)...
✅ Local Chrome connection successful!

Testing remote Chrome 1 (35.197.149.222:9222)...
❌ Remote Chrome 1 connection failed: connect ECONNREFUSED

Testing remote Chrome 2 (35.197.149.223:9222)...
✅ Remote Chrome 2 connection successful!

Testing preset Chrome (127.0.0.1:9223)...
✅ Preset Chrome connection successful!

🎯 Connection Test Summary:
✅ Local: 127.0.0.1:9222
❌ Remote-1: 35.197.149.222:9222
✅ Remote-2: 35.197.149.223:9222
❌ Remote-3: 35.197.149.224:9222
✅ Preset: 127.0.0.1:9223

📊 Results: 3/5 connections successful
```

## 🏗️ **Application Behavior**

### **Connection Attempt Process**
1. **Local Chrome**: Always tried first
2. **Remote Hosts**: Tried in order specified in `REMOTE_CHROME_HOSTS`
3. **Preset Chrome**: Tried last as fallback
4. **Retry Logic**: Each connection gets 3 retry attempts with exponential backoff

### **Success Criteria**
- Application needs **only ONE** successful connection to run
- First successful connection is used for all automation tasks
- Failed connections are logged but don't stop the process

## 🔧 **Advanced Configuration**

### **Network-Specific Settings**
```env
# For VPN environments
REMOTE_CHROME_HOSTS=10.0.1.100,10.0.1.101
DEFAULT_TIMEOUT=45000

# For cloud environments
REMOTE_CHROME_HOSTS=chrome-1.internal,chrome-2.internal,chrome-3.internal
RETRY_ATTEMPTS=5
```

### **Development vs Production**
```env
# Development
REMOTE_CHROME_HOSTS=localhost,127.0.0.1
ENABLE_AUTOMATION_LOGGING=true
LOG_LEVEL=debug

# Production
REMOTE_CHROME_HOSTS=prod-chrome-1,prod-chrome-2,prod-chrome-3
ENABLE_AUTOMATION_LOGGING=false
LOG_LEVEL=error
```

## 🚨 **Troubleshooting**

### **No Connections Available**
```
❌ Failed to establish connection to any of the 5 Chrome instances

📊 Connection Summary:
   Local: 127.0.0.1:9222
   Remote hosts: 35.197.149.222, 35.197.149.223
   Preset: 127.0.0.1:9223
```

**Solutions:**
1. Start at least one Chrome instance
2. Check firewall settings
3. Verify IP addresses are correct
4. Test individual connections

### **Partial Connections**
If some connections work but others fail, the application will use the first successful connection and continue normally.

### **Performance Optimization**
- Put fastest/most reliable hosts first in `REMOTE_CHROME_HOSTS`
- Use local Chrome when possible for best performance
- Adjust `DEFAULT_TIMEOUT` based on network conditions

## 📊 **Monitoring**

The application provides detailed logging of connection attempts:
- Connection attempt order
- Success/failure for each host
- Retry attempts and timing
- Final connection summary

This helps identify network issues and optimize host ordering for better performance.
