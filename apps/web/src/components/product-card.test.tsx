import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("shows product details and the sold-out state", () => {
    render(
      <ProductCard
        product={{
          id: "product-1",
          sku: "AUR-ANI-0001",
          slug: "anillo-aurora",
          name: "Anillo Aurora",
          shortDescription: "Oro de 18 quilates.",
          category: "anillos",
          metal: "oro_18k",
          price: "1250000",
          stock: 0,
          isFeatured: true,
          isNew: true,
          hasCertificate: true,
          images: [{ url: "/seed/joyeria-1.svg", alt: "Anillo Aurora en oro" }]
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Anillo Aurora" })).toBeInTheDocument();
    expect(screen.getByText("Agotado")).toBeInTheDocument();
    expect(screen.getByText("Nuevo")).toBeInTheDocument();
  });
});
