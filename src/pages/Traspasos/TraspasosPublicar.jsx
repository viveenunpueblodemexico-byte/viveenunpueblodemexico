import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getPueblosPublicados } from "../../services/pueblos";
import { crearOfertaPueblo } from "../../services/ofertas";
import "../trabajo/TrabajoPublicar.css";

export default function TraspasosPublicar() {
  const showDevHints = import.meta.env.DEV;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectSlug = searchParams.get("puebloSlug") || "";
  const [pueblos, setPueblos] = useState([]);
  const [puebloId, setPuebloId] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPueblosPublicados({ max: 400 });
        setPueblos(data);
      } catch (e) {
        setError(e?.message || "No se pudieron cargar los pueblos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const preselectId = useMemo(() => {
    if (!preselectSlug || !pueblos.length) return "";
    const found = pueblos.find((p) => p.slug === preselectSlug);
    return found?.id || "";
  }, [preselectSlug, pueblos]);

  useEffect(() => {
    if (preselectId && !puebloId) setPuebloId(preselectId);
  }, [preselectId, puebloId]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setOk("");
    try {
      const pueblo = pueblos.find((p) => p.id === puebloId);
      if (!pueblo) throw new Error("Selecciona un pueblo.");
      await crearOfertaPueblo({
        puebloId,
        puebloNombre: pueblo.nombre,
        puebloSlug: pueblo.slug,
        estado: pueblo.estado,
        tipo: "traspasos",
        titulo,
        descripcion,
        contactoEmail,
      });
      setOk("¡Listo! Tu publicación quedó registrada para revisión.");
      setTitulo("");
      setDescripcion("");
      setContactoEmail("");
      setTimeout(() => navigate("/traspasos"), 800);
    } catch (e2) {
      setError(e2?.message || "No se pudo publicar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="publicar-wrap">
      <div className="publicar-head">
        <h1>Publicar traspaso</h1>
        <p>Se mostrará en el sitio una vez aprobada.</p>
      </div>

     <div className="publicar-actions">
        <Link className="btn" to="/traspasos">← Volver</Link>
      </div>

      {loading ? <p>Cargando…</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {ok ? <p style={{ color: "green" }}>{ok}</p> : null}

     <form className="publicar-form" onSubmit={onSubmit}>
        <label>Pueblo</label>
        <select value={puebloId} onChange={(e) => setPuebloId(e.target.value)} required>
          <option value="">Selecciona…</option>
          {pueblos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} — {p.estado}
            </option>
          ))}
        </select>
       <label>Título</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required minLength={3} />

        <label>Descripción</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required minLength={10} />

        <label>Contacto (email)</label>
        <input type="email" value={contactoEmail} onChange={(e) => setContactoEmail(e.target.value)} />

        <button className="btn btn--primary" disabled={saving}>
          {saving ? "Publicando…" : "Publicar"}
        </button>

        {showDevHints ? (
          <p style={{ opacity: 0.65, fontSize: 12 }}>
            DEV: status=pendiente, activo=false, tipo=traspasos
          </p>
        ) : null}
      </form>
    </div>
  );
}
