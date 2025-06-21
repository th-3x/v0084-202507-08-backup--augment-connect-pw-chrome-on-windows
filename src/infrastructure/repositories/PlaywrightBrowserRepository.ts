import { chromium } from 'playwright';
import { IBrowserRepository } from '../../domain/repositories/IBrowserRepository';
import { BrowserSession } from '../../domain/entities/BrowserSession';
import { ChromeConnectionConfig, BrowserConnectionResult, ConnectionType } from '../../shared/types';

export class PlaywrightBrowserRepository implements IBrowserRepository {
  private sessions: Map<string, BrowserSession> = new Map();

  async connect(config: ChromeConnectionConfig): Promise<BrowserConnectionResult> {
    try {
      console.log(`Attempting to connect to Chrome at ${config.host}:${config.port}`);
      
      const browser = await chromium.connectOverCDP({
        endpointURL: `http://${config.host}:${config.port}`,
        timeout: config.timeout || 30000
      });

      const sessionId = this.generateSessionId();
      const connectionType = config.host === '127.0.0.1' || config.host === 'localhost' 
        ? ConnectionType.LOCAL 
        : ConnectionType.REMOTE;

      const session = new BrowserSession(
        sessionId,
        connectionType,
        config.host,
        config.port,
        browser
      );

      this.sessions.set(sessionId, session);

      console.log(`Successfully connected to ${connectionType} Chrome: ${session.getConnectionInfo()}`);
      
      return {
        success: true,
        browser: session
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';
      console.error(`Failed to connect to Chrome at ${config.host}:${config.port}:`, errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  async disconnect(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      await session.close();
      this.sessions.delete(sessionId);
      console.log(`Disconnected session: ${sessionId}`);
    }
  }

  getSession(sessionId: string): BrowserSession | null {
    return this.sessions.get(sessionId) || null;
  }

  getAllSessions(): BrowserSession[] {
    return Array.from(this.sessions.values());
  }

  isConnected(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    return session ? session.isActive : false;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
