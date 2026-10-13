import Link from "next/link";
import { ProductForm } from "@/features/products/product-form";

export default function NewProductPage() {
  return (
    <main className="min-h-screen bg-[#f5f2ec] px-5 py-8 md:px-12 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-xs uppercase tracking-widest text-muted">
          ← Volver al resumen
        </Link>
        <p className="mt-8 text-[10px] uppercase tracking-[.2em] text-gold">Catálogo Aurelia</p>
        <h1 className="mt-2 font-display text-5xl">Añadir una pieza</h1>
        <p className="mb-8 mt-2 text-sm text-muted">Cuéntanos los detalles que hacen especial esta joya.</p>
        <ProductForm />
      </div>
    </main>
  );
}
