# formamail

Official Node.js SDK for FormaMail - the email delivery platform with unified template design for emails and attachments.

## Installation

```bash
npm install formamail
# or
yarn add formamail
# or
pnpm add formamail
```

## Quick Start

```typescript
import { Formamail } from 'formamail';

const formamail = new Formamail({
  apiKey: process.env.FORMAMAIL_API_KEY!,
});

// Send an email
const result = await formamail.emails.send({
  templateId: 'welcome-email',  // Can be UUID, shortId (etpl_xxx), or slug
  to: 'customer@example.com',
  variables: {
    firstName: 'John',
    accountId: '12345',
  },
});

console.log('Email sent:', result.id);
```

## Features

- **Full TypeScript support** with comprehensive type definitions
- **Promise-based API** for modern async/await usage
- **Email sending** with template variables
- **PDF generation** - attach auto-generated PDFs from templates
- **Excel generation** - attach auto-generated Excel files from templates
- **Bulk sending** - send to multiple recipients with personalization
- **Webhook verification** - secure signature verification for webhooks

## Usage Examples

### Multiple Recipients with CC/BCC

The `to`, `cc`, and `bcc` fields accept flexible input formats:

```typescript
// Simple string (single recipient)
await formamail.emails.send({
  templateId: 'welcome-email',
  to: 'john@example.com',
  variables: { name: 'John' },
});

// Object with name
await formamail.emails.send({
  templateId: 'welcome-email',
  to: { email: 'john@example.com', name: 'John Doe' },
  variables: { name: 'John' },
});

// Array of recipients (mixed formats)
await formamail.emails.send({
  templateId: 'team-update',
  to: [
    { email: 'john@example.com', name: 'John Doe' },
    'jane@example.com',  // Name is optional
    { email: 'bob@example.com', name: 'Bob Smith' },
  ],
  variables: { teamName: 'Engineering' },
});

// With CC and BCC
await formamail.emails.send({
  templateId: 'invoice-email',
  to: { email: 'customer@example.com', name: 'Customer' },
  cc: 'accounts@customer.com',  // CC the customer's accounts team
  bcc: [
    'audit@yourcompany.com',  // Internal audit copy
    { email: 'manager@yourcompany.com', name: 'Sales Manager' },
  ],
  variables: { invoiceNumber: 'INV-001' },
});
```

### Send Email with Attachment (PDF or Excel)

```typescript
// Send with PDF attachment
const result = await formamail.emails.sendWithAttachment({
  templateId: 'invoice-email',
  to: 'customer@example.com',
  attachmentTemplateId: 'invoice-pdf',
  attachmentType: 'pdf',
  fileName: 'Invoice-001',
  variables: {
    invoiceNumber: 'INV-001',
    customerName: 'John Doe',
  },
});

// Send with Excel attachment
const result = await formamail.emails.sendWithAttachment({
  templateId: 'report-email',
  to: 'manager@example.com',
  attachmentTemplateId: 'monthly-report-excel',
  attachmentType: 'excel',
  fileName: 'Monthly-Report-Jan',
  variables: {
    reportMonth: 'January 2025',
  },
});
```

### Send Bulk Emails

```typescript
// Simple bulk send
const result = await formamail.emails.sendBulk({
  templateId: 'newsletter',
  recipients: [
    { email: 'user1@example.com', name: 'User 1', variables: { firstName: 'Alice' } },
    { email: 'user2@example.com', name: 'User 2', variables: { firstName: 'Bob' } },
  ],
  baseVariables: { companyName: 'Acme Corp' },  // Shared across all
  tags: ['newsletter', 'monthly'],
});

console.log('Batch ID:', result.batchId);
```

### Bulk Send with Personalized Attachments

There are two ways to personalize attachments in bulk sends:

**Option 1: Using `recipientVariableFields`** - Specify which recipient variable fields to use for attachments

```typescript
const invoiceResult = await formamail.emails.sendBulk({
  templateId: 'invoice-email',
  recipients: [
    { email: 'c1@example.com', variables: { name: 'Alice', invoiceNumber: 'INV-001', amount: 100 } },
    { email: 'c2@example.com', variables: { name: 'Bob', invoiceNumber: 'INV-002', amount: 200 } },
  ],
  baseVariables: { companyName: 'Acme Corp' },
  attachments: [{
    filename: 'invoice-{{invoiceNumber}}.pdf',
    attachmentTemplateId: 'invoice-pdf',
    baseVariables: { currency: 'USD' },
    // These fields are pulled from each recipient's variables
    recipientVariableFields: ['name', 'invoiceNumber', 'amount'],
    outputFormats: ['pdf'],
  }],
  batchName: 'January Invoices',
});
```

**Option 2: Using `attachmentOverrides`** - Override attachments per recipient for complete control

```typescript
const customResult = await formamail.emails.sendBulk({
  templateId: 'report-email',
  recipients: [
    {
      email: 'c1@example.com',
      variables: { name: 'Alice' },
      // Completely override attachments for this recipient
      attachmentOverrides: [{
        filename: 'custom-report-alice.pdf',
        attachmentTemplateId: 'vip-report-pdf',
        baseVariables: { reportType: 'VIP', discount: 20 },
        outputFormats: ['pdf'],
      }],
    },
    {
      email: 'c2@example.com',
      variables: { name: 'Bob' },
      // This recipient uses the default attachments (no override)
    },
  ],
  baseVariables: { companyName: 'Acme Corp' },
  attachments: [{
    filename: 'standard-report.pdf',
    attachmentTemplateId: 'standard-report-pdf',
    outputFormats: ['pdf'],
  }],
});
```

