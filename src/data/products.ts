import type { Product } from '../contracts/Shop';
export const products = {
  backpack: { id: 'sauce-labs-backpack', name: 'Sauce Labs Backpack' },
  bikeLight: { id: 'sauce-labs-bike-light', name: 'Sauce Labs Bike Light' },
} as const satisfies Record<string, Product>;
