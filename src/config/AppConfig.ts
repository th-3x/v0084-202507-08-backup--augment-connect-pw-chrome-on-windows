import * as dotenv from 'dotenv';
import { ChromeConnectionConfig, RetryConfig } from '../shared/types';

dotenv.config();

export class AppConfig {
  private static instance: AppConfig;

  public readonly localChrome: ChromeConnectionConfig;
  public readonly remoteChrome: ChromeConnectionConfig;
  public readonly defaultTimeout: number;
  public readonly retryConfig: RetryConfig;
  public readonly screenshotPath: string;

  private constructor() {
    this.localChrome = {
      host: process.env.LOCAL_CHROME_HOST || '127.0.0.1',
      port: parseInt(process.env.LOCAL_CHROME_PORT || '9222'),
      timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
    };

    this.remoteChrome = {
      host: process.env.REMOTE_CHROME_HOST || '35.197.149.222',
      port: parseInt(process.env.REMOTE_CHROME_PORT || '9222'),
      timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
    };

    this.defaultTimeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000');
    
    this.retryConfig = {
      maxAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
      delayMs: 1000,
      backoffMultiplier: 2
    };

    this.screenshotPath = process.env.SCREENSHOT_PATH || './screenshots';
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public getConnectionConfigs(): ChromeConnectionConfig[] {
    return [this.localChrome, this.remoteChrome];
  }
}
