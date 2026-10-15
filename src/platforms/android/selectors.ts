import type { ShopSelectors } from '../mobile/MobileShop';
import { xpathLiteral } from '../mobile/xpath';
const id = 'com.saucelabs.mydemoapp.android:id/';
const row = (name: string) =>
  `//*[@resource-id="${id}productRV"]/*[.//*[@resource-id="${id}titleTV" and @text=${xpathLiteral(name)}]]`;
export const androidSelectors: ShopSelectors = {
  startupDialog: {
    title: 'android=new UiSelector().text("Android App Compatibility")',
    dismiss: 'android=new UiSelector().text("Don\'t Show Again")',
  },
  catalog: `id=${id}productRV`,
  revealProduct: (product) =>
    `android=new UiScrollable(new UiSelector().resourceId("${id}scrollView")).scrollIntoView(new UiSelector().text(${JSON.stringify(product.name)}))`,
  product: (product) =>
    `//android.widget.TextView[@text=${xpathLiteral(product.name)}]/../android.widget.ImageView[@resource-id="${id}productIV"]`,
  add: '~Tap to add product to cart',
  cart: '~View cart',
  cartScreen: `id=${id}cartCL`,
  cartRows: `//*[@resource-id="${id}productRV"]/*[.//*[@resource-id="${id}titleTV"]]`,
  cartProduct: (product) => `${row(product.name)}//*[@resource-id="${id}titleTV"]`,
  remove: (product) => `${row(product.name)}//*[@resource-id="${id}removeBt"]`,
  emptyCart: `id=${id}noItemTitleTV`,
};
