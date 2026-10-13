"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { getSavedProducts } from "@/lib/product-storage";
import type { Product } from "@/lib/products";

export function FeaturedProducts({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    let active = true;
    getSavedProducts()
      .then((saved) => {
        if (active)
          setProducts([...saved.filter((product) => product.isFeatured), ...initialProducts].slice(0, 4));
      })
      .catch((error: unknown) => console.error("No se pudieron leer los destacados locales.", error));
    return () => {
      active = false;
    };
  }, [initialProducts]);

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
