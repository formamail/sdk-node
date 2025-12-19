/**
 * Templates Resource
 */

import type { HttpClient } from '../utils/http';
import type {
  ApiResponse,
  Template,
  ListTemplatesOptions,
  PaginationMeta,
} from '../types';

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  /**
   * Get a template by ID
   *
   * @example
   * ```typescript
   * const template = await formamail.templates.get('tmpl_abc123');
   * console.log('Template:', template.name);
   * console.log('Variables:', template.variables);
   * ```
   */
  async get(id: string): Promise<Template> {
    const response = await this.http.get<ApiResponse<Template>>(
      `/api/v1/templates/${id}`
    );
    return response.data;
  }

  /**
   * List templates with optional filters
   *
   * @example
   * ```typescript
   * // List all email templates
   * const { data } = await formamail.templates.list({ type: 'email' });
   *
   * // List all PDF templates
   * const { data: pdfTemplates } = await formamail.templates.list({ type: 'pdf' });
   * ```
   */
  async list(
    options: ListTemplatesOptions = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    const response = await this.http.get<ApiResponse<Template[]>>(
      '/api/v1/templates',
      {
        type: options.type,
        limit: options.limit,
        page: options.page,
      }
    );

    return {
      data: response.data,
      meta: response.meta!,
    };
  }

  /**
   * List only email templates
   *
   * @example
   * ```typescript
   * const { data } = await formamail.templates.listEmail();
   * ```
   */
  async listEmail(
    options: Omit<ListTemplatesOptions, 'type'> = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    return this.list({ ...options, type: 'email' });
  }

  /**
   * List only PDF templates
   *
   * @example
   * ```typescript
   * const { data } = await formamail.templates.listPdf();
   * ```
   */
  async listPdf(
    options: Omit<ListTemplatesOptions, 'type'> = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    return this.list({ ...options, type: 'pdf' });
  }

  /**
   * List only Excel templates
   *
   * @example
   * ```typescript
   * const { data } = await formamail.templates.listExcel();
   * ```
   */
  async listExcel(
    options: Omit<ListTemplatesOptions, 'type'> = {}
  ): Promise<{ data: Template[]; meta: PaginationMeta }> {
    return this.list({ ...options, type: 'excel' });
  }
}
