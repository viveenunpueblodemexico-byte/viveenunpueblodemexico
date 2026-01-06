import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosPublicados } from "../services/pueblos";
import PuebloCard from "../components/PuebloCard";

export default function PueblosPage() {
  const [pueblos, setPueblos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getPueblosPublicados({ max: 100 });
        setPueblos(data);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los pueblos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Pueblos</h1>
        <Link to="/" style={{ opacity: 0.8 }}>Volver</Link>
      </div>

      {loading && <p>Cargando…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

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
