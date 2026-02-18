import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getPueblosPublicados } from "../../services/pueblos";
import { crearOfertaPueblo } from "../../services/ofertas";
import "./TrabajoPublicar.css";
import {
  getCooldownRemaining,
  isLikelyBot,
  sanitizeText,
  setLastSubmitNow,
  validateOffer,
} from "../../utils/antiSpam";

export default function TrabajoPublicar() {
  const showDevHints = import.meta.env.DEV; // o VITE_SHOW_DEV_HINTS === 'true'

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectSlug = searchParams.get("puebloSlug") || ""; // opcional
  const [pueblos, setPueblos] = useState([]);
  const [puebloId, setPuebloId] = useState("");

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPueblosPublicados({ max: 200 });
        setPueblos(data);

        if (preselectSlug) {
          const found = data.find((p) => p.slug === preselectSlug);
          if (found) setPuebloId(found.id);
        }
      } catch (e) {
        setError(e?.message || "No se pudieron cargar los pueblos.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [preselectSlug]);

  const pueblo = useMemo(
    () => pueblos.find((p) => p.id === puebloId) || null,
    [pueblos, puebloId]
  );

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      // Anti-spam: honeypot
      if (isLikelyBot(website)) {
        throw new Error("No se pudo publicar. Intenta de nuevo más tarde.");
      }

      // Anti-spam: cooldown (60s)
      const cdKey = "vupm:last_submit_trabajo";
      const remaining = getCooldownRemaining(cdKey);
      if (remaining > 0) {
        const secs = Math.ceil(remaining / 1000);
        throw new Error(`Espera ${secs}s antes de publicar otra oferta.`);
      }

      // Validación y sanitizado
      const v = validateOffer({ titulo, descripcion, contactoEmail });
      if (v) throw new Error(v);

      setSaving(true);

      await crearOfertaPueblo({
        puebloId: pueblo.id,
        puebloNombre: pueblo.nombre,
        puebloSlug: pueblo.slug,
        estado: pueblo.estado,
        tipo: "trabajo",
        titulo: sanitizeText(titulo),
        descripcion: (descripcion || "").trim(),
        contactoEmail: sanitizeText(contactoEmail),
      });

      setLastSubmitNow(cdKey);
      setOk("¡Listo! Tu oferta quedó registrada (pendiente/inaactiva por defecto).");
      // opcional: llevar al detalle del pueblo
      setTimeout(() => {
        navigate(`/pueblo/${pueblo.slug}?back=${encodeURIComponent("/trabajo")}`);
      }, 600);
    } catch (e) {
      setError(e?.message || "No se pudo publicar la oferta.");
    } finally {
      setSaving(false);
    }
  }

  return (
  <div className="container publicar">
    <div className="publicar__header">
      <div>
        <h1 className="publicar__title">Publicar oferta de trabajo</h1>
        {showDevHints && (
        <p className="publicar__subtitle">
          Se mostrará en el sitio una vez aprobada.</p>
        )}
      </div>
      <Link className="publicar__back" to="/trabajo">Volver</Link>
    </div>

    <div className="publicar__card">
      <form onSubmit={onSubmit} className="publicar__grid">
        {/* Honeypot: si un bot lo llena, bloqueamos */}
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
          <select
            className="control"
            value={puebloId}
            onChange={(e) => setPuebloId(e.target.value)}
            disabled={loading || saving}
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
            placeholder="Ej. Se busca barista (medio tiempo)"
            disabled={saving}
          />
        </div>

        <div className="field full">
          <label>Descripción</label>
          <textarea
            className="control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Requisitos, horario, sueldo aproximado, etc."
            disabled={saving}
          />
        </div>

        <div className="field full">
          <label>Contacto (email)</label>
          <input
            className="control"
            value={contactoEmail}
            onChange={(e) => setContactoEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            disabled={saving}
          />
        </div>

        {error ? (
          <div className="alert alert--error full">{error}</div>
        ) : null}

        {ok ? (
          <div className="alert alert--ok full">{ok}</div>
        ) : null}

        <div className="publicar__actions full">
          <button className="btnPrimary" type="submit" disabled={saving || loading}>
            {saving ? "Publicando…" : "Publicar"}
          </button>
        </div>

{showDevHints && (
        <p className="publicar__note full">
          Nota: tu UI de detalle del pueblo solo muestra ofertas con <b>activo == true</b>.
          Las nuevas quedan <b>activo:false</b> y <b>status:'pendiente'</b>.
        </p>
        )}
      </form>
    </div>
  </div>
);

}
