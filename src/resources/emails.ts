/**
 * Emails Resource
 */

import type { HttpClient } from '../utils/http';
import type {
  ApiResponse,
  Email,
  EmailRecipient,
  RecipientInput,
  SendEmailOptions,
  SendEmailResponse,
  SendBulkEmailOptions,
  SendBulkEmailResponse,
  ListEmailsOptions,
  PaginationMeta,
} from '../types';

/**
 * Normalize recipient input to array of EmailRecipient objects
 */
function normalizeRecipients(input: RecipientInput): EmailRecipient[] {
  const recipients = Array.isArray(input) ? input : [input];
  return recipients.map((r) =>
    typeof r === 'string' ? { email: r } : r
  );
}

export class EmailsResource {
  constructor(private http: HttpClient) {}

  /**
   * Send an email using a template
   *
   * @example
   * ```typescript
   * // Single recipient
   * const result = await formamail.emails.send({
   *   templateId: 'welcome-email',
   *   to: 'customer@example.com',
   *   variables: { firstName: 'John' },
   * });
   *
   * // Multiple recipients with cc/bcc
   * const result = await formamail.emails.send({
   *   templateId: 'welcome-email',
   *   to: [
   *     { email: 'john@example.com', name: 'John Doe' },
   *     'jane@example.com',
   *   ],
   *   cc: 'manager@example.com',
   *   bcc: ['audit@example.com', { email: 'admin@example.com', name: 'Admin' }],
   *   variables: { firstName: 'Team' },
   * });
   * ```
   */
  async send(options: SendEmailOptions): Promise<SendEmailResponse> {
    // Normalize recipients to API format
    const payload = {
      templateId: options.templateId,
      to: normalizeRecipients(options.to),
      ...(options.cc && { cc: normalizeRecipients(options.cc) }),
      ...(options.bcc && { bcc: normalizeRecipients(options.bcc) }),
      ...(options.version && { version: options.version }),
      ...(options.senderEmail && { senderEmail: options.senderEmail }),
      ...(options.senderId && { senderId: options.senderId }),
      ...(options.fromName && { fromName: options.fromName }),
      ...(options.replyTo && { replyTo: options.replyTo }),
      ...(options.variables && { variables: options.variables }),
      ...(options.priority && { priority: options.priority }),
      ...(options.scheduledAt && { scheduledAt: options.scheduledAt }),
      ...(options.headers && { headers: options.headers }),
      ...(options.tags && { tags: options.tags }),
      ...(options.metadata && { metadata: options.metadata }),
      ...(options.attachments && { attachments: options.attachments }),
    };

    const response = await this.http.post<ApiResponse<SendEmailResponse>>(
      '/api/v1/emails/send',
      payload
    );
    return response.data;
  }

  /**
   * Send an email with a generated attachment (PDF or Excel)
   *
   * @example
   * ```typescript
   * // Send with PDF attachment
   * const result = await formamail.emails.sendWithAttachment({
   *   templateId: 'invoice-email',
   *   to: 'customer@example.com',
   *   attachmentTemplateId: 'invoice-pdf',
   *   attachmentType: 'pdf',
   *   fileName: 'Invoice-001',
   *   variables: { invoiceNumber: 'INV-001' },
   * });
   *
   * // Send with Excel attachment
   * const result = await formamail.emails.sendWithAttachment({
   *   templateId: 'report-email',
   *   to: 'manager@example.com',
   *   attachmentTemplateId: 'monthly-report-excel',
   *   attachmentType: 'excel',
   *   fileName: 'Report-Jan',
   *   variables: { reportMonth: 'January 2025' },
   * });
   * ```
   */
  async sendWithAttachment(
    options: Omit<SendEmailOptions, 'attachments'> & {
      /** Template ID for generating the attachment */
      attachmentTemplateId: string;
      /** Attachment type: 'pdf' or 'excel' */
      attachmentType: 'pdf' | 'excel';
      /** Custom file name (without extension) */
      fileName?: string;
      /** Variables for the attachment template (if different from email variables) */
      attachmentVariables?: Record<string, unknown>;
    }
  ): Promise<SendEmailResponse> {
    const { attachmentTemplateId, attachmentType, fileName, attachmentVariables, ...emailOptions } = options;

    return this.send({
      ...emailOptions,
      attachments: [
        {
          type: attachmentType,
          templateId: attachmentTemplateId,
          fileName,
          variables: attachmentVariables,
        },
      ],
    });
  }

