import { test, expect, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CHROME_ADDRESS = process.env.CHROME_ADDRESS || '127.0.0.1';
const CHROME_PORT = process.env.CHROME_PORT || '9222';

test.describe('IP Check Test', () => {
  test('check external IP address', async () => {
    // Connect to remote Chrome
    const browser = await chromium.connectOverCDP(`http://${CHROME_ADDRESS}:${CHROME_PORT}`);
    const page = await browser.newPage();

    // Suppress console warnings for mixed content (this is expected)
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().includes('Mixed Content')) {
        // Ignore mixed content warnings - they're expected on some sites
        return;
      }
      console.log(`Browser console: ${msg.text()}`);
    });

    await test.step('Get external IP address', async () => {
      await page.goto('https://ifconfig.me/', { waitUntil: 'domcontentloaded' });
      
      // Wait for the IP to load
      await page.waitForTimeout(2000);
      
      // Get the IP address from the page
      const ipElement = await page.locator('body').first();
      const ipText = await ipElement.textContent();
      
      expect(ipText).toBeTruthy();
      const cleanIP = ipText!.trim();
      
      // Validate IP format (basic check)
      expect(cleanIP).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      
      console.log(`🌐 External IP: ${cleanIP}`);
      console.log(`🔗 Connected via: ${CHROME_ADDRESS}:${CHROME_PORT}`);
    });

    await test.step('Take screenshot of IP page', async () => {
      await page.screenshot({ 
        path: './screenshots/ip-check.png',
        fullPage: true 
      });
      console.log('📸 Screenshot saved: ./screenshots/ip-check.png');
    });

    await browser.close();
  });

  test('check user agent info', async () => {
    const browser = await chromium.connectOverCDP(`http://${CHROME_ADDRESS}:${CHROME_PORT}`);
    const page = await browser.newPage();

    // Suppress mixed content warnings
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().includes('Mixed Content')) {
        return;
      }
    });

    await test.step('Get user agent information', async () => {
      await page.goto('https://ifconfig.me/ua', { waitUntil: 'domcontentloaded' });
      
      await page.waitForTimeout(1000);
      
      const userAgent = await page.textContent('body');
      expect(userAgent).toBeTruthy();
      expect(userAgent).toContain('Chrome');
      
      console.log(`🤖 User Agent: ${userAgent!.trim()}`);
    });

    await browser.close();
  });
});
