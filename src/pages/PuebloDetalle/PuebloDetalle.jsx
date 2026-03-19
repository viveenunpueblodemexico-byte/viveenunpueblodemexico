import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ThreadList from "../../components/foro/ThreadList"; 
import { getPuebloBySlug } from "../../services/pueblos";
import { getOfertasActivasByPuebloId } from "../../services/ofertas";import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import { timeAgo } from "../../utils/date";
import "./PuebloDetalle.css";


export default function PuebloDetalle() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const backParam = searchParams.get("back"); // ej: "/estado/san-luis-potosi"
  const backHref = backParam ? decodeURIComponent(backParam) : "/pueblos";

  const isFromEstado = backHref.startsWith("/estado/");
  const backLabel = isFromEstado ? "← Volver al estado" : "← Volver al catálogo";

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
      // ⚠️ Importante: NO romper la página si las ofertas fallan por permisos.
        if (data?.id) {
          try {
            const ofs = await getOfertasActivasByPuebloId(data.id, { max: 50 });
            setOfertas(ofs);
          } catch (errOfs) {
            console.error(errOfs);
            setOfertas([]);
          }
        } else {
          setOfertas([]);
        }


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
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <Link to={backHref} style={{ opacity: 0.9 }}>
        {backLabel}
      </Link>

      <Link to="/pueblos" style={{ opacity: 0.7, fontSize: 13 }}>
        Ver todos los pueblos
      </Link>
    </div>


    <div className="puebloHeroCard">
  <h1 className="puebloHeroCard__title">
    {pueblo.nombre} {pueblo.destacado ? "⭐" : ""}
  </h1>

  <p className="puebloHeroCard__subtitle">
    {[pueblo.municipio, pueblo.estado].filter(Boolean).join(", ")}
  </p>

  {/* HERO IMAGE */}
  {pueblo.imagenUrl ? (
    <div className="puebloHeroCard__imageWrap">
      <img
        src={pueblo.imagenUrl}
        alt={pueblo.nombre}
        className="puebloHeroCard__image"
        loading="lazy"
      />
    </div>
  ) : null}

  {pueblo.descripcionCorta ? (
    <p className="puebloHeroCard__description">{pueblo.descripcionCorta}</p>
  ) : (
    <p className="puebloHeroCard__description puebloHeroCard__description--muted">
      (Descripción pendiente)
    </p>
  )}

  {pueblo.tags?.length > 0 && (
    <div className="puebloHeroCard__tags">
      {pueblo.tags.map((t) => (
        <span key={t} className="puebloHeroCard__tag">
          {t}
        </span>
      ))}
    </div>
  )}
</div>

      {/* ACCESOS RÁPIDOS */}
<div
  style={{
    marginTop: 22,
    paddingTop: 16,
    borderTop: "1px solid rgba(255,255,255,0.08)",
  }}
>
  <h2 style={{ margin: 0, fontSize: 18 }}>Explorar en este pueblo</h2>

  <div className="puebloExploreGrid">
    <Link
      to={`/trabajo?pueblo=${encodeURIComponent(pueblo.slug)}&puebloNombre=${encodeURIComponent(pueblo.nombre)}`}
      className="puebloExploreCard"
    >
      <div className="puebloExploreCard__iconWrap" aria-hidden="true">
        <div className="puebloExploreCard__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M8 7V5.8C8 4.806 8.806 4 9.8 4h4.4C15.194 4 16 4.806 16 5.8V7" />
            <path d="M4.5 8.5h15c.828 0 1.5.672 1.5 1.5v7c0 1.105-.895 2-2 2H5c-1.105 0-2-.895-2-2v-7c0-.828.672-1.5 1.5-1.5Z" />
            <path d="M3 12.5c2.4 1.3 5.7 2 9 2s6.6-.7 9-2" />
          </svg>
        </div>
      </div>

      <div className="puebloExploreCard__title">Trabajo</div>
      <div className="puebloExploreCard__text">
        Encuentra oportunidades laborales en este pueblo
      </div>
      <div className="puebloExploreCard__cta">Ver bolsa →</div>
    </Link>

    <Link
      to={`/vivienda?pueblo=${encodeURIComponent(pueblo.slug)}&puebloNombre=${encodeURIComponent(pueblo.nombre)}`}
      className="puebloExploreCard"
    >
      <div className="puebloExploreCard__iconWrap" aria-hidden="true">
        <div className="puebloExploreCard__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 10.5 12 4l8 6.5" />
            <path d="M6.5 9.5V19a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9.5" />
            <path d="M10 20v-4.2c0-.442.358-.8.8-.8h2.4c.442 0 .8.358.8.8V20" />
          </svg>
        </div>
      </div>

      <div className="puebloExploreCard__title">Vivienda</div>
      <div className="puebloExploreCard__text">
        Encuentra rentas, casas y terrenos disponibles
      </div>
      <div className="puebloExploreCard__cta">Ver bolsa →</div>
    </Link>

    <Link
      to={`/traspasos?pueblo=${encodeURIComponent(pueblo.slug)}&puebloNombre=${encodeURIComponent(pueblo.nombre)}`}
      className="puebloExploreCard"
    >
      <div className="puebloExploreCard__iconWrap" aria-hidden="true">
        <div className="puebloExploreCard__icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 9h16" />
            <path d="M6 9V7.5C6 6.672 6.672 6 7.5 6h9c.828 0 1.5.672 1.5 1.5V9" />
            <path d="M5.5 9h13A1.5 1.5 0 0 1 20 10.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.5A1.5 1.5 0 0 1 5.5 9Z" />
            <path d="M9 13h6" />
          </svg>
        </div>
      </div>

      <div className="puebloExploreCard__title">Traspasos</div>
      <div className="puebloExploreCard__text">
        Encuentra negocios y oportunidades para emprender
      </div>
      <div className="puebloExploreCard__cta">Ver bolsa →</div>
    </Link>
  </div>
</div>


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

                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
                  {o.createdAt ? timeAgo(o.createdAt) : ""}
                </div>


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

      {/* COMUNIDAD / FORO */}
      {/* Se ocultaron temporalmente "Vida en el pueblo" y "Servicios" hasta definir fuente de datos */}

      {/* COMUNIDAD / FORO */}
        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Comunidad</h2>
          <Link to={`/pueblo/${slug}/foro`} style={{ fontSize: 13, opacity: 0.85, textDecoration: "underline" }}>
            Ver todo →
          </Link>
        </div>

          <div style={{ marginTop: 10 }}>
            {pueblo?.id ? (
              <ThreadList puebloId={pueblo.id} puebloSlug={slug} mode="preview" limitCount={5} />
            ) : (
              <div className="muted">Cargando comunidad…</div>
            )}
          </div>
        </div>

    </div>
  );
}


