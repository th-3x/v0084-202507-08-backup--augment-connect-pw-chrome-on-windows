import * as dotenv from 'dotenv';
import { ChromeConnectionConfig, RetryConfig, ChromePresetConfig, AutomationLogConfig } from '../shared/types';

dotenv.config();

export class AppConfig {
  private static instance: AppConfig;

  public readonly localChrome: ChromeConnectionConfig;
  public readonly remoteChrome: ChromeConnectionConfig;
  public readonly remoteHosts: string[];
  public readonly chromePreset: ChromePresetConfig;
  public readonly defaultTimeout: number;
  public readonly retryConfig: RetryConfig;
  public readonly screenshotPath: string;
  public readonly logConfig: AutomationLogConfig;

  private constructor() {
    this.localChrome = {
      host: process.env.LOCAL_CHROME_HOST || '127.0.0.1',
      port: parseInt(process.env.LOCAL_CHROME_PORT || '9222'),
      timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
    };

    // Parse multiple remote hosts
    const remoteHostsString = process.env.REMOTE_CHROME_HOSTS || '35.197.149.222';
    this.remoteHosts = remoteHostsString.split(',').map(host => host.trim()).filter(host => host.length > 0);

    // Use first remote host as primary
    this.remoteChrome = {
      host: this.remoteHosts[0] || '35.197.149.222',
      port: parseInt(process.env.REMOTE_CHROME_PORT || '9222'),
      timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
    };

    // Chrome preset configuration
    this.chromePreset = {
      port: parseInt(process.env.CHROME_PORT || '9223'),
      address: process.env.CHROME_ADDRESS || '127.0.0.1',
      userDataDir: process.env.USER_DATA_DIR || '/tmp/chrome-testing-profile',
      windowSize: process.env.WINDOW_SIZE || '800,600'
    };

    this.defaultTimeout = parseInt(process.env.DEFAULT_TIMEOUT || '30000');

    this.retryConfig = {
      maxAttempts: parseInt(process.env.RETRY_ATTEMPTS || '3'),
      delayMs: 1000,
      backoffMultiplier: 2
    };

    this.screenshotPath = process.env.SCREENSHOT_PATH || './screenshots';

    // Logging configuration
    this.logConfig = {
      enabled: process.env.ENABLE_AUTOMATION_LOGGING === 'true',
      level: process.env.LOG_LEVEL || 'info',
      filePath: process.env.LOG_FILE || './logs/automation.log'
    };
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public getConnectionConfigs(): ChromeConnectionConfig[] {
    const configs = [this.localChrome];

    // Add all remote hosts as connection options
    for (const host of this.remoteHosts) {
      configs.push({
        host: host,
        port: parseInt(process.env.REMOTE_CHROME_PORT || '9222'),
        timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000')
      });
    }

    return configs;
  }

  public getChromePresetConfig(): ChromeConnectionConfig {
    return {
      host: this.chromePreset.address,
      port: this.chromePreset.port,
      timeout: this.defaultTimeout
    };
  }

  public getAllConnectionConfigs(): ChromeConnectionConfig[] {
    return [...this.getConnectionConfigs(), this.getChromePresetConfig()];
  }
}
