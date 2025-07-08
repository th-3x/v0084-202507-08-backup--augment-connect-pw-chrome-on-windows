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
    const connectionConfigs = config.getAllConnectionConfigs();

    console.log(`\n🔗 Attempting to connect to ${connectionConfigs.length} Chrome instances...`);

    // Try all connections in order: local, remote hosts, preset
    for (let i = 0; i < connectionConfigs.length; i++) {
      const connectionConfig = connectionConfigs[i];
      const connectionType = i === 0 ? 'local' :
                           i <= config.remoteHosts.length ? `remote-${i}` : 'preset';

      try {
        console.log(`\n🔗 [${i + 1}/${connectionConfigs.length}] Attempting ${connectionType} connection to ${connectionConfig.host}:${connectionConfig.port}`);

        const result: BrowserConnectionResult = await RetryUtils.withRetry(
          () => this.browserRepository.connect(connectionConfig),
          config.retryConfig,
          `${connectionType} connection to ${connectionConfig.host}:${connectionConfig.port}`
        );

        if (result.success && result.browser) {
          console.log(`✅ Successfully connected to ${connectionType} Chrome: ${connectionConfig.host}:${connectionConfig.port}`);
          return result.browser.id;
        }
      } catch (error) {
        console.warn(`❌ Failed to connect to ${connectionType} Chrome (${connectionConfig.host}:${connectionConfig.port}):`, error);
        continue; // Try next connection
      }
    }

    // Show summary of attempted connections
    console.log(`\n📊 Connection Summary:`);
    console.log(`   Local: ${config.localChrome.host}:${config.localChrome.port}`);
    console.log(`   Remote hosts: ${config.remoteHosts.join(', ')}`);
    console.log(`   Preset: ${config.chromePreset.address}:${config.chromePreset.port}`);

    throw new Error(`Failed to establish connection to any of the ${connectionConfigs.length} Chrome instances`);
  }
}
