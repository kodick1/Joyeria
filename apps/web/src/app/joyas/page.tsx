import Link from "next/link";
import { Search } from "lucide-react";
import { getProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product-grid";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function CatalogPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const key of [
    "search",
    "category",
    "metal",
    "gemstone",
    "size",
    "minPrice",
    "maxPrice",
    "inStock",
    "order",
    "page"
  ]) {
    const value = params[key];
    if (typeof value === "string") query.set(key, value);
  }
  query.set("limit", "12");
  const updateHref = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(query);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    return `/joyas?${next.toString()}`;
  };
  const hiddenFilters = [...query.entries()].filter(
    ([key]) =>
      !["metal", "gemstone", "size", "minPrice", "maxPrice", "inStock", "order", "page", "limit"].includes(
        key
      )
  );
  const { items, pagination } = await getProducts(query.toString());
  const nextPageQuery = new URLSearchParams(query);
  nextPageQuery.set("page", String(pagination.page + 1));
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-6 py-5 md:px-14">
        <Link href="/" className="font-display text-3xl tracking-[.12em]">
          AURELIA
        </Link>
        <Link href="/admin" className="text-xs uppercase tracking-widest">
          Administración
        </Link>
      </header>
      <section className="mx-auto max-w-[1440px] px-6 py-14 md:px-14 md:py-20">
        <p className="text-[10px] uppercase tracking-[.22em] text-gold">Hechas para ti</p>
        <h1 className="mt-3 font-display text-6xl">Nuestra colección</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
          Encuentra esa pieza especial que habla de ti.
        </p>
        <form className="mt-9 flex max-w-xl items-center gap-3 border-b border-border pb-3">
          <Search size={17} className="text-muted" />
          {hiddenFilters
            .filter(([key]) => key !== "search")
            .map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          <input
            name="search"
            defaultValue={typeof params.search === "string" ? params.search : ""}
            placeholder="Busca por nombre o pieza"
            aria-label="Buscar joyas"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <button type="submit" className="text-xs uppercase tracking-widest">
            Buscar
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-2">
          {["", "anillos", "collares", "pulseras", "aretes", "dijes", "relojes", "sets"].map((category) => (
            <Link
              key={category || "all"}
              href={updateHref({ category: category || null })}
              className={`rounded-full border px-4 py-2 text-xs transition hover:border-gold ${params.category === category || (!params.category && !category) ? "border-ink bg-ink text-white" : "border-border"}`}
            >
              {category ? category.charAt(0).toUpperCase() + category.slice(1) : "Todas las piezas"}
            </Link>
          ))}
        </div>
        <form className="mt-5 grid grid-cols-2 gap-3 rounded-luxury border border-border bg-white p-4 sm:grid-cols-3 lg:grid-cols-6">
          {hiddenFilters.map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <label className="text-[10px] uppercase tracking-wider text-muted">
            Metal
            <select
              name="metal"
              defaultValue={typeof params.metal === "string" ? params.metal : ""}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-xs text-ink"
            >
              <option value="">Todos</option>
              <option value="oro_18k">Oro 18k</option>
              <option value="oro_14k">Oro 14k</option>
              <option value="oro_blanco">Oro blanco</option>
              <option value="oro_rosa">Oro rosa</option>
              <option value="plata_925">Plata 925</option>
              <option value="platino">Platino</option>
              <option value="acero">Acero</option>
            </select>
          </label>
          <label className="text-[10px] uppercase tracking-wider text-muted">
            Piedra
            <select
              name="gemstone"
              defaultValue={typeof params.gemstone === "string" ? params.gemstone : ""}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-xs text-ink"
            >
              <option value="">Todas</option>
              <option value="diamante">Diamante</option>
              <option value="esmeralda">Esmeralda</option>
              <option value="zafiro">Zafiro</option>
              <option value="rubi">Rubí</option>
              <option value="perla">Perla</option>
              <option value="circon">Circón</option>
            </select>
          </label>
          <label className="text-[10px] uppercase tracking-wider text-muted">
            Talla o largo
            <input
              name="size"
              defaultValue={typeof params.size === "string" ? params.size : ""}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-xs text-ink"
            />
          </label>
          <label className="text-[10px] uppercase tracking-wider text-muted">
            Precio mínimo
            <input
              name="minPrice"
              type="number"
              min="0"
              defaultValue={typeof params.minPrice === "string" ? params.minPrice : ""}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-xs text-ink"
            />
          </label>
          <label className="text-[10px] uppercase tracking-wider text-muted">
            Precio máximo
            <input
              name="maxPrice"
              type="number"
              min="0"
              defaultValue={typeof params.maxPrice === "string" ? params.maxPrice : ""}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-xs text-ink"
            />
          </label>
          <label className="text-[10px] uppercase tracking-wider text-muted">
            Disponibilidad
            <select
              name="inStock"
              defaultValue={typeof params.inStock === "string" ? params.inStock : ""}
              className="mt-2 block w-full border-b border-border bg-transparent py-2 text-xs text-ink"
            >
              <option value="">Todas las piezas</option>
              <option value="true">Disponibles</option>
              <option value="false">Agotadas</option>
            </select>
          </label>
          <button className="col-span-2 mt-2 justify-self-start bg-emerald px-5 py-3 text-[10px] uppercase tracking-widest text-white sm:col-span-3 lg:col-span-6">
            Aplicar filtros
          </button>
        </form>
        <div className="mt-10 flex items-center justify-between text-xs text-muted">
          <span>{pagination.total} piezas</span>
          <form>
            {[...query.entries()]
              .filter(([key]) => !["order", "page", "limit"].includes(key))
              .map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
            <select
              name="order"
              defaultValue={typeof params.order === "string" ? params.order : "newest"}
              className="bg-transparent text-ink"
              aria-label="Ordenar productos"
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="featured">Destacados</option>
            </select>
          </form>
        </div>
        <div className="mt-6">
          <ProductGrid
            initialProducts={items}
            query={query.toString()}
            emptyMessage="Prueba con otros filtros o descubre toda la colección."
          />
        </div>
        {pagination.hasNext && (
          <div className="mt-12 text-center">
            <Link
              href={`/joyas?${nextPageQuery.toString()}`}
              className="border border-ink px-8 py-4 text-xs uppercase tracking-widest"
            >
              Cargar más piezas
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
