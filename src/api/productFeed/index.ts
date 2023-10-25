export interface ProductFeedAPI {
  /**
   * Returns a list of **every** in stock product.
   */
  getProducts(): Promise<Array<Product>>;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quality: Quality;
  price: number;
}

export type Quality = "new" | "used";
