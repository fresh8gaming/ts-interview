import { SnapchatCatalogueAPI, Operation } from ".";
import { createCatalogue } from "./mockSnapchatCatalogueImpl";

describe("Catalogue", () => {
  describe("Create", () => {
    it("should add a new product", async () => {
      const catalogue = createCatalogue();
      await catalogue.update([
        {
          action: "CREATE_PRODUCTS",
          products: [
            {
              sku: "001",
              name: "Product 001",
              category: "Cat 00",
              condition: "new",
              quantity: 1,
              price: 10.0
            }
          ]
        }
      ]);

      const items = await catalogue.getItems();
      expect(items).toEqual([
        {
          sku: "001",
          name: "Product 001",
          category: "Cat 00",
          condition: "new",
          quantity: 1,
          price: 10.0
        }
      ]);
    });

    it("should throw an error if the product already exists", async () => {
      const catalogue = createCatalogue();
      const operation: Operation = {
        action: "CREATE_PRODUCTS",
        products: [
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          }
        ]
      };
      await catalogue.update([operation]);
      await expect(catalogue.update([operation])).rejects.toEqual(
        new Error('Cannot create product "001". Product already exists.')
      );
    });

    it("should throw an error when trying to create the same product twice", async () => {
      const catalogue = createCatalogue();
      const operation: Operation = {
        action: "CREATE_PRODUCTS",
        products: [
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          },
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          }
        ]
      };
      await expect(catalogue.update([operation])).rejects.toEqual(
        new Error('Cannot create product "001". Product already exists.')
      );
    });
  });

  describe("Update", () => {
    let catalogue: SnapchatCatalogueAPI;

    beforeEach(async () => {
      catalogue = createCatalogue();
      const operation: Operation = {
        action: "CREATE_PRODUCTS",
        products: [
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          }
        ]
      };
      await catalogue.update([operation]);
    });
    it("should update an existing product", () => {});

    it("should error when trying to update a product that doesn't exist", () => {});

    it("will apply updates to the same product in order", () => {});
  });

  describe("Delete", () => {
    let catalogue: SnapchatCatalogueAPI;

    beforeEach(async () => {
      catalogue = createCatalogue();
      const operation: Operation = {
        action: "CREATE_PRODUCTS",
        products: [
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          }
        ]
      };
      await catalogue.update([operation]);
    });
    it("should delete an existing product", async () => {
      await catalogue.update([
        {
          action: "DELETE_PRODUCTS",
          products: [
            {
              sku: "001",
              name: "Product 001",
              category: "Cat 00",
              condition: "new",
              quantity: 1,
              price: 10.0
            }
          ]
        }
      ]);
      const items = await catalogue.getItems();
      expect(items).toEqual([]);
    });

    it("should error when trying to delete a product that doesn't exist", async () => {
      const operation: Operation = {
        action: "DELETE_PRODUCTS",
        products: [
          {
            sku: "002",
            name: "Product 002",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          }
        ]
      };
      await catalogue.update([
        {
          action: "DELETE_PRODUCTS",
          products: [
            {
              sku: "001",
              name: "Product 001",
              category: "Cat 00",
              condition: "new",
              quantity: 1,
              price: 10.0
            }
          ]
        }
      ]);
      await expect(catalogue.update([operation])).rejects.toEqual(
        new Error('Cannot delete product "002". Product does not exist.')
      );
    });

    it("should error when trying to delete that same product twice", async () => {
      const operation: Operation = {
        action: "DELETE_PRODUCTS",
        products: [
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          },
          {
            sku: "001",
            name: "Product 001",
            category: "Cat 00",
            condition: "new",
            quantity: 1,
            price: 10.0
          }
        ]
      };
      await catalogue.update([
        {
          action: "DELETE_PRODUCTS",
          products: [
            {
              sku: "001",
              name: "Product 001",
              category: "Cat 00",
              condition: "new",
              quantity: 1,
              price: 10.0
            }
          ]
        }
      ]);
      await expect(catalogue.update([operation])).rejects.toEqual(
        new Error('Cannot delete product "001". Product does not exist.')
      );
    });
  });
});
