# Contributing to formamail (Node.js)

This guide covers how to develop, test, and publish the FormaMail Node.js SDK.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A FormaMail account with API key (for integration tests)

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/formamail/sdk-node.git
cd sdk-node
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file for testing (never commit this):

```bash
# .env
FORMAMAIL_API_KEY=your_test_api_key
FORMAMAIL_BASE_URL=https://api.formamail.com  # or staging URL
FORMAMAIL_WEBHOOK_SECRET=your_webhook_secret
```

## Development Workflow

### Building

```bash
# Build once
npm run build

# Build in watch mode (for development)
npm run dev
```

The build outputs:
- `dist/index.js` - CommonJS build
- `dist/index.mjs` - ESM build
- `dist/index.d.ts` - TypeScript declarations

### Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix lint errors
npm run lint -- --fix
```

### Type Checking

```bash
# Run TypeScript type checker
npx tsc --noEmit
```

## Testing

### Unit Tests

Unit tests mock all HTTP calls and test SDK logic in isolation.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- src/__tests__/emails.test.ts
```

### Writing Unit Tests

Tests are located in `src/__tests__/`. Example:

```typescript
// src/__tests__/emails.test.ts
import { Formamail } from '../client';
import { mockHttpClient } from './helpers';

describe('EmailsResource', () => {
  let client: Formamail;

  beforeEach(() => {
    client = new Formamail({ apiKey: 'test_key' });
    mockHttpClient(client);
  });

  it('should send an email', async () => {
    const result = await client.emails.send({
      templateId: 'tmpl_123',
      to: 'test@example.com',
    });

    expect(result.id).toBeDefined();
  });
});
```

### Integration Tests

Integration tests make real API calls. Only run these against a test/staging environment.

```bash
# Run integration tests (requires FORMAMAIL_API_KEY)
npm run test:integration
```

### Test Coverage

We aim for >80% test coverage. Check coverage with:

```bash
npm run test:coverage
```

Coverage report is generated in `coverage/` directory.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Version Bump

```bash
# Patch release (bug fixes)
npm version patch

# Minor release (new features)
npm version minor

# Major release (breaking changes)
npm version major
```

This automatically:
1. Updates `package.json` version
2. Creates a git commit
3. Creates a git tag

## Publishing to npm

### Prerequisites

1. You must be a member of the `@formamail` npm organization
2. You must be logged in to npm: `npm login`
3. You must have 2FA enabled on your npm account

### Pre-publish Checklist

- [ ] All tests pass: `npm test`
- [ ] Lint passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Version is bumped: `npm version <patch|minor|major>`
- [ ] CHANGELOG.md is updated
- [ ] Changes are committed and pushed

### Manual Publishing

```bash
# 1. Ensure you're on main branch with latest changes
git checkout main
git pull origin main

# 2. Run tests
npm test

# 3. Build the package
npm run build

# 4. Bump version (creates commit + tag)
npm version patch  # or minor/major

# 5. Push changes and tags
git push origin main --tags

# 6. Publish to npm
npm publish --access public

# 7. Verify on npm
open https://www.npmjs.com/package/formamail
```

### Automated Publishing (CI/CD)

We use GitHub Actions for automated publishing. When you push a version tag:

```yaml
# .github/workflows/publish.yml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm test
      - run: npm run build

      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Setting Up npm Token for CI

1. Generate an npm automation token:
   - Go to npmjs.com → Access Tokens → Generate New Token
   - Select "Automation" type

2. Add to GitHub secrets:
   - Go to repo Settings → Secrets → Actions
   - Add `NPM_TOKEN` with the token value

## Release Process

### 1. Create a Release Branch (for major/minor)

```bash
git checkout -b release/v1.2.0
```

### 2. Update CHANGELOG.md

```markdown
## [1.2.0] - 2025-12-18

### Added
- New `sendWithExcel()` method for Excel attachments
- Support for custom headers in client config

### Fixed
- Webhook signature verification timing attack vulnerability

### Changed
- Improved error messages for validation errors
```

### 3. Version and Tag

```bash
npm version minor
git push origin release/v1.2.0 --tags
```

### 4. Create Pull Request

Create a PR from `release/v1.2.0` to `main`.

### 5. Merge and Publish

After PR approval:
1. Merge to main
2. CI automatically publishes to npm

### 6. Create GitHub Release

1. Go to Releases → Draft a new release
2. Select the version tag
3. Copy CHANGELOG entry as release notes
4. Publish release

## Troubleshooting

### npm publish fails with 403

- Ensure you're logged in: `npm whoami`
- Ensure you have publish access to `@formamail` org
- Ensure 2FA is enabled and you're providing the OTP

### Build fails

- Clear build cache: `rm -rf dist node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### Tests fail in CI but pass locally

- Check for environment-dependent code
- Ensure all mocks are properly set up
- Check for timing-sensitive tests

## Code Style

- Use TypeScript strict mode
- Use async/await (not callbacks or raw promises)
- Document all public APIs with JSDoc
- Keep functions small and focused
- Write tests for all new features

## Questions?

- Open an issue on GitHub
- Email: sdk-support@formamail.com
