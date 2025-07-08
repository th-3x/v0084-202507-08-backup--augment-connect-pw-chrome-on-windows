// Simple script to test preset Chrome connection and display size
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

async function getDisplayInfo(host, port) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/json`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const tabs = JSON.parse(data);
          if (tabs.length > 0) {
            // Get the first tab's info
            const tab = tabs[0];
            resolve({ 
              success: true, 
              data: {
                tabCount: tabs.length,
                firstTab: {
                  title: tab.title || 'Unknown',
                  url: tab.url || 'Unknown',
                  id: tab.id || 'Unknown'
                }
              }
            });
          } else {
            resolve({ success: true, data: { tabCount: 0 } });
          }
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

async function testPresetConnection() {
  console.log('🔍 Testing Preset Chrome Connection & Display Info');
  console.log('================================================');
  console.log('');

  // Load environment variables
  require('dotenv').config();
  
  const presetHost = process.env.CHROME_ADDRESS || '127.0.0.1';
  const presetPort = parseInt(process.env.CHROME_PORT || '9223');
  const windowSize = process.env.WINDOW_SIZE || '800,600';
  const userDataDir = process.env.USER_DATA_DIR || '/tmp/chrome-testing-profile';

  console.log('📋 Preset Configuration:');
  console.log(`   Host: ${presetHost}`);
  console.log(`   Port: ${presetPort}`);
  console.log(`   Window Size: ${windowSize}`);
  console.log(`   User Data Dir: ${userDataDir}`);
  console.log('');

  // Test connection
  console.log(`🔗 Testing connection to ${presetHost}:${presetPort}...`);
  const connectionResult = await testConnection(presetHost, presetPort);
  
  if (connectionResult.success) {
    console.log('✅ Preset Chrome connection successful!');
    console.log(`   Browser: ${connectionResult.data.Browser}`);
    console.log(`   User Agent: ${connectionResult.data['User-Agent']}`);
    console.log(`   WebKit Version: ${connectionResult.data['WebKit-Version']}`);
    console.log('');

    // Get display/tab information
    console.log('📱 Getting display and tab information...');
    const displayResult = await getDisplayInfo(presetHost, presetPort);
    
    if (displayResult.success) {
      console.log('✅ Display info retrieved successfully!');
      console.log(`   Active Tabs: ${displayResult.data.tabCount}`);
      
      if (displayResult.data.tabCount > 0) {
        console.log('   First Tab:');
        console.log(`     Title: ${displayResult.data.firstTab.title}`);
        console.log(`     URL: ${displayResult.data.firstTab.url}`);
        console.log(`     ID: ${displayResult.data.firstTab.id}`);
      }
      
      // Parse and display window size
      const [width, height] = windowSize.split(',').map(s => parseInt(s.trim()));
      console.log('');
      console.log('🖥️  Display Configuration:');
      console.log(`   Configured Size: ${width} x ${height} pixels`);
      console.log(`   Aspect Ratio: ${(width/height).toFixed(2)}:1`);
      
      if (width >= 1920) {
        console.log('   Display Type: Full HD or higher');
      } else if (width >= 1280) {
        console.log('   Display Type: HD');
      } else {
        console.log('   Display Type: Standard');
      }
      
    } else {
      console.log('❌ Failed to get display info:', displayResult.error);
    }
    
  } else {
    console.log('❌ Preset Chrome connection failed:', connectionResult.error);
    console.log('');
    console.log('💡 Troubleshooting:');
    console.log('   1. Start Chrome with preset configuration:');
    console.log('      .\\scripts\\start-chrome-preset.bat');
    console.log('   2. Or manually:');
    console.log(`      chrome.exe --remote-debugging-port=${presetPort} --remote-debugging-address=${presetHost} --window-size=${windowSize}`);
    console.log('   3. Verify the connection:');
    console.log(`      http://${presetHost}:${presetPort}/json/version`);
  }

  console.log('');
  console.log('🎯 Test completed!');
}

// Run the test
testPresetConnection().catch(console.error);
