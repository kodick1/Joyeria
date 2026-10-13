import { ProductDetail } from "@/components/product-detail";
import { demoProducts, getProductBySlug } from "@/lib/products";
import type { Metadata } from "next";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const product = getProductBySlug(slug);
    return product
      ? { title: `${product.name} | Aurelia Joyería`, description: product.shortDescription }
      : { title: "Pieza Aurelia | Joyería contemporánea" };
  });
}

export function generateStaticParams() {
  return demoProducts.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetail slug={slug} initialProduct={getProductBySlug(slug)} />;
}
