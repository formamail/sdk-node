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

export interface EmailRecipient {
  /** Recipient email address */
  email: string;
  /** Recipient name (optional) */
  name?: string;
}

export type RecipientInput = string | EmailRecipient | (string | EmailRecipient)[];

export interface SendEmailOptions {
  /** Template ID to use (UUID, shortId like etpl_xxx, or slug) */
  templateId: string;
  /**
   * Recipient(s) - can be:
   * - A single email string: 'john@example.com'
   * - An object: { email: 'john@example.com', name: 'John' }
   * - An array: ['john@example.com', { email: 'jane@example.com', name: 'Jane' }]
   */
  to: RecipientInput;
  /** CC recipient(s) - same format as 'to' */
  cc?: RecipientInput;
  /** BCC recipient(s) - same format as 'to' */
  bcc?: RecipientInput;
  /** Template version to use ('published' or 'draft', default: 'published') */
  version?: 'published' | 'draft';
  /** Sender email address (must be a verified sender address) */
  senderEmail?: string;
  /** Sender ID (legacy - prefer senderEmail) */
  senderId?: string;
  /** Custom sender name to display in the From field */
  fromName?: string;
  /** Reply-to email address override */
  replyTo?: string;
  /** Template variables for personalization */
  variables?: Record<string, unknown>;
  /** Email priority */
  priority?: 'low' | 'normal' | 'high';
  /** Schedule send time (ISO 8601 format) */
  scheduledAt?: string;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Tags for tracking and categorization */
  tags?: string[];
  /** Metadata for tracking */
  metadata?: Record<string, unknown>;
  /** Attachments to include */
  attachments?: Attachment[];
}

export interface BulkAttachment {
  /** Attachment filename (can use variables like {{invoiceNumber}}.pdf) */
  filename: string;
  /** Content type (e.g., 'application/pdf') */
  contentType?: string;
  /** Static base64 content (same for all recipients) */
  content?: string;
  /** Static URL (same for all recipients) */
  url?: string;
  /** Attachment template ID (for template-generated attachments) */
  attachmentTemplateId?: string;
  /** Base variables for attachment template (shared across all recipients) */
  baseVariables?: Record<string, unknown>;
  /** Which recipient variable fields to use for this attachment */
  recipientVariableFields?: string[];
  /** Output formats to generate (e.g., ['pdf', 'excel']) */
  outputFormats?: string[];
  /** Whether this attachment is required (fail email if generation fails) */
  required?: boolean;
}

export interface BulkRecipient {
  /** Recipient email address */
  email: string;
  /** Recipient name (optional) */
  name?: string;
  /** Variables for email template (merged with baseVariables) */
  variables: Record<string, unknown>;
  /** Override attachments for this specific recipient */
  attachmentOverrides?: BulkAttachment[];
}

export interface SendBulkEmailOptions {
  /** Template ID to use (UUID, shortId like etpl_xxx, or slug) */
  templateId: string;
  /** Template version ('published' or 'draft') */
  version?: 'published' | 'draft';
  /** List of recipients with their individual variables (max 1000) */
  recipients: BulkRecipient[];
  /** Base variables for email template (shared across all recipients) */
  baseVariables?: Record<string, unknown>;
  /** Attachments for all recipients (can have template-generated attachments) */
  attachments?: BulkAttachment[];
  /** Sender email address (must be verified) */
  senderEmail?: string;
  /** Sender ID (legacy - prefer senderEmail) */
  senderId?: string;
  /** Custom sender name */
  fromName?: string;
  /** Reply-to email address */
  replyTo?: string;
  /** Email priority */
  priority?: 'low' | 'normal' | 'high';
  /** Custom headers */
  headers?: Record<string, string>;
  /** Tags for tracking and categorization */
  tags?: string[];
  /** Metadata for tracking */
  metadata?: Record<string, unknown>;
  /** Batch name for tracking */
  batchName?: string;
  /** Dry run mode - validate without sending */
  dryRun?: boolean;
  /** Schedule send time (ISO 8601 format) */
  scheduledAt?: string;
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
  teamId: string;
  templateId: string;
  templateName?: string;
  subject: string;
  from: string;
  /** Recipient email addresses */
  to: string[];
  /** CC recipients */
  cc?: string[];
  /** BCC recipients */
  bcc?: string[];
  status: EmailStatus;
  providerMessageId?: string;
  errorMessage?: string;
  openCount?: number;
  clickCount?: number;
  tags?: string[];
  metadata?: Record<string, unknown>;
  scheduledAt?: string;
  queuedAt?: string;
  processingAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  failedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailAttachment {
  type: 'pdf' | 'excel';
  fileName: string;
  size: number;
}

export type EmailStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'bounced'
  | 'complained'
  | 'rejected'
  | 'scheduled';

export interface BlockedRecipient {
  email: string;
  reason: string;
  source?: string;
}

export interface SendEmailResponse {
  id: string;
  status: EmailStatus;
  message: string;
  providerMessageId?: string;
  scheduledAt?: string;
  createdAt: string;
  /** Warning message if some recipients were blocked */
  warning?: string;
  /** Details about blocked recipients */
  blockedRecipients?: BlockedRecipient[];
}

export interface SendBulkEmailResponse {
  /** Unique batch ID for tracking this bulk send */
  batchId: string;
  /** Batch status */
  status: string;
  /** Total number of emails queued */
  totalEmails: number;
  /** Success message */
  message: string;
  /** Timestamp when batch was created */
  createdAt: string;
  /** Estimated completion time */
  estimatedCompletionAt?: string;
  /** Scheduled send time */
  scheduledAt?: string;
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
