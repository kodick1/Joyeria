"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getSavedProducts } from "@/lib/product-storage";
import { demoProducts, filterProducts, type Product } from "@/lib/products";

export function ProductGrid({
  initialProducts,
  query,
  emptyMessage = "Estamos preparando una colección especial. Vuelve pronto."
}: {
  initialProducts: Product[];
  query: string;
  emptyMessage?: string;
}) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    let active = true;
    getSavedProducts()
      .then((saved) => {
        if (active) {
          const filtered = filterProducts(query, [...saved, ...demoProducts]);
          const params = new URLSearchParams(query);
          const page = Math.max(1, Number(params.get("page")) || 1);
          const limit = Math.min(100, Math.max(1, Number(params.get("limit")) || 12));
          setProducts(filtered.slice((page - 1) * limit, page * limit));
        }
      })
      .catch((error: unknown) => {
        console.error("No se pudieron cargar las piezas publicadas en este navegador.", error);
      });
    return () => {
      active = false;
    };
  }, [query]);

  return products.length ? (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  ) : (
    <div className="border border-border bg-white px-8 py-16 text-center">
      <h2 className="font-display text-3xl">Aún no hay piezas en esta selección</h2>
      <p className="mt-2 text-sm text-muted">{emptyMessage}</p>
      <Link href="/joyas" className="mt-6 inline-block text-xs uppercase tracking-widest text-gold">
        Limpiar filtros
      </Link>
    </div>
  );
}
