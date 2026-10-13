"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Gem, Plus, UsersRound } from "lucide-react";
import { getSavedProducts } from "@/lib/product-storage";
import { demoProducts, formatPrice, type Product } from "@/lib/products";

export function AdminDashboard() {
  const [products, setProducts] = useState(demoProducts);
  const [storageError, setStorageError] = useState("");

  useEffect(() => {
    let active = true;
    getSavedProducts()
      .then((saved) => {
        if (active) setProducts([...saved, ...demoProducts]);
      })
      .catch((error: unknown) => {
        console.error("No se pudieron cargar las piezas del almacenamiento local.", error);
        if (active) setStorageError("No pudimos leer las piezas guardadas en este navegador.");
      });
    return () => {
      active = false;
    };
  }, []);

  const productCsv = useMemo(
    () =>
      csvDataUri([
        ["SKU", "Nombre", "Categoría", "Precio", "Stock"],
        ...products.map((product) => [
          product.sku,
          product.name,
          product.category,
          product.price,
          product.stock
        ])
      ]),
    [products]
  );
  const userCsv = csvDataUri([
    ["Nombre", "Correo", "Rol", "Estado"],
    ["Sofía Ramírez", "sofia@aurelia.demo", "Administradora", "Activo"],
    ["Camila Torres", "camila@aurelia.demo", "Cliente", "Activo"]
  ]);
  const lowStock = products.filter((product) => product.stock <= product.lowStockThreshold).length;
  const recentProducts = products.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#f5f2ec] md:flex">
      <aside className="flex flex-row items-center justify-between bg-emerald px-6 py-5 text-white md:min-h-screen md:w-64 md:flex-col md:items-start md:justify-start md:px-7 md:py-9">
        <Link href="/" className="font-display text-3xl tracking-[.12em]">
          AURELIA
        </Link>
        <nav className="flex gap-5 text-xs md:mt-16 md:flex-col md:gap-6">
          <Link href="/admin" className="text-white">
            Resumen
          </Link>
          <Link href="/joyas" className="text-white/70">
            Catálogo
          </Link>
          <a href="#usuarios" className="text-white/70">
            Usuarios
          </a>
        </nav>
        <Link href="/" className="mt-auto hidden text-xs text-white/65 md:block">
          Volver a la tienda ↗
        </Link>
      </aside>
      <section className="w-full px-5 py-8 md:px-12 md:py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[.2em] text-gold">Espacio de gestión</p>
            <h1 className="mt-2 font-display text-5xl">Resumen</h1>
            <p className="mt-2 text-sm text-muted">Un vistazo a la casa Aurelia.</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/productos/nuevo"
              className="flex items-center gap-2 bg-emerald px-4 py-3 text-xs uppercase tracking-wider text-white"
            >
              <Plus size={15} /> Añadir pieza
            </Link>
            <a
              href={productCsv}
              download="aurelia-productos-demo.csv"
              className="flex items-center gap-2 border border-border bg-white px-4 py-3 text-xs uppercase tracking-wider"
            >
              <ArrowDownToLine size={15} /> Exportar CSV
            </a>
          </div>
        </div>
        {storageError && (
          <p role="alert" className="mt-5 border border-error/30 bg-white p-4 text-sm text-error">
            {storageError}
          </p>
        )}
        <p className="mt-5 border border-gold/25 bg-white/70 px-4 py-3 text-xs leading-5 text-muted">
          Las piezas y fotos que agregues se conservan en este navegador y se muestran en la tienda de este
          mismo dispositivo.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { title: "Piezas en catálogo", value: products.length, Icon: Gem },
            { title: "Stock por revisar", value: lowStock, Icon: ArrowUpRight },
            { title: "Usuarios activos", value: 28, Icon: UsersRound }
          ].map(({ title, value, Icon }) => (
            <div key={title} className="rounded-luxury border border-border bg-white p-6">
              <div className="flex items-center justify-between text-muted">
                <span className="text-xs">{title}</span>
                <Icon size={18} className="text-gold" />
              </div>
              <p className="mt-6 font-display text-4xl">{value}</p>
            </div>
          ))}
        </div>
        <section className="mt-9 overflow-hidden rounded-luxury border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-5 py-5 md:px-7">
            <div>
              <h2 className="font-display text-3xl">Piezas recientes</h2>
              <p className="mt-1 text-xs text-muted">Selecciona una pieza para ver cómo luce en la tienda.</p>
            </div>
            <Link href="/joyas" className="flex items-center gap-1 text-xs uppercase tracking-widest">
              Ver catálogo <ArrowUpRight size={14} />
            </Link>
          </div>
          {recentProducts.length ? (
            <>
              <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 bg-[#faf8f4] px-7 py-3 text-[10px] uppercase tracking-widest text-muted md:grid">
                <span>Producto</span>
                <span>Referencia</span>
                <span>Precio</span>
                <span>Inventario</span>
              </div>
              {recentProducts.map((product) => (
                <AdminProductRow key={product.id} product={product} />
              ))}
            </>
          ) : (
            <p className="p-8 text-sm text-muted">Aún no hay piezas en la selección.</p>
          )}
        </section>
        <section id="usuarios" className="mt-7 rounded-luxury border border-border bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl">Usuarios</h2>
              <p className="mt-2 text-sm text-muted">
                Un vistazo a las personas que forman parte de la casa Aurelia.
              </p>
            </div>
            <a
              href={userCsv}
              download="aurelia-usuarios-demo.csv"
              className="border border-border px-4 py-3 text-xs uppercase tracking-wider"
            >
              Exportar usuarios
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}

function AdminProductRow({ product }: { product: Product }) {
  const image = product.images[0];
  return (
    <Link
      href={`/joyas/${product.slug}`}
      className="grid grid-cols-[1fr_auto] gap-3 border-b border-border px-5 py-4 transition hover:bg-ivory last:border-0 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center md:px-7"
    >
      <div className="flex items-center gap-3">
        {image && (
          <Image
            src={image.url}
            alt={image.alt}
            width={48}
            height={60}
            unoptimized={image.url.startsWith("data:")}
            className="h-[60px] w-12 rounded object-cover"
          />
        )}
        <div>
          <p className="font-display text-xl">{product.name}</p>
          <p className="mt-1 text-xs text-muted md:hidden">
            {product.sku} · {formatPrice(product.price)}
          </p>
        </div>
      </div>
      <span className="hidden text-xs text-muted md:block">{product.sku}</span>
      <span className="hidden text-sm md:block">{formatPrice(product.price)}</span>
      <span
        className={`self-center text-xs ${product.stock === 0 ? "text-error" : product.stock <= product.lowStockThreshold ? "text-warning" : "text-success"}`}
      >
        {product.stock === 0 ? "Agotado" : `${product.stock} disponibles`}
      </span>
    </Link>
  );
}

function csvDataUri(rows: (string | number)[][]) {
  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  return `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(csv)}`;
}