### List and Search Emails

```typescript
// List recent emails
const { data: emails, meta } = await formamail.emails.list({
  limit: 20,
});

// Search by recipient
const { data: customerEmails } = await formamail.emails.list({
  recipient: 'customer@example.com',
});

// Filter by status
const { data: deliveredEmails } = await formamail.emails.list({
  status: 'delivered',
  dateFrom: new Date('2025-01-01'),
});

// Get specific email
const email = await formamail.emails.get('email_abc123');
```

### Work with Templates

```typescript
// List all templates
const { data: templates } = await formamail.templates.list();

// List by type
const { data: emailTemplates } = await formamail.templates.listEmail();
const { data: pdfTemplates } = await formamail.templates.listPdf();
const { data: excelTemplates } = await formamail.templates.listExcel();

// Get template details
const template = await formamail.templates.get('tmpl_abc123');
console.log('Variables:', template.variables);
```

### Manage Webhooks

```typescript
// Create a webhook subscription
const webhook = await formamail.webhooks.create({
  url: 'https://your-app.com/webhooks/formamail',
  events: ['email.sent', 'email.delivered', 'email.bounced'],
  name: 'My Webhook',
});

// Save the secret for signature verification!
console.log('Webhook secret:', webhook.secret);

// List webhooks
const { data: webhooks } = await formamail.webhooks.list();

// Delete a webhook
await formamail.webhooks.delete('wh_abc123');
```

### Verify Webhook Signatures

```typescript
import { verifyWebhookSignature } from 'formamail';

// Express.js example
app.post('/webhooks/formamail', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-formamail-signature'] as string;

  try {
    const event = verifyWebhookSignature({
      payload: req.body.toString(),
      signature,
      secret: process.env.WEBHOOK_SECRET!,
    });

    // Process the verified event
    switch (event.type) {
      case 'email.sent':
        console.log('Email sent:', event.data.emailId);
        break;
      case 'email.delivered':
        console.log('Email delivered:', event.data.emailId);
        break;
      case 'email.bounced':
        console.log('Email bounced:', event.data.emailId, event.data.bounceReason);
        break;
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Invalid webhook signature:', error);
    res.status(400).send('Invalid signature');
  }
});
```

## Configuration

```typescript
const formamail = new Formamail({
  // Required: Your API key
  apiKey: process.env.FORMAMAIL_API_KEY!,

  // Optional: Custom base URL (default: https://api.formamail.com)
  baseUrl: 'https://api.formamail.com',

  // Optional: Request timeout in milliseconds (default: 30000)
  timeout: 30000,

  // Optional: Custom headers
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

## Error Handling

```typescript
import { Formamail, FormamailError } from 'formamail';

try {
  await formamail.emails.send({
    templateId: 'invalid_template',
    to: 'customer@example.com',
  });
} catch (error) {
  if (error instanceof FormamailError) {
    console.error('API Error:', error.message);
    console.error('Code:', error.code);
    console.error('Status:', error.statusCode);
  } else {
    throw error;
  }
}
```

## TypeScript Support

This SDK is written in TypeScript and includes comprehensive type definitions:

```typescript
import type {
  SendEmailOptions,
  SendEmailResponse,
  Email,
  Template,
  WebhookEvent,
} from 'formamail';

const options: SendEmailOptions = {
  templateId: 'tmpl_123',
  to: 'customer@example.com',
  variables: { name: 'John' },
};

const result: SendEmailResponse = await formamail.emails.send(options);
```

## API Reference

### Client Methods

- `formamail.me()` - Get current authenticated user
- `formamail.verifyApiKey()` - Verify API key is valid

### Emails Resource

- `formamail.emails.send(options)` - Send an email
- `formamail.emails.sendWithAttachment(options)` - Send with PDF or Excel attachment
- `formamail.emails.sendBulk(options)` - Send bulk emails
- `formamail.emails.get(id)` - Get email by ID
- `formamail.emails.list(options)` - List/search emails

### Templates Resource

- `formamail.templates.get(id)` - Get template by ID
- `formamail.templates.list(options)` - List templates
- `formamail.templates.listEmail()` - List email templates
- `formamail.templates.listPdf()` - List PDF templates
- `formamail.templates.listExcel()` - List Excel templates

### Webhooks Resource

- `formamail.webhooks.create(options)` - Create webhook subscription
- `formamail.webhooks.get(id)` - Get webhook by ID
- `formamail.webhooks.list()` - List webhooks
- `formamail.webhooks.update(id, options)` - Update webhook
- `formamail.webhooks.delete(id)` - Delete webhook

### Utilities

- `verifyWebhookSignature(options)` - Verify webhook signature
- `parseSignatureHeader(header)` - Parse signature header
- `computeSignature(timestamp, payload, secret)` - Compute signature

## Requirements

- Node.js 18.0.0 or higher

## License

MIT

## Support

- Documentation: https://docs.formamail.com/developer-guide
- API Reference: https://docs.formamail.com/api-reference
- Support: support@formamail.com
