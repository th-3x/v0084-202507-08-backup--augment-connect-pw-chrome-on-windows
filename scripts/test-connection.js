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

  // Load environment variables
  require('dotenv').config();

  const localHost = process.env.LOCAL_CHROME_HOST || '127.0.0.1';
  const localPort = parseInt(process.env.LOCAL_CHROME_PORT || '9222');
  const remoteHosts = (process.env.REMOTE_CHROME_HOSTS || '35.197.149.222').split(',').map(h => h.trim());
  const remotePort = parseInt(process.env.REMOTE_CHROME_PORT || '9222');
  const presetHost = process.env.CHROME_ADDRESS || '127.0.0.1';
  const presetPort = parseInt(process.env.CHROME_PORT || '9223');

  let successCount = 0;
  const results = [];

  // Test local connection
  console.log(`Testing local Chrome (${localHost}:${localPort})...`);
  const localResult = await testConnection(localHost, localPort);
  results.push({ type: 'Local', host: localHost, port: localPort, result: localResult });

  if (localResult.success) {
    console.log('✅ Local Chrome connection successful!');
    console.log(`   Browser: ${localResult.data.Browser}`);
    console.log(`   WebKit: ${localResult.data['WebKit-Version']}`);
    successCount++;
  } else {
    console.log('❌ Local Chrome connection failed:', localResult.error);
    console.log('   Make sure Chrome is running with: chrome.exe --remote-debugging-port=9222');
  }

  console.log('');

  // Test all remote connections
  for (let i = 0; i < remoteHosts.length; i++) {
    const host = remoteHosts[i];
    console.log(`Testing remote Chrome ${i + 1} (${host}:${remotePort})...`);
    const remoteResult = await testConnection(host, remotePort);
    results.push({ type: `Remote-${i + 1}`, host: host, port: remotePort, result: remoteResult });

    if (remoteResult.success) {
      console.log(`✅ Remote Chrome ${i + 1} connection successful!`);
      console.log(`   Browser: ${remoteResult.data.Browser}`);
      console.log(`   WebKit: ${remoteResult.data['WebKit-Version']}`);
      successCount++;
    } else {
      console.log(`❌ Remote Chrome ${i + 1} connection failed:`, remoteResult.error);
      console.log('   Check network connectivity and firewall settings');
    }
    console.log('');
  }

  // Test preset connection
  console.log(`Testing preset Chrome (${presetHost}:${presetPort})...`);
  const presetResult = await testConnection(presetHost, presetPort);
  results.push({ type: 'Preset', host: presetHost, port: presetPort, result: presetResult });

  if (presetResult.success) {
    console.log('✅ Preset Chrome connection successful!');
    console.log(`   Browser: ${presetResult.data.Browser}`);
    console.log(`   WebKit: ${presetResult.data['WebKit-Version']}`);
    successCount++;
  } else {
    console.log('❌ Preset Chrome connection failed:', presetResult.error);
    console.log('   Make sure Chrome is running with the preset configuration');
  }

  // Summary
  console.log('\n🎯 Connection Test Summary:');
  console.log('================================');
  results.forEach(r => {
    const status = r.result.success ? '✅' : '❌';
    console.log(`${status} ${r.type}: ${r.host}:${r.port}`);
  });

  console.log(`\n📊 Results: ${successCount}/${results.length} connections successful`);

  if (successCount > 0) {
    console.log('\n✅ At least one Chrome instance is available. You can run the main application now!');
    console.log('   Run: npm run dev');
  } else {
    console.log('\n❌ No Chrome instances are available. Please check the troubleshooting guide.');
  }
}

main().catch(console.error);
