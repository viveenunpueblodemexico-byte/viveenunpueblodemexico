import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosPublicados } from "../services/pueblos";
import PuebloCard from "../components/PuebloCard";

export default function Pueblos() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPueblos() {
      setLoading(true);
      setError("");

      try {
        const data = await getPueblosPublicados({ max: 100 });
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al leer Firestore");
      } finally {
        setLoading(false);
      }
    }

    loadPueblos();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <h1 style={{ margin: 0 }}>Pueblos</h1>
        <Link to="/" style={{ opacity: 0.85 }}>
          Volver
        </Link>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 12 }}>Error: {error}</div>
      )}

      {loading && !error && <p style={{ marginTop: 12 }}>Cargando...</p>}

      {!loading && !error && pueblos.length === 0 && (
        <p style={{ marginTop: 12 }}>Aún no hay pueblos publicados.</p>
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
