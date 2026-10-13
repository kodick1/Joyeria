"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="max-w-md text-center">
        <p className="text-[10px] uppercase tracking-[.22em] text-gold">Un momento, por favor</p>
        <h1 className="mt-4 font-display text-4xl">No pudimos cargar esta página</h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Inténtalo de nuevo en unos instantes. Tus piezas favoritas te esperan.
        </p>
        <button
          onClick={reset}
          className="mt-7 bg-emerald px-6 py-3 text-xs uppercase tracking-widest text-white"
        >
          Reintentar
        </button>
      </section>
    </main>
  );
}
