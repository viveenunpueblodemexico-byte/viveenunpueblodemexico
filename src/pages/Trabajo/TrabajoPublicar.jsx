import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
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
import { db } from "../../firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function TrabajoPublicar() {
  const showDevHints = import.meta.env.DEV; // o VITE_SHOW_DEV_HINTS === 'true'

 const { user, loginWithGoogle } = useAuth();
  const isLogged = Boolean(user);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectSlug = searchParams.get("puebloSlug") || ""; // opcional
  const edit = searchParams.get("edit") === "1";
  const editPuebloId = searchParams.get("puebloId") || "";
  const editOfertaId = searchParams.get("ofertaId") || "";
  const isEditMode = edit && Boolean(editPuebloId) && Boolean(editOfertaId);

  
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
  const [editLoaded, setEditLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPueblosPublicados({ max: 200 });
        setPueblos(data);

      // Si venimos en modo edición, fijar puebloId desde query param
        if (isEditMode) {
          setPuebloId(editPuebloId);
        } else if (preselectSlug) {
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
  }, [preselectSlug, isEditMode, editPuebloId]);

  const pueblo = useMemo(
    () => pueblos.find((p) => p.id === puebloId) || null,
    [pueblos, puebloId]
  );

  // Prefill en modo edición
  useEffect(() => {
    async function loadEdit() {
      if (!isEditMode) return;
      if (!user) return;
      if (!puebloId) return;
      if (editLoaded) return;

      setError("");
      try {
        const ref = doc(db, "pueblos", editPuebloId, "ofertas", editOfertaId);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("No se encontró la publicación a editar.");

        const data = snap.data() || {};
        if (data.tipo && data.tipo !== "trabajo") {
          throw new Error("Esta publicación no corresponde a 'trabajo'.");
        }

        setTitulo(data.titulo || "");
        setDescripcion(data.descripcion || "");
        setContactoEmail(data.contactoEmail || "");
        setOk("Editando tu oferta (puedes guardar cambios).");
        setEditLoaded(true);
      } catch (e) {
        setError(e?.message || "No se pudo cargar la publicación para editar.");
      }
    }
    loadEdit();
  }, [isEditMode, user, puebloId, editLoaded, editPuebloId, editOfertaId]);


  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk("");

    try {
      if (!user) throw new Error("Debes iniciar sesión con Google para publicar.");
      // Anti-spam: honeypot
      if (isLikelyBot(website)) {
        throw new Error("No se pudo publicar. Intenta de nuevo más tarde.");
      }

    // Anti-spam: cooldown (solo para CREAR, no para editar)
      const cdKey = "vupm:last_submit_trabajo";
      if (!isEditMode) {
        const remaining = getCooldownRemaining(cdKey);
        if (remaining > 0) {
          const secs = Math.ceil(remaining / 1000);
          throw new Error(`Espera ${secs}s antes de publicar otra oferta.`);
        }
      }

      // Validación y sanitizado
      const v = validateOffer({ titulo, descripcion, contactoEmail });
      if (v) throw new Error(v);

      if (!pueblo) throw new Error("Selecciona un pueblo antes de publicar.");

      setSaving(true);

      if (isEditMode) {
        const ref = doc(db, "pueblos", editPuebloId, "ofertas", editOfertaId);
        await updateDoc(ref, {
          titulo: sanitizeText(titulo),
          descripcion: (descripcion || "").trim(),
          contactoEmail: sanitizeText(contactoEmail),
          updatedAt: serverTimestamp(),
          isEdited: true,
          editedAt: serverTimestamp(),
        });
        setOk("✅ Cambios guardados.");
       setTimeout(() => navigate("/mis-publicaciones"), 600);
      } else {
        await crearOfertaPueblo({
          puebloId: pueblo.id,
          puebloNombre: pueblo.nombre,
          puebloSlug: pueblo.slug,
          estado: pueblo.estado,
          tipo: "trabajo",
          titulo: sanitizeText(titulo),
          descripcion: (descripcion || "").trim(),
          contactoEmail: sanitizeText(contactoEmail),
          userId: user.uid,
          userEmail: user.email || "",
        });
        setLastSubmitNow(cdKey);
        setOk("¡Listo! Tu oferta quedó registrada (pendiente/inactiva por defecto).");
        setTimeout(() => {
          navigate(`/pueblo/${pueblo.slug}?back=${encodeURIComponent("/trabajo")}`);
        }, 600);
      }
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
      {!isLogged ? (
        <div className="publicar__loginCard">
          <p className="publicar__loginTitle">
            <b>Inicia sesión</b> para publicar.
          </p>
          <p className="publicar__loginSub">
            Solo usamos Google (no guardamos contraseñas). Tus publicaciones quedan pendientes de aprobación.
          </p>

          <button
            className="btnPrimary"
            type="button"
            onClick={loginWithGoogle}
          >
            Iniciar con Google
          </button>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="publicar__grid">
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
      disabled={!isLogged || loading || saving || isEditMode}
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
      disabled={!isLogged || saving}
    />
  </div>

  <div className="field full">
    <label>Descripción</label>
    <textarea
      className="control"
      value={descripcion}
      onChange={(e) => setDescripcion(e.target.value)}
      placeholder="Requisitos, horario, sueldo aproximado, etc."
      disabled={!isLogged || saving}
    />
  </div>

  <div className="field full">
    <label>Contacto (email)</label>
    <input
      className="control"
      value={contactoEmail}
      onChange={(e) => setContactoEmail(e.target.value)}
      placeholder="correo@ejemplo.com"
      disabled={!isLogged || saving}
    />
  </div>

  <div className="publicar__actions full">
    <button className="btnPrimary" type="submit" disabled={!isLogged || saving || loading}>
      {saving ? "Publicando…" : "Publicar"}
    </button>
  </div>
</form>
    </div>
  </div>
);

}
