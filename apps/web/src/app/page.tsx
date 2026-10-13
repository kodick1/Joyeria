import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, BadgeCheck, PackageCheck, Sparkles } from "lucide-react";
import { getProducts } from "@/lib/products";
import { FeaturedProducts } from "@/components/featured-products";

export const dynamic = "force-dynamic";

const hero = "/seed/hero.svg";

export default async function HomePage() {
  const { items } = await getProducts("limit=4&order=featured");
  return (
    <main>
      <header className="absolute z-10 flex w-full items-center justify-between px-6 py-6 text-white md:px-14">
        <Link href="/" className="font-display text-3xl tracking-[.12em]">
          AURELIA
        </Link>
        <nav className="hidden gap-9 text-xs uppercase tracking-[.16em] md:flex">
          <Link href="/joyas">Colección</Link>
          <a href="#historia">Nuestra esencia</a>
          <Link href="/admin">Administración</Link>
        </nav>
        <Link href="/joyas" className="border border-white/60 px-4 py-2 text-xs uppercase tracking-widest">
          Descubrir
        </Link>
      </header>
      <section className="relative flex min-h-[680px] items-end overflow-hidden bg-[#34312b] px-6 pb-20 pt-32 text-white md:min-h-[780px] md:px-14 md:pb-28">
        <Image
          src={hero}
          alt="Detalle de joyas doradas en una composición cálida"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
        <div className="relative max-w-3xl">
          <p className="mb-5 text-[11px] uppercase tracking-[.28em] text-white/80">
            Joyería contemporánea · Bogotá
          </p>
          <h1 className="font-display text-6xl leading-[.95] md:text-8xl">
            Piezas para
            <br />
            atesorar siempre.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/80">
            Diseños que celebran lo extraordinario de cada día, creados para acompañarte hoy y siempre.
          </p>
          <Link
            href="/joyas"
            className="mt-9 inline-flex items-center gap-3 bg-gold px-6 py-4 text-xs uppercase tracking-[.14em] transition hover:bg-gold-hover"
          >
            Explorar colección <ArrowRight size={16} />
          </Link>
        </div>
        <a
          href="#coleccion"
          aria-label="Desplazarse a la colección"
          className="absolute bottom-8 right-8 hidden items-center gap-3 text-[10px] uppercase tracking-widest md:flex"
        >
          Descubrir <ArrowDown size={14} />
        </a>
      </section>
      <section id="coleccion" className="mx-auto max-w-[1440px] px-6 py-20 md:px-14 md:py-28">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[.22em] text-gold">Selección Aurelia</p>
            <h2 className="mt-3 font-display text-5xl">Favoritas de la casa</h2>
          </div>
          <Link href="/joyas" className="hidden items-center gap-2 text-xs uppercase tracking-widest md:flex">
            Ver colección <ArrowRight size={15} />
          </Link>
        </div>
        {items.length ? (
          <FeaturedProducts initialProducts={items} />
        ) : (
          <p className="rounded-luxury border border-border bg-white p-8 text-sm text-muted">
            Estamos preparando una colección especial. Vuelve pronto.
          </p>
        )}
      </section>
      <section id="historia" className="grid bg-[#f0ebe2] md:grid-cols-2">
        <div className="relative min-h-[420px]">
          <Image
            src="/seed/story.svg"
            alt="Composición artística dorada inspirada en una pieza Aurelia"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-8 py-16 md:px-20">
          <p className="text-[10px] uppercase tracking-[.22em] text-gold">La belleza de lo esencial</p>
          <h2 className="mt-4 max-w-lg font-display text-5xl leading-[1.04]">
            Un detalle sutil.
            <br />
            Un recuerdo para siempre.
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-muted">
            Cada pieza encuentra su propio equilibrio entre oficio, materiales seleccionados y una elegancia
            que se siente naturalmente tuya.
          </p>
          <Link
            href="/joyas"
            className="mt-8 inline-flex items-center gap-3 text-xs uppercase tracking-widest"
          >
            Conoce nuestra colección <ArrowRight size={15} />
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1440px] gap-9 px-6 py-16 md:grid-cols-3 md:px-14 md:py-20">
        {[
          { Icon: PackageCheck, title: "Envío asegurado", copy: "Tu pieza viaja protegida hasta tus manos." },
          {
            Icon: BadgeCheck,
            title: "Autenticidad certificada",
            copy: "Materiales seleccionados, siempre auténticos."
          },
          { Icon: Sparkles, title: "Garantía Aurelia", copy: "Cuidado y respaldo para cada creación." }
        ].map(({ Icon, title, copy }) => (
          <div key={title} className="flex items-start gap-4">
            <Icon className="mt-1 text-gold" size={20} strokeWidth={1.5} />
            <div>
              <h3 className="font-display text-2xl">{title}</h3>
              <p className="mt-1 text-sm text-muted">{copy}</p>
            </div>
          </div>
        ))}
      </section>
      <footer className="flex flex-col justify-between gap-4 bg-emerald px-6 py-8 text-white md:flex-row md:items-center md:px-14">
        <span className="font-display text-2xl tracking-[.12em]">AURELIA</span>
        <p className="text-xs text-white/70">Joyas para los momentos que importan · Bogotá, Colombia</p>
        <Link href="/admin" className="text-xs uppercase tracking-widest text-white/80">
          Panel administrativo
        </Link>
      </footer>
    </main>
  );
}
