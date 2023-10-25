import { Item, SnapchatCatalogueAPI } from ".";

export function createCatalogue(): SnapchatCatalogueAPI {
  let _products: Array<Item> = [];

  const _getExistingProductIndex = (productToFind: Item) => {
    return _products.findIndex(product => product.sku === productToFind.sku);
  };

  const catalogue: SnapchatCatalogueAPI = {
    async update(operations) {
      // simulate some fake network latency
      await sleepRandom(0, 100);
      for (const operation of operations) {
        if (operation.action === "CREATE_PRODUCTS") {
          for (const newProduct of operation.products) {
            const idx = _getExistingProductIndex(newProduct);
            if (idx !== -1) {
              throw new Error(
                `Cannot create product "${newProduct.sku}". Product already exists.`
              );
            }
            _products.push(newProduct);
          }
        }
        if (operation.action === "UPDATE_PRODUCTS") {
          for (const updatedProduct of operation.products) {
            const idx = _getExistingProductIndex(updatedProduct);
            if (idx === -1) {
              throw new Error(
                `Cannot update product "${updatedProduct.sku}". Product does not exist.`
              );
            }
            _products = [
              ..._products.slice(0, idx),
              updatedProduct,
              ..._products.slice(idx + 1)
            ];
          }
        }
        if (operation.action === "DELETE_PRODUCTS") {
          for (const productToDel of operation.products) {
            const idx = _getExistingProductIndex(productToDel);
            if (idx === -1) {
              throw new Error(
                `Cannot delete product "${productToDel.sku}". Product does not exist.`
              );
            }
            _products = _products.filter(product => {
              return productToDel.sku !== product.sku;
            });
          }
        }
      }
    },
    async getItems() {
      // simulate some fake network latency
      await sleepRandom(0, 100);
      return _products;
    }
  };

  return catalogue;
}

async function sleepRandom(min: number, max: number) {
  return new Promise(resolve => {
    const time = Math.random() * (max - min) + min;

    setTimeout(resolve, time);
  });
}
