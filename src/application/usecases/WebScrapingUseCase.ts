import { IAutomationService } from '../../domain/services/IAutomationService';
import { IBrowserRepository } from '../../domain/repositories/IBrowserRepository';
import { UseCaseResult, ScrapingResult } from '../../shared/types';

export class WebScrapingUseCase {
  constructor(
    private automationService: IAutomationService,
    private browserRepository: IBrowserRepository
  ) {}

  async execute(sessionId: string): Promise<UseCaseResult<ScrapingResult>> {
    console.log('\n=== Web Scraping Use Case ===');
    
    try {
      // Example: Scrape Hacker News front page
      const url = 'https://news.ycombinator.com';
      const selectors = [
        '.titleline > a', // Article titles
        '.subtext', // Article metadata
        '.score' // Article scores
      ];

      console.log(`Starting web scraping for: ${url}`);
      const result = await this.automationService.scrapeWebsite(sessionId, url, selectors);
      
      if (result.success && result.data) {
        console.log('✅ Web scraping completed successfully');
        console.log(`Execution time: ${result.executionTime}ms`);
        console.log('Sample scraped data:', JSON.stringify(result.data.data, null, 2).substring(0, 500) + '...');
      } else {
        console.log('❌ Web scraping failed:', result.error);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error in web scraping use case';
      console.error('Web scraping use case error:', errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        executionTime: 0,
        timestamp: new Date()
      };
    }
  }
}
