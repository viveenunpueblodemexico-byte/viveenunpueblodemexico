import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "./traspasosPublicar.css";

import { getPueblosPublicados } from "../../services/pueblos";
import { crearOfertaPueblo } from "../../services/ofertas";
import {
  getCooldownRemaining,
  isLikelyBot,
  sanitizeText,
  setLastSubmitNow,
  validateOffer,
} from "../../utils/antiSpam";

export default function TraspasosPublicar() {
  const showDevHints = import.meta.env.DEV;

  const { user, loginWithGoogle } = useAuth();
  const isLogged = Boolean(user);

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
      if (!user) throw new Error("Debes iniciar sesión con Google para publicar.");
      
      const pueblo = pueblos.find((p) => p.id === puebloId);
      if (!pueblo) throw new Error("Selecciona un pueblo.");

      if (isLikelyBot(website)) throw new Error("No se pudo publicar. Intenta de nuevo más tarde.");

      const cdKey = "vupm:last_submit_traspasos";
      const remaining = getCooldownRemaining(cdKey);
      if (remaining > 0) {
        const secs = Math.ceil(remaining / 1000);
        throw new Error(`Espera ${secs}s antes de publicar otra oferta.`);
      }

      const v = validateOffer({ titulo, descripcion, contactoEmail });
      if (v) throw new Error(v);

      if (!pueblo) throw new Error("Selecciona un pueblo antes de publicar.");

      await crearOfertaPueblo({
        puebloId,
        puebloNombre: pueblo.nombre,
        puebloSlug: pueblo.slug,
        estado: pueblo.estado,
        tipo: "traspasos",
        titulo: sanitizeText(titulo),
        descripcion: (descripcion || "").trim(),
        contactoEmail: sanitizeText(contactoEmail),
        userId: user.uid,
        userEmail: user.email || "",
      });
      setLastSubmitNow(cdKey);

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
  {!isLogged ? (

    <div className="traspasosPublicar__loginCard">
      <p className="traspasosPublicar__loginTitle">
        <b>Inicia sesión</b> para publicar.
      </p>
      <p className="traspasosPublicar__loginSub">
        Solo usamos Google (no guardamos contraseñas). Tus publicaciones quedan pendientes de aprobación.
      </p>
      <button className="btn btn--primary" type="button" onClick={loginWithGoogle}>
        Iniciar con Google
      </button>
    </div>
  ) : null}

      <form onSubmit={onSubmit} className="traspasosPublicar__grid">
        <div className="field full" style={{ display: "none" }} aria-hidden="true">
          <label>Website</label>
          <input
            className="control"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
            disabled={!isLogged || saving}
          />
        </div>

        <div className="field full">
          <label>Pueblo</label>
          <select
            className="control"
            value={puebloId}
            onChange={(e) => setPuebloId(e.target.value)}
            required
            disabled={!isLogged || loading || saving}
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
            disabled={!isLogged || saving}
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
            disabled={!isLogged || saving}
          />
        </div>

        <div className="field full">
          <label>Contacto (email)</label>
          <input
            className="control"
            type="email"
            value={contactoEmail}
            onChange={(e) => setContactoEmail(e.target.value)}
            disabled={!isLogged || saving}
          />
        </div>

        <div className="traspasosPublicar__actions full">
          <button className="btn btn--primary" type="submit" disabled={!isLogged || saving || loading}>
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
