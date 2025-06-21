import { RetryConfig } from '../types';

export class RetryUtils {
  static async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig,
    operationName: string = 'operation'
  ): Promise<T> {
    let lastError: Error;
    let delay = config.delayMs;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        console.log(`Attempting ${operationName} (attempt ${attempt}/${config.maxAttempts})`);
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`${operationName} failed on attempt ${attempt}:`, lastError.message);

        if (attempt < config.maxAttempts) {
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
          delay *= config.backoffMultiplier || 1;
        }
      }
    }

    throw new Error(`${operationName} failed after ${config.maxAttempts} attempts. Last error: ${lastError!.message}`);
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
