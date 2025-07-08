import { test, expect, chromium } from '@playwright/test';

test.describe('Hardcoded Chrome Test', () => {
  test('connect to local Chrome directly', async () => {
    // Hardcode the connection to avoid environment issues
    const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
    const page = await browser.newPage();

    console.log('✅ Connected to Chrome at 127.0.0.1:9222');

    await test.step('Test basic navigation', async () => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example Domain/);
      console.log('✅ Navigation test passed');
    });

    await test.step('Test IP check with mixed content handling', async () => {
      // Suppress mixed content warnings
      page.on('console', msg => {
        if (msg.type() === 'warning' && msg.text().includes('Mixed Content')) {
          return; // Ignore these - they're expected
        }
        console.log(`Browser: ${msg.text()}`);
      });

      await page.goto('https://ifconfig.me/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      
      const ipText = await page.textContent('body');
      expect(ipText).toBeTruthy();
      
      const cleanIP = ipText!.trim();
      expect(cleanIP).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      
      console.log(`🌐 Your IP: ${cleanIP}`);
      console.log('✅ IP check passed (mixed content warnings are normal)');
    });

    await test.step('Take screenshot', async () => {
      await page.screenshot({ path: './screenshots/hardcoded-test.png' });
      console.log('📸 Screenshot saved');
    });

    await browser.close();
    console.log('✅ Test completed successfully');
  });
});
