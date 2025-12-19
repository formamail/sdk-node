import { Formamail, createClient } from '../client';

describe('Formamail Client', () => {
  describe('constructor', () => {
    it('should throw error if apiKey is not provided', () => {
      expect(() => new Formamail({} as any)).toThrow('apiKey is required');
    });

    it('should create client with apiKey', () => {
      const client = new Formamail({ apiKey: 'test_api_key' });
      expect(client).toBeInstanceOf(Formamail);
      expect(client.emails).toBeDefined();
      expect(client.templates).toBeDefined();
      expect(client.webhooks).toBeDefined();
    });

    it('should accept custom baseUrl', () => {
      const client = new Formamail({
        apiKey: 'test_api_key',
        baseUrl: 'https://custom.api.com',
      });
      expect(client).toBeInstanceOf(Formamail);
    });

    it('should accept custom timeout', () => {
      const client = new Formamail({
        apiKey: 'test_api_key',
        timeout: 60000,
      });
      expect(client).toBeInstanceOf(Formamail);
    });
  });

  describe('createClient helper', () => {
    it('should create a Formamail instance', () => {
      const client = createClient({ apiKey: 'test_api_key' });
      expect(client).toBeInstanceOf(Formamail);
    });
  });
});
