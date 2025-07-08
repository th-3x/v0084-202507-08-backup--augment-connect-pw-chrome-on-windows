import { test, expect, chromium } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CHROME_ADDRESS = process.env.CHROME_ADDRESS || '127.0.0.1';
const CHROME_PORT = process.env.CHROME_PORT || '9222';

test.describe('Simple Remote Chrome Test', () => {
  test('basic navigation test', async () => {
    // Connect to remote Chrome
    const browser = await chromium.connectOverCDP(`http://${CHROME_ADDRESS}:${CHROME_PORT}`);
    const page = await browser.newPage();
    // Navigate to example.com
    await page.goto('https://example.com');
    
    // Check title
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Check heading
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Example Domain');
    
    // Take screenshot
    await page.screenshot({ path: './screenshots/simple-test.png' });

    console.log('✅ Simple remote Chrome test completed!');

    await browser.close();
  });

  test('form test', async () => {
    // Connect to remote Chrome
    const browser = await chromium.connectOverCDP(`http://${CHROME_ADDRESS}:${CHROME_PORT}`);
    const page = await browser.newPage();
    // Go to form page
    await page.goto('https://httpbin.org/forms/post');
    
    // Fill form
    await page.fill('input[name="custname"]', 'Remote Test');
    await page.fill('input[name="custemail"]', 'remote@test.com');
    
    // Verify values
    await expect(page.locator('input[name="custname"]')).toHaveValue('Remote Test');

    console.log('✅ Form test completed!');

    await browser.close();
  });
});
