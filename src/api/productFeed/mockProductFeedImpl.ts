import fs from "fs";
import { Product, ProductFeedAPI } from ".";

const LAST_PRODUCT_FEED_NUM = 6;

export function createProductFeed(
  from = 1,
  to = LAST_PRODUCT_FEED_NUM
): ProductFeedAPI {
  let state = from;

  const productsFileStore: ProductFeedAPI = {
    async getProducts() {
      const fileContents = fs.readFileSync(`./__data__/${state}.json`, "utf-8");
      const parsed = JSON.parse(fileContents) as Array<Product>;

      if (state < to) {
        state += 1;
      }

      return parsed;
    }
  };

  return productsFileStore;
}
