/**
 * FormaMail SDK Types
 */

// ============================================
// Configuration Types
// ============================================

export interface FormamailConfig {
  /** API Key for authentication */
  apiKey: string;
  /** Base URL for the API (default: https://api.formamail.com) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Custom headers to include in requests */
  headers?: Record<string, string>;
}

// ============================================
// Email Types
// ============================================

export interface SendEmailOptions {
  /** Template ID to use */
  templateId: string;
  /** Recipient email address */
  to: string;
  /** Recipient name (optional) */
  toName?: string;
  /** Subject line (overrides template default) */
  subject?: string;
  /** Sender name (optional) */
  fromName?: string;
  /** Reply-to email address (optional) */
  replyTo?: string;
  /** Template variables for personalization */
  variables?: Record<string, unknown>;
  /** Track email opens (default: true) */
  trackOpens?: boolean;
  /** Track link clicks (default: true) */
  trackClicks?: boolean;
  /** Attachments to include */
  attachments?: Attachment[];
}

export interface SendBulkEmailOptions {
  /** Template ID to use */
  templateId: string;
  /** List of recipients */
  recipients: BulkRecipient[];
  /** Subject line (overrides template default) */
  subject?: string;
  /** Sender name (optional) */
  fromName?: string;
  /** Reply-to email address (optional) */
  replyTo?: string;
  /** Variables applied to all recipients */
  commonVariables?: Record<string, unknown>;
  /** Track email opens (default: true) */
  trackOpens?: boolean;
  /** Track link clicks (default: true) */
  trackClicks?: boolean;
}

export interface BulkRecipient {
  /** Recipient email address */
  email: string;
  /** Recipient name (optional) */
  name?: string;
  /** Per-recipient variables (override common variables) */
  variables?: Record<string, unknown>;
}

export interface Attachment {
  /** Attachment type */
  type: 'pdf' | 'excel';
  /** Template ID to generate attachment from */
  templateId: string;
  /** Custom file name (without extension) */
  fileName?: string;
  /** Variables for the attachment template */
  variables?: Record<string, unknown>;
}

export interface Email {
  id: string;
  status: EmailStatus;
  to: string;
  toName?: string;
  subject: string;
  templateId: string;
  templateName?: string;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  clickedAt?: string;
  bouncedAt?: string;
  bounceType?: string;
  bounceReason?: string;
  messageId?: string;
  attachments?: EmailAttachment[];
  createdAt: string;
  updatedAt: string;
}

export interface EmailAttachment {
  type: 'pdf' | 'excel';
  fileName: string;
  size: number;
}

export type EmailStatus =
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'failed';

export interface SendEmailResponse {
  id: string;
  status: string;
  to: string;
  subject: string;
  sentAt: string;
  messageId: string;
  attachments?: EmailAttachment[];
}

export interface SendBulkEmailResponse {
  batchId: string;
  status: string;
  totalRecipients: number;
  queued: number;
  sent: number;
  failed: number;
  createdAt: string;
}

export interface ListEmailsOptions {
  /** Filter by recipient email */
  recipient?: string;
  /** Filter by status */
  status?: EmailStatus;
  /** Filter by template ID */
  templateId?: string;
  /** Filter by date range start */
  dateFrom?: string | Date;
  /** Filter by date range end */
  dateTo?: string | Date;
  /** Number of results per page (default: 20) */
  limit?: number;
  /** Page number (default: 1) */
  page?: number;
}

// ============================================
// Template Types
// ============================================

export interface Template {
  id: string;
  name: string;
  type: 'email' | 'pdf' | 'excel';
  description?: string;
  subject?: string;
  variables?: TemplateVariable[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateVariable {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: unknown;
}

export interface ListTemplatesOptions {
  /** Filter by template type */
  type?: 'email' | 'pdf' | 'excel';
  /** Number of results per page (default: 20) */
  limit?: number;
  /** Page number (default: 1) */
  page?: number;
}

// ============================================
// Webhook Types
// ============================================

export interface WebhookSubscription {
  id: string;
  url: string;
  events: WebhookEventType[];
  name?: string;
  active: boolean;
  secret?: string;
  createdAt: string;
  updatedAt: string;
}

export type WebhookEventType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.opened'
  | 'email.clicked'
  | 'email.bounced'
  | 'unsubscribe.created';

export interface CreateWebhookOptions {
  /** URL to receive webhook events */
  url: string;
  /** Event types to subscribe to */
  events: WebhookEventType[];
  /** Webhook name (optional) */
  name?: string;
}

export interface WebhookEvent {
  id: string;
  type: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

// ============================================
// Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  email: string;
  name?: string;
  teamId?: string;
  teamName?: string;
}
