import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const CHROME_ADDRESS = process.env.CHROME_ADDRESS || '127.0.0.1';
const CHROME_PORT = process.env.CHROME_PORT || '9222';

test.describe('Remote Chrome Tests', () => {
  test.beforeAll(async () => {
    console.log(`🔗 Using remote Chrome: ${CHROME_ADDRESS}:${CHROME_PORT}`);
  });

  test('should connect to remote Chrome and navigate to example.com', async ({ browser }) => {
    const page = await browser.newPage();
    
    await test.step('Navigate to https://ifconfig.me/', async () => {
      await page.goto('https://ifconfig.me/');
      // Wait for page to load
      await page.waitForTimeout(3000);

      // Check that we got an IP address (the main content)
      const ipText = await page.textContent('body');
      expect(ipText).toBeTruthy();
      expect(ipText!.trim()).toMatch(/^\d+\.\d+\.\d+\.\d+$/); // IP address pattern

      console.log(`🌐 Your IP address: ${ipText!.trim()}`);
    });

    await test.step('Navigate to example.com', async () => {
      await page.goto('https://example.com');
      await expect(page).toHaveTitle(/Example Domain/);
    });

    await test.step('Verify page content', async () => {
      const heading = page.locator('h1');
      await expect(heading).toHaveText('Example Domain');
    });

    await test.step('Check page elements', async () => {
      const paragraph = page.locator('p').first();
      await expect(paragraph).toContainText('This domain is for use in illustrative examples');
    });

    await page.close();
  });

  test('should take a screenshot', async ({ browser }) => {
    const page = await browser.newPage();
    
    await test.step('Navigate and capture screenshot', async () => {
      await page.goto('https://example.com');
      await page.screenshot({ 
        path: './screenshots/remote-chrome-test.png',
        fullPage: true 
      });
    });

    await page.close();
  });

  test('should test form interaction', async ({ browser }) => {
    const page = await browser.newPage();
    
    await test.step('Navigate to form demo', async () => {
      await page.goto('https://httpbin.org/forms/post');
    });

    await test.step('Fill form fields', async () => {
      await page.fill('input[name="custname"]', 'Test User');
      await page.fill('input[name="custtel"]', '123-456-7890');
      await page.fill('input[name="custemail"]', 'test@example.com');
      await page.fill('textarea[name="comments"]', 'Playwright remote Chrome test');
    });

    await test.step('Verify form values', async () => {
      await expect(page.locator('input[name="custname"]')).toHaveValue('Test User');
      await expect(page.locator('input[name="custemail"]')).toHaveValue('test@example.com');
    });

    await page.close();
  });

  test('should test web scraping', async ({ browser }) => {
    const page = await browser.newPage();
    
    await test.step('Navigate to news site', async () => {
      await page.goto('https://news.ycombinator.com');
    });

    await test.step('Extract and verify content', async () => {
      const firstTitle = await page.locator('.titleline > a').first().textContent();
      expect(firstTitle).toBeTruthy();
      expect(firstTitle!.length).toBeGreaterThan(5);
      
      console.log(`📰 First article: ${firstTitle}`);
    });

    await test.step('Count articles', async () => {
      const articleCount = await page.locator('.titleline > a').count();
      expect(articleCount).toBeGreaterThan(10);
      
      console.log(`📊 Found ${articleCount} articles`);
    });

    await page.close();
  });
});
