import type { ShopSelectors } from '../mobile/MobileShop';
import { xpathLiteral } from '../mobile/xpath';
const row = (name: string) =>
  `//XCUIElementTypeCell[.//XCUIElementTypeStaticText[@label=${xpathLiteral(name)}]]`;
export const iosSelectors: ShopSelectors = {
  catalog: '~Catalog-screen',
  product: (product) =>
    `-ios predicate string:type == "XCUIElementTypeStaticText" AND label == ${JSON.stringify(product.name)}`,
  add: '~AddToCart',
  cart: '~Cart-tab-item',
  cartScreen: '~Cart-screen',
  catalogNavigation: '~Catalog-tab-item',
  cartRows: '//XCUIElementTypeCell[.//XCUIElementTypeButton[@name="Remove Item"]]',
  cartProduct: (product) =>
    `${row(product.name)}//XCUIElementTypeStaticText[@label=${xpathLiteral(product.name)}]`,
  remove: (product) => `${row(product.name)}//XCUIElementTypeButton[@name="Remove Item"]`,
  emptyCart: '-ios predicate string:type == "XCUIElementTypeStaticText" AND label == "No Items"',
};
