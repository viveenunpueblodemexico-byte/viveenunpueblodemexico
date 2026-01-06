import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosDestacados } from "../services/pueblos";
import PuebloCard from "../components/PuebloCard";

export default function Home() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 8 }}>Vive en un Pueblo de México</h1>
      <p style={{ opacity: 0.85, marginTop: 0 }}>
        Explora pueblos y descubre oportunidades.
      </p>

      <div style={{ marginTop: 14 }}>
        <Link to="/pueblos">Ver catálogo de pueblos →</Link>
      </div>

      <h2 style={{ marginTop: 26 }}>Destacados</h2>

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
            to={`/pueblo/${p.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <PuebloCard pueblo={p} />
          </Link>
        ))}
      </div>
    </div>
  );
}
