import { ScrapingResult, FormData, ScreenshotOptions, UseCaseResult } from '../../shared/types';

export interface IAutomationService {
  scrapeWebsite(sessionId: string, url: string, selectors: string[]): Promise<UseCaseResult<ScrapingResult>>;
  fillForm(sessionId: string, url: string, formData: FormData, submitSelector?: string): Promise<UseCaseResult<boolean>>;
  takeScreenshot(sessionId: string, url: string, options: ScreenshotOptions): Promise<UseCaseResult<string>>;
}
