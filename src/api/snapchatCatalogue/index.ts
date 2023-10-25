export interface SnapchatCatalogueAPI {
  /**
   * Update the items that form a Catalogue. An operation can either:
   * - Create a new item
   * - Update an existing item
   * - Delete an existing item
   */
  update(operations: Array<Operation>): Promise<void>;
  /**
   * Returns a list of **every** in stock item in this Catalogue.
   */
  getItems(): Promise<Array<Item>>;
}

export interface Operation {
  action: "CREATE_PRODUCTS" | "UPDATE_PRODUCTS" | "DELETE_PRODUCTS";
  products: Array<Item>;
}

export interface Item {
  sku: string;
  name: string;
  category: string;
  condition: Condition;
  price: number;
  quantity: number;
}

export type Condition = "new" | "used";
