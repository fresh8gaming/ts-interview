import {
  SnapchatCatalogueAPI,
  Item as CatalogueItem
} from "./api/snapchatCatalogue";
import { ProductFeedAPI } from "./api/productFeed";

export async function syncProductFeed(
  feed: ProductFeedAPI,
  catalogue: SnapchatCatalogueAPI
): Promise<Array<CatalogueItem>> {
  // Your solution here...

  return catalogue.getItems();
}
