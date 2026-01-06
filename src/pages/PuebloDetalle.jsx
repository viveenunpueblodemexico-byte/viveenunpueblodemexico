import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPuebloBySlug } from "../services/pueblos";

export default function PuebloDetalle() {
  const { slug } = useParams();
  const [pueblo, setPueblo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getPuebloBySlug(slug);
        setPueblo(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar este pueblo.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [slug]);

  if (loading) return <div style={{ padding: 24 }}>Cargando...</div>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: "crimson" }}>{error}</p>
        <Link to="/pueblos">← Volver al catálogo</Link>
      </div>
    );
  }

  if (!pueblo) {
    return (
      <div style={{ padding: 24 }}>
        <p>No encontrado.</p>
        <Link to="/pueblos">← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <Link to="/pueblos" style={{ opacity: 0.85 }}>
        ← Volver al catálogo
      </Link>

      <h1 style={{ marginTop: 12 }}>
        {pueblo.nombre} {pueblo.destacado ? "⭐" : ""}
      </h1>

      <p style={{ opacity: 0.85, marginTop: -6 }}>{pueblo.estado}</p>

      {pueblo.descripcionCorta && <p>{pueblo.descripcionCorta}</p>}

      {pueblo.tags?.length > 0 && (
        <p style={{ opacity: 0.8, fontSize: 13 }}>{pueblo.tags.join(" · ")}</p>
      )}

      {/* Luego metemos imagenUrl y videoUrl */}
    </div>
  );
}
