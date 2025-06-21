import { ConnectionType } from '../../shared/types';

export class BrowserSession {
  public readonly id: string;
  public readonly connectionType: ConnectionType;
  public readonly host: string;
  public readonly port: number;
  public readonly createdAt: Date;
  private _isActive: boolean;
  private _browser: any;
  private _page: any;

  constructor(
    id: string,
    connectionType: ConnectionType,
    host: string,
    port: number,
    browser: any
  ) {
    this.id = id;
    this.connectionType = connectionType;
    this.host = host;
    this.port = port;
    this.createdAt = new Date();
    this._isActive = true;
    this._browser = browser;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get browser(): any {
    return this._browser;
  }

  get page(): any {
    return this._page;
  }

  async createPage(): Promise<any> {
    if (!this._browser) {
      throw new Error('Browser is not available');
    }
    this._page = await this._browser.newPage();
    return this._page;
  }

  async close(): Promise<void> {
    try {
      if (this._page) {
        await this._page.close();
      }
      if (this._browser) {
        await this._browser.close();
      }
    } finally {
      this._isActive = false;
    }
  }

  getConnectionInfo(): string {
    return `${this.connectionType}://${this.host}:${this.port}`;
  }
}
