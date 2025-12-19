/**
 * FormaMail Node.js SDK
 *
 * Official SDK for the FormaMail email delivery platform.
 *
 * @example
 * ```typescript
 * import { Formamail } from '@formamail/sdk';
 *
 * const formamail = new Formamail({
 *   apiKey: process.env.FORMAMAIL_API_KEY!,
 * });
 *
 * // Send an email
 * const result = await formamail.emails.send({
 *   templateId: 'tmpl_welcome',
 *   to: 'customer@example.com',
 *   variables: { firstName: 'John' },
 * });
 *
 * // Send email with PDF attachment
 * const invoice = await formamail.emails.sendWithPdf({
 *   templateId: 'tmpl_invoice_email',
 *   to: 'customer@example.com',
 *   pdfTemplateId: 'tmpl_invoice_pdf',
 *   pdfFileName: 'Invoice-001',
 *   variables: { invoiceNumber: 'INV-001' },
 * });
 *
 * // List templates
 * const { data: templates } = await formamail.templates.list({ type: 'email' });
 *
 * // Verify webhook signature
 * import { verifyWebhookSignature } from '@formamail/sdk';
 *
 * const event = verifyWebhookSignature({
 *   payload: requestBody,
 *   signature: headers['x-formamail-signature'],
 *   secret: process.env.WEBHOOK_SECRET!,
 * });
 * ```
 *
 * @packageDocumentation
 */

// Main client
export { Formamail, createClient } from './client';

// Resources
export { EmailsResource } from './resources/emails';
export { TemplatesResource } from './resources/templates';
export { WebhooksResource } from './resources/webhooks';

// Utilities
export { FormamailError } from './utils/http';
export {
  verifyWebhookSignature,
  parseSignatureHeader,
  computeSignature,
  WebhookSignatureError,
} from './utils/webhooks';

// Types
export type {
  FormamailConfig,
  // Email types
  SendEmailOptions,
  SendBulkEmailOptions,
  BulkRecipient,
  Attachment,
  Email,
  EmailAttachment,
  EmailStatus,
  SendEmailResponse,
  SendBulkEmailResponse,
  ListEmailsOptions,
  // Template types
  Template,
  TemplateVariable,
  ListTemplatesOptions,
  // Webhook types
  WebhookSubscription,
  WebhookEventType,
  CreateWebhookOptions,
  WebhookEvent,
  // Response types
  ApiResponse,
  PaginationMeta,
  ApiError,
  // User types
  User,
} from './types';

export type { VerifyWebhookOptions } from './utils/webhooks';
