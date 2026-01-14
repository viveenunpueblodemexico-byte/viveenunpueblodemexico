import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPuebloBySlug, getOfertasByPuebloId } from "../services/pueblos";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../utils/seo";

export default function PuebloDetalle() {
  const { slug } = useParams();
  const [pueblo, setPueblo] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

    function toYoutubeEmbed(url) {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "").trim();
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      if (u.hostname.includes("youtube.com")) {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }
      return "";
    } catch {
      return "";
    }
  }

  const ytEmbed = useMemo(() => toYoutubeEmbed(pueblo?.videoUrl || ""), [pueblo?.videoUrl]);


  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getPuebloBySlug(slug);
        setPueblo(data);
        const ofs = data?.id ? await getOfertasByPuebloId(data.id, { max: 50 }) : [];
        setOfertas(ofs);


        // SEO + OG dinámico por pueblo
        if (data) {
          const ubicacion = [data.municipio, data.estado].filter(Boolean).join(", ");
          const title = `Vivir en ${data.nombre}${data.estado ? `, ${data.estado}` : ""} | Oportunidades y calidad de vida`;
          const description =
            data.descripcionCorta?.trim()
              ? data.descripcionCorta.trim()
              : `Descubre cómo es vivir en ${data.nombre}${ubicacion ? `, ${ubicacion}` : ""}. Trabajo, entorno, comunidad y oportunidades locales.`;

          setPageSEO({
            title,
            description,
            url: buildAbsoluteUrl(`/pueblo/${slug}`),
            image: data.imagenUrl || "",
            type: "article",
          });
        } else {
          // No encontrado / null
          setPageSEO({
            title: "Pueblo no encontrado | Vive en un Pueblo de México",
            description:
              "Este pueblo no está disponible. Explora el catálogo de pueblos para descubrir nuevas oportunidades.",
            url: buildAbsoluteUrl(`/pueblo/${slug}`),
            type: "website",
          });
        }

      } catch (err) {
        console.error(err);
        setError("No se pudo cargar este pueblo.");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      clearManagedSEO();
    };

    
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
    <div
      style={{
        padding: 24,
        fontFamily: "system-ui",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
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

      {pueblo.descripcionCorta ? (
        <p style={{ lineHeight: 1.6, marginTop: 10 }}>{pueblo.descripcionCorta}</p>
      ) : (
        <p style={{ lineHeight: 1.6, opacity: 0.85, marginTop: 10 }}>
          (Descripción pendiente)
        </p>
      )}

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
          {ytEmbed ? (
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <iframe
                title={`Video de ${pueblo.nombre}`}
                width="100%"
                height="420"
                src={ytEmbed}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <a
              href={pueblo.videoUrl}
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Ver video del pueblo →
            </a>
          )}
        </div>
      ) : null}

            {/* OPORTUNIDADES */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Oportunidades</h2>

        {ofertas.length === 0 ? (
          <p style={{ opacity: 0.8, marginTop: 8 }}>
            (Aún no hay ofertas activas para este pueblo)
          </p>
        ) : (
          <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
            {ofertas.map((o) => (
              <div
                key={o.id}
                style={{
                  padding: 14,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{o.titulo}</div>

                {o.descripcion ? (
                  <div style={{ opacity: 0.9, lineHeight: 1.45 }}>{o.descripcion}</div>
                ) : null}

                {o.contactoEmail ? (
                  <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
                    Contacto:{" "}
                    <a
                      href={`mailto:${o.contactoEmail}`}
                      style={{ textDecoration: "underline" }}
                    >
                      {o.contactoEmail}
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIDA EN EL PUEBLO */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Vida en el pueblo</h2>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          (Próximamente: clima, movilidad, ritmo de vida, costos estimados, recomendaciones locales)
        </p>
      </div>

      {/* SERVICIOS */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Servicios</h2>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          (Próximamente: internet, salud, educación, comercios, transporte y servicios públicos)
        </p>
      </div>

      {/* COMUNIDAD / FORO */}
      <div
        style={{
          marginTop: 28,
          paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 18 }}>Comunidad</h2>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          (Próximamente: preguntas, experiencias y recomendaciones por pueblo)
        </p>
      </div>

    </div>
  );
}


