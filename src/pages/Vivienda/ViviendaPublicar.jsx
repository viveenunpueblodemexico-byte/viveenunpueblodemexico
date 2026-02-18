import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import { getPueblosPublicados } from "../../services/pueblos";
import { crearOfertaPueblo } from "../../services/ofertas";
import "./viviendaPublicar.css";
import {
  getCooldownRemaining,
  isLikelyBot,
  sanitizeText,
  setLastSubmitNow,
  validateOffer,
} from "../../utils/antiSpam";

export default function ViviendaPublicar() {
  const showDevHints = import.meta.env.DEV;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectSlug = searchParams.get("puebloSlug") || "";
  const [pueblos, setPueblos] = useState([]);
  const [puebloId, setPuebloId] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

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

      if (isLikelyBot(website)) throw new Error("No se pudo publicar. Intenta de nuevo más tarde.");

      const cdKey = "vupm:last_submit_vivienda";
      const remaining = getCooldownRemaining(cdKey);
      if (remaining > 0) {
        const secs = Math.ceil(remaining / 1000);
        throw new Error(`Espera ${secs}s antes de publicar otra oferta.`);
      }

      const v = validateOffer({ titulo, descripcion, contactoEmail });
      if (v) throw new Error(v);


      await crearOfertaPueblo({
        puebloId,
        puebloNombre: pueblo.nombre,
        puebloSlug: pueblo.slug,
        estado: pueblo.estado,
        tipo: "vivienda",
        titulo: sanitizeText(titulo),
        descripcion: (descripcion || "").trim(),
        contactoEmail: sanitizeText(contactoEmail),
      });
      setLastSubmitNow(cdKey);
      setOk("¡Listo! Tu publicación quedó registrada para revisión.");
      setTitulo("");
      setDescripcion("");
      setContactoEmail("");
      setTimeout(() => navigate("/vivienda"), 800);
    } catch (e2) {
      setError(e2?.message || "No se pudo publicar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container>
      <section className="viviendaPublicar">
        <div className="viviendaPublicar__header">
          <div>
            <h1 className="viviendaPublicar__title">Publicar vivienda</h1>
            <p className="viviendaPublicar__subtitle">Se mostrará en el sitio una vez aprobada.</p>
          </div>
          <Link className="viviendaPublicar__back" to="/vivienda">← Volver</Link>
        </div>

        {loading ? <p>Cargando…</p> : null}
        {error ? <div className="viviendaAlert viviendaAlert--error">{error}</div> : null}
        {ok ? <div className="viviendaAlert viviendaAlert--ok">{ok}</div> : null}

        <div className="viviendaPublicar__card">
          <form onSubmit={onSubmit} className="viviendaPublicar__grid">
            <div className="field full" style={{ display: "none" }} aria-hidden="true">
              <label>Website</label>
              <input
                className="control"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
              />
            </div>
            <div className="field full">
              <label>Pueblo</label>
              <select className="control" value={puebloId} onChange={(e) => setPuebloId(e.target.value)} required>
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
              <input className="control" value={titulo} onChange={(e) => setTitulo(e.target.value)} required minLength={3} />
            </div>

            <div className="field full">
              <label>Descripción</label>
              <textarea className="control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required minLength={10} />
            </div>

            <div className="field full">
              <label>Contacto (email)</label>
              <input className="control" type="email" value={contactoEmail} onChange={(e) => setContactoEmail(e.target.value)} />
            </div>

            <div className="viviendaPublicar__actions full">
              <button className="viviendaBtnPrimary" disabled={saving}>
                {saving ? "Publicando…" : "Publicar"}
              </button>
            </div>

            {showDevHints ? (
              <p className="viviendaPublicar__note full">
                DEV: status=pendiente, activo=false, tipo=vivienda
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </Container>
  );
}
