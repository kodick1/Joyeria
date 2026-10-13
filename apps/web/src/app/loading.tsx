export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Cargando contenido"
      className="mx-auto min-h-screen max-w-[1440px] animate-pulse px-6 py-12 md:px-14"
    >
      <div className="h-6 w-36 rounded bg-[#e8e2d6]" />
      <div className="mt-8 h-12 w-80 max-w-full rounded bg-[#e8e2d6]" />
      <div className="mt-4 h-4 w-64 rounded bg-[#e8e2d6]" />
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item}>
            <div className="aspect-[4/5] rounded bg-[#e8e2d6]" />
            <div className="mt-4 h-5 w-3/4 rounded bg-[#e8e2d6]" />
            <div className="mt-2 h-4 w-1/2 rounded bg-[#e8e2d6]" />
          </div>
        ))}
      </div>
    </main>
  );
}
