import { IBrowserRepository } from '../../domain/repositories/IBrowserRepository';
import { IAutomationService } from '../../domain/services/IAutomationService';
import { WebScrapingUseCase } from '../usecases/WebScrapingUseCase';
import { FormAutomationUseCase } from '../usecases/FormAutomationUseCase';
import { ScreenshotUseCase } from '../usecases/ScreenshotUseCase';
import { AppConfig } from '../../config/AppConfig';
import { RetryUtils } from '../../shared/utils/RetryUtils';
import { BrowserConnectionResult } from '../../shared/types';

export class PlaywrightApplicationService {
  private webScrapingUseCase: WebScrapingUseCase;
  private formAutomationUseCase: FormAutomationUseCase;
  private screenshotUseCase: ScreenshotUseCase;

  constructor(
    private browserRepository: IBrowserRepository,
    private automationService: IAutomationService
  ) {
    this.webScrapingUseCase = new WebScrapingUseCase(automationService, browserRepository);
    this.formAutomationUseCase = new FormAutomationUseCase(automationService, browserRepository);
    this.screenshotUseCase = new ScreenshotUseCase(automationService, browserRepository);
  }

  async runAllUseCases(): Promise<void> {
    const config = AppConfig.getInstance();
    let sessionId: string | null = null;

    try {
      // Try to establish connection with retry logic
      sessionId = await this.establishConnection();
      
      if (!sessionId) {
        throw new Error('Failed to establish any browser connection');
      }

      console.log(`\n🚀 Running all use cases with session: ${sessionId}`);
      
      // Execute all use cases
      await this.webScrapingUseCase.execute(sessionId);
      await this.formAutomationUseCase.execute(sessionId);
      await this.screenshotUseCase.execute(sessionId);

      console.log('\n✅ All use cases completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Application execution failed:', error);
      throw error;
    } finally {
      // Clean up connection
      if (sessionId) {
        await this.browserRepository.disconnect(sessionId);
        console.log('\n🔌 Browser connection closed');
      }
    }
  }

  private async establishConnection(): Promise<string> {
    const config = AppConfig.getInstance();
    const connectionConfigs = config.getConnectionConfigs();

    // Try local connection first, then remote
    for (const connectionConfig of connectionConfigs) {
      try {
        console.log(`\n🔗 Attempting connection to ${connectionConfig.host}:${connectionConfig.port}`);
        
        const result: BrowserConnectionResult = await RetryUtils.withRetry(
          () => this.browserRepository.connect(connectionConfig),
          config.retryConfig,
          `connection to ${connectionConfig.host}:${connectionConfig.port}`
        );

        if (result.success && result.browser) {
          console.log(`✅ Successfully connected to ${connectionConfig.host}:${connectionConfig.port}`);
          return result.browser.id;
        }
      } catch (error) {
        console.warn(`❌ Failed to connect to ${connectionConfig.host}:${connectionConfig.port}:`, error);
        continue; // Try next connection
      }
    }

    throw new Error('Failed to establish connection to any Chrome instance');
  }
}
