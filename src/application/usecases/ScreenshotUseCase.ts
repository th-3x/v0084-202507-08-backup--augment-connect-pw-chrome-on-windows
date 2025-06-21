import { IAutomationService } from '../../domain/services/IAutomationService';
import { IBrowserRepository } from '../../domain/repositories/IBrowserRepository';
import { UseCaseResult, ScreenshotOptions } from '../../shared/types';
import { AppConfig } from '../../config/AppConfig';

export class ScreenshotUseCase {
  constructor(
    private automationService: IAutomationService,
    private browserRepository: IBrowserRepository
  ) {}

  async execute(sessionId: string): Promise<UseCaseResult<string>> {
    console.log('\n=== Screenshot Use Case ===');
    
    try {
      const config = AppConfig.getInstance();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Example: Take screenshot of a popular website
      const url = 'https://example.com';
      const screenshotOptions: ScreenshotOptions = {
        path: `${config.screenshotPath}/example-${timestamp}.jpg`,
        fullPage: true,
        quality: 90
      };

      console.log(`Starting screenshot capture for: ${url}`);
      const result = await this.automationService.takeScreenshot(
        sessionId, 
        url, 
        screenshotOptions
      );
      
      if (result.success) {
        console.log('✅ Screenshot captured successfully');
        console.log(`Execution time: ${result.executionTime}ms`);
        console.log(`Screenshot saved to: ${result.data}`);
      } else {
        console.log('❌ Screenshot capture failed:', result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in screenshot use case';
      console.error('Screenshot use case error:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        executionTime: 0,
        timestamp: new Date()
      };
    }
  }
}
