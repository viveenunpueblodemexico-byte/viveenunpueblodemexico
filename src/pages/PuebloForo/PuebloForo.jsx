import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ThreadList from "../../components/foro/ThreadList";
import "./foroPages.css";
// 🔁 Ajusta estos imports según tu proyecto:
// Opción A (común): src/firebase.js exporta db y auth
import { db, auth } from "../../firebase";

// Opción B (si tienes auth en provider): usa tu hook (si existe)
// import { useAuth } from "../../auth/AuthProvider";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Si ya tienes este service como en PuebloDetalle:
import { getPuebloBySlug } from "../../services/pueblos";

const CATEGORIES = [
  "general",
  "vivienda",
  "trabajo",
  "conectividad",
  "seguridad",
  "costos",
  "tramites",
];

export default function PuebloForo() {

  const { slug } = useParams();
  const navigate = useNavigate();

  const [pueblo, setPueblo] = useState(null);
  const [loadingPueblo, setLoadingPueblo] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Usuario (elige una)
  const user = auth?.currentUser || null;


  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingPueblo(true);
        const data = await getPuebloBySlug(slug); // en tu app esto ya existe
        if (!alive) return;
        setPueblo(data || null);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setPueblo(null);
      } finally {
        if (alive) setLoadingPueblo(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  async function handleCreateThread(e) {
    e.preventDefault();
    setErr("");

    if (!user) {
      setErr("Inicia sesión para hacer una pregunta.");
      return;
    }
    if (!pueblo?.id) {
      setErr("No se pudo identificar el pueblo.");
      return;
    }

    const t = title.trim();
    const b = body.trim();

    if (t.length < 5) return setErr("El título debe tener al menos 5 caracteres.");
    if (b.length < 10) return setErr("El contenido debe tener al menos 10 caracteres.");

    setSaving(true);
    try {
      const ref = collection(db, "pueblos", pueblo.id, "threads");
      const docRef = await addDoc(ref, {
        puebloId: pueblo.id,
        puebloSlug: slug,
        title: t,
        body: b,
        category,
        status: "visible",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email || "",
        userName: user.displayName || "",
        });


      // reset
      setTitle("");
      setBody("");
      setCategory("general");
      setShowForm(false);

      toast.success("Pregunta publicada");

      // ✅ Redirigir al hilo recién creado
        navigate(`/pueblo/${slug}/foro/${docRef.id}`);


    } catch (e) {
      console.error(e);
      setErr("No se pudo publicar la pregunta. Revisa permisos/reglas.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingPueblo) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Foro</h2>
        <div className="muted" style={{ marginTop: 8 }}>
          Cargando…
        </div>
      </div>
    );
  }

  if (!pueblo) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Foro</h2>
        <div className="muted" style={{ marginTop: 8 }}>
          No se encontró el pueblo.
        </div>
        <div style={{ marginTop: 12 }}>
          <Link to="/pueblos" className="btn btn--ghost">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
  <div className="foroPage">
    <div className="foroHeader">
      <div>
        <h2 style={{ margin: 0 }}>Foro — {pueblo.nombre || slug}</h2>
        <div className="muted" style={{ marginTop: 6 }}>
          Preguntas, experiencias y recomendaciones.
        </div>
      </div>

      <div className="foroHeaderActions">
        <Link to={`/pueblo/${slug}`} className="btn btn--ghost">
          ← Volver al pueblo
        </Link>

        <button className="btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cerrar" : "Hacer pregunta"}
        </button>
      </div>
    </div>

    {showForm ? (
      <form onSubmit={handleCreateThread} className="foroCard" style={{ marginTop: 16 }}>
        {!user ? (
          <div style={{ marginBottom: 10 }}>
            <div className="muted">Necesitas iniciar sesión para publicar.</div>
            <div style={{ marginTop: 8 }}>
              <Link to="/login" className="btn">
                Ir a login
              </Link>
            </div>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <label style={{ fontSize: 13, opacity: 0.85 }}>Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. ¿Cómo está el internet en la zona?"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
              maxLength={140}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, opacity: 0.85 }}>Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, opacity: 0.85 }}>Contenido</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe tu duda o comparte tu experiencia…"
              rows={5}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
              maxLength={6000}
            />
          </div>

          {err ? <div style={{ color: "#b42318", fontSize: 13 }}>{err}</div> : null}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="btn btn--ghost" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
            <button className="btn" disabled={saving || !user}>
              {saving ? "Publicando…" : "Publicar"}
            </button>
          </div>
        </div>
      </form>
    ) : null}

    <div style={{ marginTop: 18 }}>
      <ThreadList puebloId={pueblo.id} puebloSlug={slug} mode="full" />
    </div>
  </div>
);
}