  /**
   * Send bulk emails to multiple recipients with personalization
   *
   * Supports variable overrides at multiple levels:
   * - `baseVariables`: Shared across all recipients
   * - `recipients[].variables`: Per-recipient overrides (merged with baseVariables)
   * - `attachments[].baseVariables`: Shared for attachment generation
   * - `attachments[].recipientVariableFields`: Specify which recipient fields to use for attachment
   * - `recipients[].attachmentOverrides`: Per-recipient attachment overrides (full control)
   *
   * @example
   * ```typescript
   * // Simple bulk send
   * const result = await formamail.emails.sendBulk({
   *   templateId: 'newsletter',
   *   recipients: [
   *     { email: 'user1@example.com', name: 'User 1', variables: { firstName: 'Alice' } },
   *     { email: 'user2@example.com', name: 'User 2', variables: { firstName: 'Bob' } },
   *   ],
   *   baseVariables: { companyName: 'Acme Corp', year: '2025' },
   *   tags: ['newsletter', 'monthly'],
   * });
   *
   * // Option 1: Using recipientVariableFields to specify which recipient fields to use
   * const result = await formamail.emails.sendBulk({
   *   templateId: 'invoice-email',
   *   recipients: [
   *     { email: 'c1@example.com', variables: { name: 'Alice', invoiceNumber: 'INV-001' } },
   *     { email: 'c2@example.com', variables: { name: 'Bob', invoiceNumber: 'INV-002' } },
   *   ],
   *   attachments: [{
   *     filename: 'invoice-{{invoiceNumber}}.pdf',
   *     attachmentTemplateId: 'invoice-pdf',
   *     recipientVariableFields: ['name', 'invoiceNumber'], // Pull these from recipient
   *     outputFormats: ['pdf'],
   *   }],
   * });
   *
   * // Option 2: Using attachmentOverrides for per-recipient attachment control
   * const result = await formamail.emails.sendBulk({
   *   templateId: 'report-email',
   *   recipients: [
   *     {
   *       email: 'vip@example.com',
   *       variables: { name: 'VIP' },
   *       attachmentOverrides: [{ // Override for this recipient only
   *         filename: 'vip-report.pdf',
   *         attachmentTemplateId: 'vip-report-pdf',
   *         outputFormats: ['pdf'],
   *       }],
   *     },
   *     { email: 'regular@example.com', variables: { name: 'Regular' } }, // Uses default
   *   ],
   *   attachments: [{ filename: 'standard.pdf', attachmentTemplateId: 'standard-pdf' }],
   * });
   * ```
   */
  async sendBulk(options: SendBulkEmailOptions): Promise<SendBulkEmailResponse> {
    const response = await this.http.post<ApiResponse<SendBulkEmailResponse>>(
      '/api/v1/emails/send/bulk',
      options
    );
    return response.data;
  }

  /**
   * Get an email by ID
   *
   * @example
   * ```typescript
   * const email = await formamail.emails.get('email_abc123');
   * console.log('Status:', email.status);
   * ```
   */
  async get(id: string): Promise<Email> {
    const response = await this.http.get<ApiResponse<Email>>(`/api/v1/emails/${id}`);
    return response.data;
  }

  /**
   * List emails with optional filters
   *
   * @example
   * ```typescript
   * const { data, meta } = await formamail.emails.list({
   *   recipient: 'customer@example.com',
   *   status: 'delivered',
   *   limit: 10,
   * });
   * console.log(`Found ${meta.total} emails`);
   * ```
   */
  async list(
    options: ListEmailsOptions = {}
  ): Promise<{ data: Email[]; meta: PaginationMeta }> {
    const response = await this.http.get<ApiResponse<Email[]>>('/api/v1/emails', {
      recipient: options.recipient,
      status: options.status,
      templateId: options.templateId,
      dateFrom: options.dateFrom,
      dateTo: options.dateTo,
      limit: options.limit,
      page: options.page,
    });

    return {
      data: response.data,
      meta: response.meta!,
    };
  }
}
