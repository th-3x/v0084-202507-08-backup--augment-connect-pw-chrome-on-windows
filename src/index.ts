import { PlaywrightBrowserRepository } from './infrastructure/repositories/PlaywrightBrowserRepository';
import { PlaywrightAutomationService } from './infrastructure/services/PlaywrightAutomationService';
import { PlaywrightApplicationService } from './application/services/PlaywrightApplicationService';
import { PlaywrightController } from './presentation/controllers/PlaywrightController';

async function main(): Promise<void> {
  try {
    // Dependency injection setup following clean architecture
    const browserRepository = new PlaywrightBrowserRepository();
    const automationService = new PlaywrightAutomationService(browserRepository);
    const applicationService = new PlaywrightApplicationService(browserRepository, automationService);
    const controller = new PlaywrightController(applicationService);

    // Run the demo
    await controller.runDemo();
    
    process.exit(0);
  } catch (error) {
    console.error('Application failed:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the application
main();
