"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BadgeCheck, PackageCheck } from "lucide-react";
import { getSavedProducts } from "@/lib/product-storage";
import { formatPrice, type Product } from "@/lib/products";

export function ProductDetail({ slug, initialProduct }: { slug: string; initialProduct: Product | null }) {
  const [product, setProduct] = useState(initialProduct);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let active = true;
    getSavedProducts()
      .then((saved) => {
        const localProduct = saved.find((item) => item.slug === slug);
        if (active && localProduct) setProduct(localProduct);
      })
      .catch((error: unknown) => console.error("No se pudieron cargar las fotos de esta pieza.", error));
    return () => {
      active = false;
    };
  }, [slug]);

  if (!product) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-4xl">Esta pieza no está disponible</h1>
          <Link href="/joyas" className="mt-5 inline-block text-xs uppercase tracking-widest text-gold">
            Volver a la colección
          </Link>
        </div>
      </main>
    );
  }

  const image = product.images[selectedImage] ?? product.images[0];

  return (
    <main className="min-h-screen">
      <header className="border-b border-border px-6 py-5 md:px-14">
        <Link href="/" className="font-display text-3xl tracking-[.12em]">
          AURELIA
        </Link>
      </header>
      <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-14">
        <nav className="mb-8 text-xs text-muted">
          <Link href="/">Inicio</Link> / <Link href="/joyas">Joyas</Link> / {product.name}
        </nav>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-luxury bg-[#eee9e0]">
              {image && (
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority
                  unoptimized={image.url.startsWith("data:")}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {product.images.map((item, index) => (
                  <button
                    key={`${item.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    aria-label={`Ver foto ${index + 1} de ${product.name}`}
                    aria-pressed={selectedImage === index}
                    className={`relative aspect-square overflow-hidden rounded border ${selectedImage === index ? "border-ink" : "border-border"}`}
                  >
                    <Image
                      src={item.url}
                      alt={item.alt}
                      fill
                      unoptimized={item.url.startsWith("data:")}
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="py-4 md:py-12">
            <p className="text-[10px] uppercase tracking-[.22em] text-gold">{product.category}</p>
            <h1 className="mt-3 font-display text-5xl leading-tight md:text-6xl">{product.name}</h1>
            <p className="mt-2 text-xs text-muted">Referencia {product.sku}</p>
            <p className="mt-7 text-2xl">{formatPrice(product.price)}</p>
            {product.compareAtPrice && (
              <p className="mt-1 text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</p>
            )}
            <p className="mt-4 max-w-lg text-sm leading-7 text-muted">{product.description}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.hasCertificate && (
                <span className="flex items-center gap-2 border border-border px-3 py-2 text-xs">
                  <BadgeCheck size={15} className="text-gold" /> Certificado de autenticidad
                </span>
              )}
              <span className="flex items-center gap-2 border border-border px-3 py-2 text-xs">
                <PackageCheck size={15} className="text-gold" />{" "}
                {product.stock === 0 ? "Agotado" : product.stock <= 3 ? "Últimas unidades" : "Disponible"}
              </span>
            </div>
            <button
              disabled={product.stock === 0}
              className="mt-8 w-full bg-emerald px-6 py-4 text-xs uppercase tracking-[.14em] text-white transition hover:bg-[#294d44] disabled:cursor-not-allowed disabled:bg-muted"
            >
              Agregar al carrito
            </button>
            <div className="mt-10 border-t border-border pt-6">
              <h2 className="font-display text-2xl">Detalles de la pieza</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Metal</dt>
                  <dd>{product.metal.replace("_", " ")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Piedra</dt>
                  <dd>{product.gemstone}</dd>
                </div>
                {product.caratWeight && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Quilates</dt>
                    <dd>{product.caratWeight} ct</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">Peso</dt>
                  <dd>{product.weightGrams} g</dd>
                </div>
                {product.size && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Talla o largo</dt>
                    <dd>{product.size}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
