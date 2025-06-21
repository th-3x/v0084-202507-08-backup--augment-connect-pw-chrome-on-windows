import { PlaywrightApplicationService } from '../../application/services/PlaywrightApplicationService';

export class PlaywrightController {
  constructor(private applicationService: PlaywrightApplicationService) {}

  async runDemo(): Promise<void> {
    console.log('🎭 Playwright Chrome Connection PoC');
    console.log('=====================================');
    console.log('This demo will attempt to connect to Chrome and run three use cases:');
    console.log('1. Web Scraping - Extract data from a website');
    console.log('2. Form Automation - Fill out a form automatically');
    console.log('3. Screenshot Capture - Take a screenshot of a webpage');
    console.log('');

    try {
      const startTime = Date.now();
      
      await this.applicationService.runAllUseCases();
      
      const totalTime = Date.now() - startTime;
      console.log(`\n🎉 Demo completed successfully in ${totalTime}ms`);
      
    } catch (error) {
      console.error('\n💥 Demo failed:', error);
      
      // Provide helpful troubleshooting information
      this.printTroubleshootingInfo();
      
      throw error;
    }
  }

  private printTroubleshootingInfo(): void {
    console.log('\n🔧 Troubleshooting Information:');
    console.log('================================');
    console.log('1. Make sure Chrome is running with remote debugging enabled:');
    console.log('   chrome.exe --remote-debugging-port=9222 --no-first-run --no-default-browser-check');
    console.log('');
    console.log('2. For local connection, verify Chrome is accessible at:');
    console.log('   http://127.0.0.1:9222/json/version');
    console.log('');
    console.log('3. For remote connection, verify the remote Chrome instance is:');
    console.log('   - Running with remote debugging enabled');
    console.log('   - Accessible from your network');
    console.log('   - Not blocked by firewall');
    console.log('');
    console.log('4. Check the .env file for correct configuration');
  }
}
