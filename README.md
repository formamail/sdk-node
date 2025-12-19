# @formamail/sdk

Official Node.js SDK for FormaMail - the email delivery platform with unified template design for emails and attachments.

## Installation

```bash
npm install @formamail/sdk
# or
yarn add @formamail/sdk
# or
pnpm add @formamail/sdk
```

## Quick Start

```typescript
import { Formamail } from '@formamail/sdk';

const formamail = new Formamail({
  apiKey: process.env.FORMAMAIL_API_KEY!,
});

// Send an email
const result = await formamail.emails.send({
  templateId: 'tmpl_welcome',
  to: 'customer@example.com',
  toName: 'John Doe',
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

### Send Email with PDF Attachment

```typescript
const result = await formamail.emails.sendWithPdf({
  templateId: 'tmpl_invoice_email',
  to: 'customer@example.com',
  pdfTemplateId: 'tmpl_invoice_pdf',
  pdfFileName: 'Invoice-001',
  variables: {
    invoiceNumber: 'INV-001',
    customerName: 'John Doe',
    total: 99.99,
  },
});
```

### Send Email with Excel Attachment

```typescript
const result = await formamail.emails.sendWithExcel({
  templateId: 'tmpl_report_email',
  to: 'manager@example.com',
  excelTemplateId: 'tmpl_monthly_report',
  excelFileName: 'Monthly-Report-Jan',
  variables: {
    reportMonth: 'January 2025',
    data: [...],
  },
});
```

### Send Bulk Emails

```typescript
const result = await formamail.emails.sendBulk({
  templateId: 'tmpl_newsletter',
  recipients: [
    { email: 'user1@example.com', name: 'User 1', variables: { firstName: 'User' } },
    { email: 'user2@example.com', name: 'User 2', variables: { firstName: 'User' } },
  ],
  commonVariables: {
    companyName: 'Acme Corp',
    unsubscribeUrl: 'https://example.com/unsubscribe',
  },
});

console.log('Batch ID:', result.batchId);
console.log('Total recipients:', result.totalRecipients);
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
import { verifyWebhookSignature } from '@formamail/sdk';

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
import { Formamail, FormamailError } from '@formamail/sdk';

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
} from '@formamail/sdk';

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
- `formamail.emails.sendWithPdf(options)` - Send with PDF attachment
- `formamail.emails.sendWithExcel(options)` - Send with Excel attachment
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

- Documentation: https://docs.formamail.com/sdk/node
- API Reference: https://docs.formamail.com/api
- Support: support@formamail.com
