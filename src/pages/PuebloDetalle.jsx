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
  <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 900, margin: "0 auto" }}>
    <Link to="/pueblos" style={{ opacity: 0.85 }}>
      ← Volver al catálogo
    </Link>

    <h1 style={{ marginTop: 12, marginBottom: 6 }}>
      {pueblo.nombre} {pueblo.destacado ? "⭐" : ""}
    </h1>

    <p style={{ opacity: 0.85, marginTop: 0 }}>
      {[pueblo.municipio, pueblo.estado].filter(Boolean).join(", ")}
    </p>

    {/* HERO IMAGE */}
    {pueblo.imagenUrl ? (
      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <img
          src={pueblo.imagenUrl}
          alt={pueblo.nombre}
          style={{
            width: "100%",
            maxHeight: 420,
            objectFit: "cover",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          loading="lazy"
        />
      </div>
    ) : null}

    {pueblo.descripcionCorta && <p style={{ lineHeight: 1.5 }}>{pueblo.descripcionCorta}</p>}

    {pueblo.tags?.length > 0 && (
      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {pueblo.tags.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 12,
              opacity: 0.9,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    )}

    {/* VIDEO */}
    {pueblo.videoUrl ? (
      <div style={{ marginTop: 18 }}>
        <a
          href={pueblo.videoUrl}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: "underline" }}
        >
          Ver video del pueblo →
        </a>
      </div>
    ) : null}

    {/* Secciones placeholder (para lo que sigue) */}
    <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Oportunidades</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        (Próximamente: ofertas laborales asociadas a este pueblo)
      </p>
    </div>

    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <h2 style={{ margin: 0, fontSize: 18 }}>Galería</h2>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        (Próximamente: imágenes asociadas a este pueblo)
      </p>
    </div>
  </div>
);

}
