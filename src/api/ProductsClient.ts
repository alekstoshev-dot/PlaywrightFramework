import { test, type APIRequestContext } from '@playwright/test';
type Query = Record<string, string | number | boolean>;
export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}
  private call(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    options: { params?: Query; data?: unknown } = {},
  ) {
    return test.step(`${method} ${path}`, async () => {
      const base = (process.env.API_BASE_URL || 'https://dummyjson.com').replace(/\/$/, '');
      const response = await this.request.fetch(`${base}${path}`, { method, ...options });
      await test.step(`HTTP response: ${response.status()}`, async () => {});
      return response;
    });
  }
  get(id: number) {
    return this.call('GET', `/products/${id}`);
  }
  list(params: Query = {}) {
    return this.call('GET', '/products', { params });
  }
  search(query: string) {
    return this.call('GET', '/products/search', { params: { q: query } });
  }
  create(data: { title: string; price: number }) {
    return this.call('POST', '/products/add', { data });
  }
  update(id: number, data: { title?: string; price?: number }) {
    return this.call('PUT', `/products/${id}`, { data });
  }
  delete(id: number) {
    return this.call('DELETE', `/products/${id}`);
  }
}
