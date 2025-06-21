import { BrowserSession } from '../entities/BrowserSession';
import { ChromeConnectionConfig, BrowserConnectionResult } from '../../shared/types';

export interface IBrowserRepository {
  connect(config: ChromeConnectionConfig): Promise<BrowserConnectionResult>;
  disconnect(sessionId: string): Promise<void>;
  getSession(sessionId: string): BrowserSession | null;
  getAllSessions(): BrowserSession[];
  isConnected(sessionId: string): boolean;
}
