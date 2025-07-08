// Simple Chrome preset connection and display test
const http = require('http');

async function quickTest(host, port) {
  return new Promise((resolve) => {
    const req = http.get(`http://${host}:${port}/json/version`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ success: true, data: JSON.parse(data) });
        } catch (error) {
          resolve({ success: false, error: 'Invalid response' });
        }
      });
    });
    req.on('error', () => resolve({ success: false, error: 'Connection failed' }));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function main() {
  // Load config
  require('dotenv').config();
  
  const host = process.env.CHROME_ADDRESS || '127.0.0.1';
  const port = parseInt(process.env.CHROME_PORT || '9223');
  const size = process.env.WINDOW_SIZE || '800,600';
  
  console.log('🔍 Quick Preset Test');
  console.log('===================');
  console.log(`Host: ${host}:${port}`);
  console.log(`Size: ${size}`);
  console.log('');
  
  const result = await quickTest(host, port);
  
  if (result.success) {
    console.log('✅ Connected!');
    console.log(`Browser: ${result.data.Browser}`);
    
    const [w, h] = size.split(',').map(n => parseInt(n));
    console.log(`Display: ${w}x${h} (${(w/h).toFixed(1)}:1)`);
  } else {
    console.log('❌ Failed:', result.error);
    console.log(`Try: chrome.exe --remote-debugging-port=${port} --window-size=${size}`);
  }
}

main().catch(console.error);
