/**
 * FormaMail SDK Client
 */

import { HttpClient } from './utils/http';
import { EmailsResource } from './resources/emails';
import { TemplatesResource } from './resources/templates';
import { WebhooksResource } from './resources/webhooks';
import type { FormamailConfig, ApiResponse, User } from './types';

const DEFAULT_BASE_URL = 'https://api.formamail.com';
const DEFAULT_TIMEOUT = 30000;

export class Formamail {
  private http: HttpClient;

  /** Email operations */
  public emails: EmailsResource;

  /** Template operations */
  public templates: TemplatesResource;

  /** Webhook operations */
  public webhooks: WebhooksResource;

  /**
   * Create a new FormaMail client
   *
   * @example
   * ```typescript
   * import { Formamail } from 'formamail';
   *
   * const formamail = new Formamail({
   *   apiKey: process.env.FORMAMAIL_API_KEY!,
   * });
   *
   * // Send an email
   * const result = await formamail.emails.send({
   *   templateId: 'welcome-email',
   *   to: 'customer@example.com',
   *   variables: { firstName: 'John' },
   * });
   * ```
   */
  constructor(config: FormamailConfig) {
    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }

    this.http = new HttpClient({
      baseUrl: config.baseUrl || DEFAULT_BASE_URL,
      apiKey: config.apiKey,
      timeout: config.timeout || DEFAULT_TIMEOUT,
      headers: config.headers,
    });

    this.emails = new EmailsResource(this.http);
    this.templates = new TemplatesResource(this.http);
    this.webhooks = new WebhooksResource(this.http);
  }

  /**
   * Get the current authenticated user
   *
   * @example
   * ```typescript
   * const user = await formamail.me();
   * console.log('Authenticated as:', user.email);
   * ```
   */
  async me(): Promise<User> {
    const response = await this.http.get<ApiResponse<User>>('/api/v1/me');
    return response.data;
  }

  /**
   * Verify the API key is valid
   *
   * @example
   * ```typescript
   * const isValid = await formamail.verifyApiKey();
   * if (!isValid) {
   *   throw new Error('Invalid API key');
   * }
   * ```
   */
  async verifyApiKey(): Promise<boolean> {
    try {
      await this.me();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Create a FormaMail client
 *
 * @example
 * ```typescript
 * import { createClient } from 'formamail';
 *
 * const formamail = createClient({
 *   apiKey: process.env.FORMAMAIL_API_KEY!,
 * });
 * ```
 */
export function createClient(config: FormamailConfig): Formamail {
  return new Formamail(config);
}
