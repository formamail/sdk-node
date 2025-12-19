/**
 * Webhooks Resource
 */

import type { HttpClient } from '../utils/http';
import type {
  ApiResponse,
  WebhookSubscription,
  CreateWebhookOptions,
  PaginationMeta,
} from '../types';

export class WebhooksResource {
  constructor(private http: HttpClient) {}

  /**
   * Create a webhook subscription
   *
   * @example
   * ```typescript
   * const webhook = await formamail.webhooks.create({
   *   url: 'https://your-app.com/webhooks/formamail',
   *   events: ['email.sent', 'email.delivered', 'email.bounced'],
   *   name: 'My Webhook',
   * });
   * console.log('Webhook ID:', webhook.id);
   * console.log('Secret:', webhook.secret); // Save this for verification!
   * ```
   */
  async create(options: CreateWebhookOptions): Promise<WebhookSubscription> {
    const response = await this.http.post<ApiResponse<WebhookSubscription>>(
      '/api/v1/webhook-subscriptions',
      options
    );
    return response.data;
  }

  /**
   * Get a webhook subscription by ID
   *
   * @example
   * ```typescript
   * const webhook = await formamail.webhooks.get('wh_abc123');
   * console.log('Events:', webhook.events);
   * ```
   */
  async get(id: string): Promise<WebhookSubscription> {
    const response = await this.http.get<ApiResponse<WebhookSubscription>>(
      `/api/v1/webhook-subscriptions/${id}`
    );
    return response.data;
  }

  /**
   * List all webhook subscriptions
   *
   * @example
   * ```typescript
   * const { data } = await formamail.webhooks.list();
   * console.log('Active webhooks:', data.filter(w => w.active).length);
   * ```
   */
  async list(): Promise<{ data: WebhookSubscription[]; meta: PaginationMeta }> {
    const response = await this.http.get<ApiResponse<WebhookSubscription[]>>(
      '/api/v1/webhook-subscriptions'
    );

    return {
      data: response.data,
      meta: response.meta!,
    };
  }

  /**
   * Delete a webhook subscription
   *
   * @example
   * ```typescript
   * await formamail.webhooks.delete('wh_abc123');
   * console.log('Webhook deleted');
   * ```
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/api/v1/webhook-subscriptions/${id}`);
  }

  /**
   * Update a webhook subscription
   *
   * @example
   * ```typescript
   * const updated = await formamail.webhooks.update('wh_abc123', {
   *   events: ['email.sent', 'email.delivered'],
   *   active: true,
   * });
   * ```
   */
  async update(
    id: string,
    options: Partial<CreateWebhookOptions> & { active?: boolean }
  ): Promise<WebhookSubscription> {
    const response = await this.http.put<ApiResponse<WebhookSubscription>>(
      `/api/v1/webhook-subscriptions/${id}`,
      options
    );
    return response.data;
  }
}
