import { useState, useEffect } from "react";

export const MainPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="bg-white text-black selection:bg-black selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <span className="inline-grid h-8 w-8 place-content-center rounded-xl bg-black text-white font-bold">
                V
              </span>
              <span className="font-semibold tracking-tight">Vivanda Premium</span>
            </a>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <a href="#" className="hover:underline underline-offset-4">Frutas</a>
              <a href="#" className="hover:underline underline-offset-4">Verduras</a>
              <a href="#" className="hover:underline underline-offset-4">Carnes</a>
              <a href="#" className="hover:underline underline-offset-4">Gourmet</a>
              <a href="#" className="hover:underline underline-offset-4">Ofertas</a>
            </nav>
            <div className="flex items-center gap-2">
              <button className="relative inline-flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-2 text-sm hover:bg-black hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 6h15l-1.5 9h-12z" />
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="18" cy="21" r="1" />
                </svg>
                <span>Carrito</span>
                <span className="absolute -right-2 -top-2 grid h-5 w-5 place-content-center rounded-full bg-black text-xs text-white">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-white to-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Supermercado{" "}
                <span className="underline decoration-black decoration-8 underline-offset-8">
                  Premium
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-zinc-600">
                Compra online productos frescos, gourmet y exclusivos con
                promociones inteligentes basadas en tus gustos.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#productos"
                  className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white shadow-sm hover:shadow"
                >
                  Ver productos
                </a>
                <a
                  href="#"
                  className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-100"
                >
                  Promociones IA
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-zinc-200 bg-[linear-gradient(135deg,#000_0%,#000_33%,#fff_33%,#fff_66%,#000_66%,#000_100%)] bg-[length:20px_20px]"></div>
          </div>
        </div>
      </section>

      {/* Productos */}
      <main
        id="productos"
        className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold mb-6">Productos destacados</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Producto */}
          <article className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white hover:shadow-lg">
            <div className="relative aspect-square overflow-hidden bg-zinc-100"></div>
            <div className="p-4">
              <h3 className="text-sm font-medium">Uvas Orgánicas</h3>
              <p className="mt-1 text-sm text-zinc-600">Frescas y seleccionadas.</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-base font-semibold">S/ 12.50</div>
                <span className="text-xs text-zinc-500">En stock</span>
              </div>
              <button className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">
                Añadir al carrito
              </button>
            </div>
          </article>
          {/* Aquí puedes mapear más productos dinámicamente */}
        </div>
      </main>

      {/* Chatbot */}
      <section className="fixed bottom-6 right-6">
        <button className="rounded-full bg-black text-white p-4 shadow-lg hover:opacity-80">
          🤖
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 text-center text-sm text-zinc-600">
          © {year} Vivanda Premium – Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
