export interface Product {
  readonly id: string;
  readonly name: string;
}
export interface Shop {
  open(): Promise<void>;
  addProduct(product: Product): Promise<void>;
  openCart(): Promise<void>;
  removeProduct(product: Product): Promise<void>;
  expectCartProducts(products: readonly Product[]): Promise<void>;
}
