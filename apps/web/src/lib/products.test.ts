import { describe, expect, it } from "vitest";
import { getProductBySlug, getProducts } from "./products";

describe("local demo catalog", () => {
  it("filters and paginates products without an API", async () => {
    const result = await getProducts("category=anillos&limit=1&page=1");

    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.category).toBe("anillos");
    expect(result.pagination).toMatchObject({ page: 1, limit: 1, total: 3, totalPages: 3, hasNext: true });
  });

  it("filters sold-out pieces and sorts prices", async () => {
    const soldOut = await getProducts("inStock=false");
    const ascending = await getProducts("order=price_asc&limit=100");

    expect(soldOut.items.length).toBeGreaterThan(0);
    expect(soldOut.items.every((product) => product.stock === 0)).toBe(true);
    expect(ascending.items[0]?.price).toBeLessThanOrEqual(ascending.items.at(-1)?.price ?? 0);
  });

  it("looks up the local detail page by slug", () => {
    expect(getProductBySlug("anillo-aurora-1")?.name).toBe("Anillo Aurora");
    expect(getProductBySlug("pieza-inexistente")).toBeNull();
  });
});
