import { test, expect } from '@playwright/test';
import { ProductsClient } from '../../../src/api/ProductsClient';
test('Read a product', async ({ request }) => {
  const response = await new ProductsClient(request).get(1);
  expect(response.status()).toBe(200);
  const product = await response.json();
  expect(product).toMatchObject({ id: 1, title: expect.any(String), price: expect.any(Number) });
  expect(product.price).toBeGreaterThan(0);
});
test('Unknown product returns 404', async ({ request }) => {
  const response = await new ProductsClient(request).get(999999);
  expect(response.status()).toBe(404);
  expect(await response.json()).toHaveProperty('message');
});

test('Pagination returns consecutive non-overlapping pages', async ({ request }) => {
  const api = new ProductsClient(request);
  const firstResponse = await api.list({ limit: 3, skip: 0 });
  const nextResponse = await api.list({ limit: 3, skip: 3 });
  expect(firstResponse.status()).toBe(200);
  expect(nextResponse.status()).toBe(200);
  const first = await firstResponse.json();
  const next = await nextResponse.json();
  expect(first).toMatchObject({ limit: 3, skip: 0, total: expect.any(Number) });
  expect(next).toMatchObject({ limit: 3, skip: 3, total: first.total });
  expect(first.products).toHaveLength(3);
  expect(next.products).toHaveLength(3);
  const ids = [...first.products, ...next.products].map((p: { id: number }) => p.id);
  expect(new Set(ids).size).toBe(6);
});

test('Search returns a known product by its title', async ({ request }) => {
  const api = new ProductsClient(request);
  const knownResponse = await api.get(1);
  expect(knownResponse.status()).toBe(200);
  const known = await knownResponse.json();
  const response = await api.search(known.title);
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.total).toBeGreaterThan(0);
  expect(body.products).toEqual(
    expect.arrayContaining([expect.objectContaining({ id: known.id, title: known.title })]),
  );
});

test('Search with no matches returns an empty list', async ({ request }) => {
  const response = await new ProductsClient(request).search('portfolio-no-match-987654321');
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ products: [], total: 0 });
});

test('Product creation returns simulated data', async ({ request }) => {
  const payload = { title: 'Portfolio Test Product', price: 12.5 };
  const response = await new ProductsClient(request).create(payload);
  expect(response.status()).toBe(201);
  expect(await response.json()).toMatchObject({ ...payload, id: expect.any(Number) });
});

test('Product update is simulated and does not persist', async ({ request }) => {
  const api = new ProductsClient(request);
  const before = await api.get(1);
  expect(before.status()).toBe(200);
  const original = await before.json();
  const title = original.title + ' - portfolio update';
  const response = await api.update(1, { title });
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({ id: 1, title });
  const after = await api.get(1);
  expect(after.status()).toBe(200);
  expect(await after.json()).toMatchObject({ id: 1, title: original.title });
});

test('Product deletion is simulated and product remains readable', async ({ request }) => {
  const api = new ProductsClient(request);
  const response = await api.delete(1);
  expect(response.status()).toBe(200);
  expect(await response.json()).toMatchObject({
    id: 1,
    isDeleted: true,
    deletedOn: expect.any(String),
  });
  const after = await api.get(1);
  expect(after.status()).toBe(200);
  expect(await after.json()).toMatchObject({ id: 1 });
});
