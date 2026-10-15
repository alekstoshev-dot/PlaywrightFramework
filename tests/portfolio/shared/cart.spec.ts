import { test } from '../../../src/fixtures/test';
import { products } from '../../../src/data/products';

// Skip known Android failures before creating an Appium session.
test.beforeEach(async ({}, info) => {
  const disabled = info.annotations.find((annotation) => annotation.type === 'android-disabled');
  test.skip(info.project.name === 'android' && Boolean(disabled), disabled?.description);
});

test.beforeEach(async ({ shop }) => {
  await test.step('Open the shopping catalog', () => shop.open());
});

for (const product of [products.backpack, products.bikeLight]) {
  // ANDROID-001: official APK crashes when opening Bike Light (catalog index >=6).
  test(
    `${product.name} can be added to the cart`,
    {
      annotation:
        product.id === products.bikeLight.id
          ? {
              type: 'android-disabled',
              description:
                'ANDROID-001: Bike Light closes the official app; observed catalog ArrayIndexOutOfBoundsException.',
            }
          : [],
    },
    async ({ shop }) => {
      await test.step(`Add ${product.name}`, () => shop.addProduct(product));
      await test.step('Open the cart', () => shop.openCart());
      await test.step('Verify exact cart contents', () => shop.expectCartProducts([product]));
    },
  );
}

test('New session starts with an empty cart', async ({ shop }) => {
  await test.step('Open the cart', () => shop.openCart());
  await test.step('Verify the cart is empty', () => shop.expectCartProducts([]));
});

// ANDROID-INFRA-001: UiAutomator2 stops after Back from backpack details; device offline.
// Root cause is not confirmed as an application defect. Scenario also includes ANDROID-001.
test(
  'Two different products can be added to the cart',
  {
    annotation: {
      type: 'android-disabled',
      description:
        'ANDROID-INFRA-001: socket hang up / instrumentation stopped after Back; also includes Bike Light defect ANDROID-001.',
    },
  },
  async ({ shop }) => {
    await test.step('Add the backpack', () => shop.addProduct(products.backpack));
    await test.step('Add the bike light', () => shop.addProduct(products.bikeLight));
    await test.step('Open the cart', () => shop.openCart());
    await test.step('Verify both products', () =>
      shop.expectCartProducts([products.backpack, products.bikeLight]));
  },
);

// ANDROID-001: fails while adding Bike Light, before removal is reached.
test(
  'Removing one product preserves the other',
  {
    annotation: {
      type: 'android-disabled',
      description: 'ANDROID-001: app closes while adding Bike Light; removal step is not reached.',
    },
  },
  async ({ shop }) => {
    await test.step('Add the backpack', () => shop.addProduct(products.backpack));
    await test.step('Add the bike light', () => shop.addProduct(products.bikeLight));
    await test.step('Open the cart', () => shop.openCart());
    await test.step('Remove the backpack', () => shop.removeProduct(products.backpack));
    await test.step('Verify only the bike light remains', () =>
      shop.expectCartProducts([products.bikeLight]));
  },
);

test('Removing the last product empties the cart', async ({ shop }) => {
  await test.step('Add the backpack', () => shop.addProduct(products.backpack));
  await test.step('Open the cart', () => shop.openCart());
  await test.step('Remove the backpack', () => shop.removeProduct(products.backpack));
  await test.step('Verify the cart is empty', () => shop.expectCartProducts([]));
});
