import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPuebloBySlug } from "../../services/pueblos";
import { getOfertasActivasByPuebloId } from "../../services/ofertas";

export default function PuebloDetailPage() {
  const { slug } = useParams();
  const [pueblo, setPueblo] = useState(null);
  const [ofTrabajo, setOfTrabajo] = useState([]);
  const [ofVivienda, setOfVivienda] = useState([]);
  const [ofTraspasos, setOfTraspasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getPuebloBySlug(slug);
        setPueblo(data);

       // Cargar ofertas públicas por tipo
        if (data?.id) {
          const [t, v, tr] = await Promise.all([
           getOfertasActivasByPuebloId(data.id, { tipo: "trabajo", max: 50 }),
            getOfertasActivasByPuebloId(data.id, { tipo: "vivienda", max: 50 }),
           getOfertasActivasByPuebloId(data.id, { tipo: "traspasos", max: 50 }),
          ]);
          setOfTrabajo(t);
          setOfVivienda(v);
         setOfTraspasos(tr);
        }



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

      <hr style={{ margin: "18px 0", opacity: 0.25 }} />

      <h2>Trabajo</h2>
      <Link to={`/trabajo/publicar?puebloSlug=${encodeURIComponent(pueblo.slug)}`}>Publicar trabajo</Link>
      {ofTrabajo.length === 0 ? <p style={{ opacity: 0.75 }}>Sin publicaciones.</p> : null}
      {ofTrabajo.map((it) => (
        <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 12, marginTop: 10 }}>
          <strong>{it.titulo}</strong>
          <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>{it.descripcion}</div>
          {it.contactoEmail ? <div style={{ marginTop: 6 }}>Contacto: <b>{it.contactoEmail}</b></div> : null}
        </div>
      ))}

      <h2 style={{ marginTop: 22 }}>Vivienda</h2>
     <Link to={`/vivienda/publicar?puebloSlug=${encodeURIComponent(pueblo.slug)}`}>Publicar vivienda</Link>
      {ofVivienda.length === 0 ? <p style={{ opacity: 0.75 }}>Sin publicaciones.</p> : null}
      {ofVivienda.map((it) => (
        <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 12, marginTop: 10 }}>
          <strong>{it.titulo}</strong>
          <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>{it.descripcion}</div>
          {it.contactoEmail ? <div style={{ marginTop: 6 }}>Contacto: <b>{it.contactoEmail}</b></div> : null}
        </div>
      ))}

      <h2 style={{ marginTop: 22 }}>Traspasos</h2>
      <Link to={`/traspasos/publicar?puebloSlug=${encodeURIComponent(pueblo.slug)}`}>Publicar traspaso</Link>
      {ofTraspasos.length === 0 ? <p style={{ opacity: 0.75 }}>Sin publicaciones.</p> : null}
      {ofTraspasos.map((it) => (
        <div key={it.id} style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 12, padding: 12, marginTop: 10 }}>
          <strong>{it.titulo}</strong>
          <div style={{ opacity: 0.8, fontSize: 13, marginTop: 4 }}>{it.descripcion}</div>
          {it.contactoEmail ? <div style={{ marginTop: 6 }}>Contacto: <b>{it.contactoEmail}</b></div> : null}
        </div>
      ))}
    </div>
  );
}
