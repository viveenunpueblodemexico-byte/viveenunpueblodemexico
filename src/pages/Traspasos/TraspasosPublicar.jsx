import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "./traspasosPublicar.css";

import { getPueblosPublicados } from "../../services/pueblos";
import { crearOfertaPueblo } from "../../services/ofertas";

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
      setError("");
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
    <Container>
      <section className="traspasosPublicar">
        <div className="traspasosPublicar__header">
          <div>
            <h1 className="traspasosPublicar__title">Publicar traspaso</h1>
            <p className="traspasosPublicar__subtitle">Se mostrará en el sitio una vez aprobada.</p>
          </div>
          <Link className="traspasosPublicar__back" to="/traspasos">← Volver</Link>
        </div>

        {loading ? <p>Cargando…</p> : null}
        {error ? <div className="traspasosAlert traspasosAlert--error">{error}</div> : null}
        {ok ? <div className="traspasosAlert traspasosAlert--ok">{ok}</div> : null}

        <div className="traspasosPublicar__card">
          <form onSubmit={onSubmit} className="traspasosPublicar__grid">
            <div className="field full">
              <label>Pueblo</label>
              <select
                className="control"
                value={puebloId}
                onChange={(e) => setPuebloId(e.target.value)}
                required
              >
                <option value="">Selecciona…</option>
                {pueblos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — {p.estado}
                  </option>
                ))}
              </select>
            </div>

            <div className="field full">
              <label>Título</label>
              <input
                className="control"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div className="field full">
              <label>Descripción</label>
              <textarea
                className="control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                minLength={10}
              />
            </div>

            <div className="field full">
              <label>Contacto (email)</label>
              <input
                className="control"
                type="email"
                value={contactoEmail}
                onChange={(e) => setContactoEmail(e.target.value)}
              />
            </div>

            <div className="traspasosPublicar__actions full">
              <button className="traspasosBtnPrimary" disabled={saving}>
                {saving ? "Publicando…" : "Publicar"}
              </button>
            </div>

            {showDevHints ? (
              <p className="traspasosPublicar__note full">
                DEV: status=pendiente, activo=false, tipo=traspasos
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </Container>
  );
}
