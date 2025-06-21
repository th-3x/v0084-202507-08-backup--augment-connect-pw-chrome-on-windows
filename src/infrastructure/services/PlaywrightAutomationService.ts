import { IAutomationService } from '../../domain/services/IAutomationService';
import { IBrowserRepository } from '../../domain/repositories/IBrowserRepository';
import { ScrapingResult, FormData, ScreenshotOptions, UseCaseResult } from '../../shared/types';

export class PlaywrightAutomationService implements IAutomationService {
  constructor(private browserRepository: IBrowserRepository) {}

  async scrapeWebsite(
    sessionId: string, 
    url: string, 
    selectors: string[]
  ): Promise<UseCaseResult<ScrapingResult>> {
    const startTime = Date.now();
    
    try {
      const session = this.browserRepository.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const page = await session.createPage();
      console.log(`Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      const scrapedData: { [key: string]: string } = {};
      
      for (const selector of selectors) {
        try {
          const element = await page.locator(selector).first();
          const text = await element.textContent();
          scrapedData[selector] = text || '';
          console.log(`Scraped ${selector}: ${text?.substring(0, 100)}...`);
        } catch (error) {
          console.warn(`Failed to scrape selector ${selector}:`, error);
          scrapedData[selector] = '';
        }
      }

      const result: ScrapingResult = {
        success: true,
        data: scrapedData,
        timestamp: new Date()
      };

      return {
        success: true,
        data: result,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown scraping error';
      console.error('Scraping failed:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  async fillForm(
    sessionId: string, 
    url: string, 
    formData: FormData, 
    submitSelector?: string
  ): Promise<UseCaseResult<boolean>> {
    const startTime = Date.now();
    
    try {
      const session = this.browserRepository.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const page = await session.createPage();
      console.log(`Navigating to form page: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // Fill form fields
      for (const [selector, value] of Object.entries(formData)) {
        try {
          await page.locator(selector).fill(String(value));
          console.log(`Filled field ${selector} with: ${value}`);
        } catch (error) {
          console.warn(`Failed to fill field ${selector}:`, error);
        }
      }

      // Submit form if selector provided
      if (submitSelector) {
        await page.locator(submitSelector).click();
        console.log(`Clicked submit button: ${submitSelector}`);
        await page.waitForTimeout(2000); // Wait for form submission
      }

      return {
        success: true,
        data: true,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown form filling error';
      console.error('Form filling failed:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  async takeScreenshot(
    sessionId: string, 
    url: string, 
    options: ScreenshotOptions
  ): Promise<UseCaseResult<string>> {
    const startTime = Date.now();
    
    try {
      const session = this.browserRepository.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const page = await session.createPage();
      console.log(`Navigating to screenshot page: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle' });

      await page.screenshot({
        path: options.path,
        fullPage: options.fullPage || false,
        quality: options.quality || 80
      });

      console.log(`Screenshot saved to: ${options.path}`);

      return {
        success: true,
        data: options.path,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown screenshot error';
      console.error('Screenshot failed:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        executionTime: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }
}
