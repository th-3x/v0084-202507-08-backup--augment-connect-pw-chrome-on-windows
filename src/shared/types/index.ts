// Shared types and interfaces
export interface ChromeConnectionConfig {
  host: string;
  port: number;
  timeout?: number;
}

export interface BrowserConnectionResult {
  success: boolean;
  browser?: any;
  error?: string;
}

export interface ScrapingResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
}

export interface FormData {
  [key: string]: string | number | boolean;
}

export interface ScreenshotOptions {
  path: string;
  fullPage?: boolean;
  quality?: number;
}

export interface UseCaseResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime: number;
  timestamp: Date;
}

export enum ConnectionType {
  LOCAL = 'local',
  REMOTE = 'remote'
}

export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
}

export interface ChromePresetConfig {
  port: number;
  address: string;
  userDataDir: string;
  windowSize: string;
}

export interface AutomationLogConfig {
  enabled: boolean;
  level: string;
  filePath: string;
}
