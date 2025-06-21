// Simple connection test script
const http = require('http');

async function testConnection(host, port) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/json/version`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ success: true, data: parsed });
        } catch (error) {
          resolve({ success: false, error: 'Invalid JSON response' });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ success: false, error: 'Connection timeout' });
    });
  });
}

async function main() {
  console.log('🔍 Testing Chrome Remote Debugging Connections...\n');

  // Test local connection
  console.log('Testing local Chrome (127.0.0.1:9222)...');
  const localResult = await testConnection('127.0.0.1', 9222);
  
  if (localResult.success) {
    console.log('✅ Local Chrome connection successful!');
    console.log(`   Browser: ${localResult.data.Browser}`);
    console.log(`   WebKit: ${localResult.data['WebKit-Version']}`);
  } else {
    console.log('❌ Local Chrome connection failed:', localResult.error);
    console.log('   Make sure Chrome is running with: chrome.exe --remote-debugging-port=9222');
  }

  console.log('');

  // Test remote connection
  console.log('Testing remote Chrome (35.197.149.222:9222)...');
  const remoteResult = await testConnection('35.197.149.222', 9222);
  
  if (remoteResult.success) {
    console.log('✅ Remote Chrome connection successful!');
    console.log(`   Browser: ${remoteResult.data.Browser}`);
    console.log(`   WebKit: ${remoteResult.data['WebKit-Version']}`);
  } else {
    console.log('❌ Remote Chrome connection failed:', remoteResult.error);
    console.log('   Check network connectivity and firewall settings');
  }

  console.log('\n🎯 Connection test completed!');
  
  if (localResult.success || remoteResult.success) {
    console.log('\n✅ At least one Chrome instance is available. You can run the main application now!');
    console.log('   Run: npm run dev');
  } else {
    console.log('\n❌ No Chrome instances are available. Please check the troubleshooting guide.');
  }
}

main().catch(console.error);
