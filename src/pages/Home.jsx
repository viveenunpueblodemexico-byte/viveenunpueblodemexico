import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosDestacados } from "../services/pueblos";
import PuebloCard from "../components/PuebloCard";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../utils/seo";

export default function Home() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // SEO + OG
    setPageSEO({
      title: "Vive en un Pueblo de México | Descubre comunidades para vivir y trabajar",
      description:
        "Explora pueblos de México para vivir, trabajar remoto o emprender. Calidad de vida, comunidad y oportunidades locales.",
      url: buildAbsoluteUrl("/"),
      type: "website",
    });

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPueblosDestacados({ max: 6 });
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pueblos destacados.");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      clearManagedSEO();
    };
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 980, margin: "0 auto" }}>
      <header style={{ marginBottom: 14 }}>
        <h1 style={{ marginBottom: 8 }}>
          Vive en un pueblo de México
        </h1>

        <p style={{ opacity: 0.85, marginTop: 0, lineHeight: 1.55 }}>
          Descubre comunidades con buena calidad de vida y oportunidades locales. Empieza por el catálogo
          y explora lo más destacado.
        </p>

        <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/pueblos" style={{ textDecoration: "underline" }}>
            Ver catálogo de pueblos →
          </Link>
        </div>
      </header>

      <section style={{ marginTop: 18 }}>
        <h2 style={{ marginTop: 0 }}>Destacados</h2>

        {loading && !error && <p>Cargando...</p>}
        {error && <p style={{ color: "crimson" }}>{error}</p>}

        {!loading && !error && pueblos.length === 0 && (
          <p>Aún no hay pueblos destacados.</p>
        )}

        <div
          style={{
            marginTop: 14,
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          }}
        >
          {pueblos.map((p) => (
            <Link
              key={p.id}
              to={`/pueblo/${p.slug || p.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
             <PuebloCard pueblo={p} />
           </Link>
         ))}
        </div>
      </section>
    </div>
  );
}
