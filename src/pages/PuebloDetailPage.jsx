import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPuebloBySlug } from "../services/pueblos";

export default function PuebloDetailPage() {
  const { slug } = useParams();
  const [pueblo, setPueblo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getPuebloBySlug(slug);
        setPueblo(data);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar este pueblo.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;
  if (error) return <div style={{ padding: 24, color: "crimson" }}>{error}</div>;
  if (!pueblo) return <div style={{ padding: 24 }}>No encontrado.</div>;

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <Link to="/pueblos" style={{ opacity: 0.85 }}>← Volver al catálogo</Link>

      <h1 style={{ marginTop: 12 }}>
        {pueblo.nombre} {pueblo.destacado ? "⭐" : ""}
      </h1>

      <p style={{ opacity: 0.85, marginTop: -6 }}>{pueblo.estado}</p>

      {pueblo.descripcionCorta && <p>{pueblo.descripcionCorta}</p>}

      {pueblo.tags?.length > 0 && (
        <p style={{ opacity: 0.8, fontSize: 13 }}>
          {pueblo.tags.join(" · ")}
        </p>
      )}

      {/* En el siguiente paso metemos imagenUrl y videoUrl */}
    </div>
  );
}
