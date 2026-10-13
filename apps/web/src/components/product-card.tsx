import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatPrice, type Product } from "@/lib/products";

const fallbackImage = "/seed/joyeria-1.svg";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <article className="group">
      <Link href={`/joyas/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-luxury bg-[#eee9e0]">
          <Image
            src={image?.url ?? fallbackImage}
            alt={image?.alt ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={image?.url.startsWith("data:")}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlZWU5ZTAiLz48L3N2Zz4="
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.isNew && (
            <span className="absolute left-3 top-3 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[.18em]">
              Nuevo
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute bottom-3 left-3 bg-ink/85 px-3 py-1 text-xs text-white">Agotado</span>
          )}
          <span className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white opacity-0 transition duration-180 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={17} />
          </span>
        </div>
        <div className="flex items-start justify-between gap-3 pt-4">
          <div>
            <h3 className="font-display text-[22px] leading-tight">{product.name}</h3>
            <p className="mt-1 text-xs text-muted">{product.shortDescription}</p>
          </div>
          <span className="whitespace-nowrap pt-1 text-sm">{formatPrice(product.price)}</span>
        </div>
      </Link>
    </article>
  );
}
