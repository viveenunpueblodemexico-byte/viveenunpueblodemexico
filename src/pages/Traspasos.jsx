import { Link } from "react-router-dom";
import { Cog } from "lucide-react";


export default function Traspasos() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 relative">
<div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center">
  <Link
    to="/pueblos"
    className="no-underline inline-flex items-center justify-center px-5 py-3 rounded-xl border border-gray-300 text-gray-900 hover:bg-gray-100 transition"
  >
    Explorar pueblos
  </Link>

  <Link
    to="/"
    className="no-underline inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gray-900 text-white hover:opacity-90 transition"
  >
    Volver al inicio
  </Link>
</div>
      {/* Contenedor hero de engranes + logo */}
      <div className="relative w-full max-w-3xl h-80 mb-10 flex items-center justify-center">


        {/* Engrán grande (izquierda media) */}
        <div
          className="absolute -left-4 top-1/2 -translate-y-1/2"
          style={{ zIndex: 1 }}
        >
          <Cog
              className="w-10 h-10 text-gray-500"
              style={{ animation: "spin 1.2s linear infinite" }}
              aria-hidden
            />
        </div>

        {/* Engrán mediano (derecha media) */}
        <div
          className="absolute -right-4 top-1/2 -translate-y-1/2"
          style={{ zIndex: 1 }}
        >
          <Cog
            className="w-24 h-24 animate-spin-reverse text-gray-500"
            aria-hidden
          />
        </div>

        {/* Engrán pequeño (abajo centro) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-6"
          style={{ zIndex: 1 }}
        >
          <Cog className="w-16 h-16 animate-spin-fast text-gray-500" aria-hidden />
        </div>
      </div>

      <h1 className="text-3xl font-semibold mb-2">Traspasos — Próximamente…</h1>
      <p className="text-gray-600 max-w-prose">
        Estamos preparando la sección de{" "}
        <span className="font-medium">Traspasos y Proyectos</span>. Muy pronto
        podrás descubrir negocios, espacios productivos y oportunidades para
        emprender en pueblo.
      </p>
    </div>
  );
}
