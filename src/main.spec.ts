import { syncProductFeed } from "./";
import { SnapchatCatalogueAPI, Item } from "./api/snapchatCatalogue";
import { createCatalogue } from "./api/snapchatCatalogue/mockSnapchatCatalogueImpl";
import { createProductFeed } from "./api/productFeed/mockProductFeedImpl";

it("Exercise 1 - Should add a product to a catalogue", async () => {
  const { replay } = await setup();
  const actual = await replay({ from: 1, to: 1 });
  const expected: Array<Item> = [
    {
      sku: "001",
      name: "Signed Messi Shirt",
      category: "Football",
      condition: "new",
      quantity: 1,
      price: 5.0
    }
  ];

  expect(actual).toEqual(expected);
});

it("Exercise 2 - Add additional products to a catalogue", async () => {
  const { replay } = await setup();
  const actual = await replay({ from: 1, to: 2 });
  const expected: Array<Item> = [
    {
      sku: "001",
      name: "Signed Messi Shirt",
      category: "Football",
      condition: "new",
      quantity: 1,
      price: 5.0
    },
    {
      sku: "002",
      name: "Match ball signed by Lebron James",
      category: "Basketball",
      condition: "used",
      quantity: 1,
      price: 10.0
    }
  ];

  expect(actual).toEqual(expected);
});

it("Exercise 3 - Reflects the quantity of a product accurately in a Catalogue", async () => {
  const { replay } = await setup();
  const actual = await replay({ from: 1, to: 3 });
  const expected: Array<Item> = [
    {
      sku: "001",
      name: "Signed Messi Shirt",
      category: "Football",
      condition: "new",
      quantity: 2,
      price: 5.0
    },
    {
      sku: "002",
      name: "Match ball signed by Lebron James",
      category: "Basketball",
      condition: "used",
      quantity: 3,
      price: 10.0
    },
    {
      sku: "003",
      name: "A very nice puck",
      category: "Ice Hockey",
      condition: "used",
      quantity: 1,
      price: 50.0
    },
    {
      sku: "004",
      name: "Juan Soto's favourite glove",
      category: "Baseball",
      condition: "new",
      quantity: 2,
      price: 999.0
    }
  ];

  expect(actual).toEqual(expected);
});

it("Exercise 4 - Updates existing products in a catalogue", async () => {
  const { replay } = await setup();
  const actual = await replay({ from: 1, to: 4 });
  const expected: Array<Item> = [
    {
      sku: "001",
      name: "Signed Messi Shirt",
      category: "Football",
      condition: "new",
      quantity: 1,
      price: 5.0
    },
    {
      sku: "002",
      name: "Match ball signed by Lebron James",
      category: "Basketball",
      condition: "used",
      quantity: 1,
      price: 25.0
    }
  ];

  expect(actual).toEqual(expected);
});

it("Exercise 5 - Deletes out of stock items in a Catalogue", async () => {
  const { replay } = await setup();
  const actual = await replay({ from: 1, to: 5 });
  const expected: Array<Item> = [
    {
      sku: "001",
      name: "Signed Messi Shirt",
      category: "Football",
      condition: "new",
      quantity: 2,
      price: 5.0
    },
    {
      sku: "003",
      name: "A very nice puck",
      category: "Ice Hockey",
      condition: "used",
      quantity: 1,
      price: 50.0
    },
    {
      sku: "004",
      name: "Juan Soto's favourite glove",
      category: "Baseball",
      condition: "new",
      quantity: 2,
      price: 999.0
    }
  ];

  expect(actual).toEqual(expected);
});

it("Exercise 6 - Only updates those products that have changed", async () => {
  const { replay, catalogue } = await setup();
  const updateSpy = jest.spyOn(catalogue, "update");
  const actual = await replay({ from: 5, to: 6 });
  const expected: Array<Item> = [
    {
      sku: "001",
      name: "Signed Messi Shirt",
      category: "Football",
      condition: "new",
      quantity: 2,
      price: 5.0
    },
    {
      sku: "003",
      name: "A very nice puck",
      category: "Ice Hockey",
      condition: "used",
      quantity: 1,
      price: 50.0
    },
    {
      sku: "004",
      name: "Juan Soto's favourite glove",
      category: "Baseball",
      condition: "new",
      quantity: 2,
      price: 999.0
    }
  ];

  // Check no unecessary updates happen
  expect(updateSpy).toHaveBeenCalledTimes(1);
  expect(actual).toEqual(expected);

  // Replay the whole feed just to be sure
  const actual2 = await replay({ from: 1, to: 6 });
  expect(actual2).toEqual(expected);
});

type ReplayFunc = ({
  from,
  to
}: {
  from: number;
  to: number;
}) => Promise<Array<Item>>;

async function setup(): Promise<{
  catalogue: SnapchatCatalogueAPI;
  replay: ReplayFunc;
}> {
  const rateLimit = 1;
  const { catalogue, limiter } = createCatalogueWithLimiter(rateLimit);

  return {
    catalogue,
    replay: async ({ from, to }: { from: number; to: number }) => {
      const feed = createProductFeed(from, to);
      const iterations = to - from;

      let products: Array<Item> = [];
      for (let i = 0; i <= iterations; i++) {
        products = await syncProductFeed(feed, catalogue);
        limiter.reset();
      }
      return products;
    }
  };
}

const createCatalogueWithLimiter = (
  rateLimit: number
): { catalogue: SnapchatCatalogueAPI; limiter: { reset: () => void } } => {
  const catalogue = createCatalogue();
  let callCount = 0;

  return {
    catalogue: {
      ...catalogue,
      async update(operations) {
        if (callCount >= rateLimit) {
          throw new Error("Rate limit exceeded");
        }
        await catalogue.update(operations);
        callCount += 1;
      }
    },
    limiter: {
      reset() {
        callCount = 0;
      }
    }
  };
};
