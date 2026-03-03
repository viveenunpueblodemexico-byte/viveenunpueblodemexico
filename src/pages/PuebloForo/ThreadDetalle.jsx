import { useEffect, useMemo, useState } from "react";
import "./foroPages.css";
import { onAuthStateChanged } from "firebase/auth";
import { Link, useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getPuebloBySlug } from "../../services/pueblos";

const REPORT_REASONS = [
  { value: "spam", label: "Spam" },
  { value: "acoso", label: "Acoso" },
  { value: "datos_personales", label: "Datos personales" },
  { value: "ilegal", label: "Contenido ilegal" },
  { value: "otro", label: "Otro" },
];

export default function ThreadDetalle() {
  const { slug, threadId } = useParams();

  const [pueblo, setPueblo] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [busyId, setBusyId] = useState(null); // para deshabilitar botones por comentario

  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState("spam");
  const [details, setDetails] = useState("");
  const [reporting, setReporting] = useState(false);
  const [err, setErr] = useState("");

  const [user, setUser] = useState(null);

    useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
    }, []);

  // Cargar pueblo
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getPuebloBySlug(slug);
        if (!alive) return;
        setPueblo(data || null);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setPueblo(null);
      }
    })();
    return () => (alive = false);
  }, [slug]);

  // Suscribirse al thread + comments cuando ya sabemos pueblo.id
  useEffect(() => {
    if (!pueblo?.id || !threadId) return;

    setLoading(true);
    setErr("");

    const threadRef = doc(db, "pueblos", pueblo.id, "threads", threadId);
    const unsubThread = onSnapshot(
      threadRef,
      (snap) => {
        if (!snap.exists()) {
          setThread(null);
          setLoading(false);
          return;
        }
        setThread({ id: snap.id, ...snap.data() });
        setLoading(false);
      },
      (e) => {
        console.error(e);
        setErr("No se pudo cargar el hilo.");
        setLoading(false);
      }
    );

    const commentsRef = collection(db, "pueblos", pueblo.id, "threads", threadId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubComments = onSnapshot(
      q,
      (snap) => {
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (e) => console.error(e)
    );

    return () => {
      unsubThread();
      unsubComments();
    };
  }, [pueblo?.id, threadId]);

  async function handleSendComment(e) {
    e.preventDefault();
    setErr("");

    if (!user) return setErr("Inicia sesión para comentar.");
    if (!pueblo?.id) return setErr("No se pudo identificar el pueblo.");
    if (!threadId) return setErr("Falta threadId.");

    const msg = text.trim();
    if (msg.length < 2) return;

    setSending(true);
    try {
      const ref = collection(db, "pueblos", pueblo.id, "threads", threadId, "comments");
      await addDoc(ref, {
        puebloId: pueblo.id,
        threadId,
        text: msg,
        userId: user.uid,
        userName: user.displayName || "",
        createdAt: serverTimestamp(),
        isEdited: false,
        // no pongas editedAt al crear
      });
      setText("");
    } catch (e) {
      console.error(e);
      setErr("No se pudo enviar el comentario.");
    } finally {
      setSending(false);
    }
  }

  async function handleReportThread() {
    setErr("");
    if (!user) return setErr("Inicia sesión para reportar.");
    if (!pueblo?.id) return setErr("No se pudo identificar el pueblo.");

    setReporting(true);
    try {
      const ref = collection(db, "pueblos", pueblo.id, "threads", threadId, "reports");
      await addDoc(ref, {
        puebloId: pueblo.id,
        threadId,
        targetType: "thread",
        targetId: threadId,
        reason,
        details: details.trim() || "",
        status: "abierto",
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      setReportOpen(false);
      setDetails("");
      setReason("spam");
    } catch (e) {
      console.error(e);
      setErr("No se pudo enviar el reporte.");
    } finally {
      setReporting(false);
    }
  }

  function startEdit(c) {
  setEditingId(c.id);
  setEditingText(c.text || "");
}

function cancelEdit() {
  setEditingId(null);
  setEditingText("");
}

async function saveEdit() {
  const msg = editingText.trim();
  if (msg.length < 2) return setErr("El comentario debe tener al menos 2 caracteres.");
  if (!pueblo?.id || !threadId || !editingId) return;

  try {
    setBusyId(editingId);
    const ref = doc(db, "pueblos", pueblo.id, "threads", threadId, "comments", editingId);
    await updateDoc(ref, {
      text: msg,
      isEdited: true,
      editedAt: serverTimestamp(),
    });
    cancelEdit();
  } catch (e) {
    console.error(e);
    setErr("No se pudo editar el comentario.");
  } finally {
    setBusyId(null);
  }
}

async function removeComment(commentId) {
  if (!pueblo?.id || !threadId) return;

  const ok = window.confirm("¿Eliminar este comentario? Esta acción no se puede deshacer.");
  if (!ok) return;

  try {
    setBusyId(commentId);
    const ref = doc(db, "pueblos", pueblo.id, "threads", threadId, "comments", commentId);
    await deleteDoc(ref);
  } catch (e) {
    console.error(e);
    setErr("No se pudo eliminar el comentario.");
  } finally {
    setBusyId(null);
  }
}

  if (!pueblo) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Foro</h2>
        <div className="muted" style={{ marginTop: 8 }}>
          Cargando…
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="foroPage">
        <Link to={`/pueblo/${slug}/foro`} className="btn btn--ghost">
          ← Volver al foro
        </Link>
        <div className="muted" style={{ marginTop: 10 }}>
          Cargando hilo…
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="foroPage">
        <Link to={`/pueblo/${slug}/foro`} className="btn btn--ghost">
          ← Volver al foro
        </Link>
        <div className="muted" style={{ marginTop: 10 }}>
          Hilo no encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="foroPage">
      <div className="foroHeader">
  <div>
    <Link to={`/pueblo/${slug}/foro`} className="btn btn--ghost">
      ← Volver al foro
    </Link>

    <h2 style={{ margin: "12px 0 0 0" }}>{thread.title}</h2>

    <div className="muted" style={{ marginTop: 6 }}>
      {thread.category || "general"} {thread.userName ? `· ${thread.userName}` : ""}
    </div>
  </div>

  <div className="foroHeaderActions">
    <button className="btn btn--ghost" onClick={() => setReportOpen((v) => !v)}>
      Reportar
    </button>
  </div>
</div>

      <div className="foroCard" style={{ marginTop: 14 }}>
        <div style={{ whiteSpace: "pre-wrap" }}>{thread.body}</div>
      </div>

      {reportOpen ? (
        <div className="foroCard" style={{ marginTop: 14 }}>
          <h3 style={{ margin: 0 }}>Reportar hilo</h3>

          {!user ? (
            <div style={{ marginTop: 10 }}>
              <div className="muted">Necesitas iniciar sesión para reportar.</div>
              <div style={{ marginTop: 8 }}>
                <Link to="/login" className="btn">
                  Ir a login
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <div>
                <label style={{ fontSize: 13, opacity: 0.85 }}>Motivo</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)" }}
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, opacity: 0.85 }}>Detalles (opcional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 12, border: "1px solid rgba(0,0,0,0.12)" }}
                  maxLength={1000}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn btn--ghost" onClick={() => setReportOpen(false)} type="button">
                  Cancelar
                </button>
                <button className="btn" onClick={handleReportThread} disabled={reporting}>
                  {reporting ? "Enviando…" : "Enviar reporte"}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <div style={{ marginTop: 18 }}>
  <h3 style={{ margin: 0 }}>Comentarios</h3>

  <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
    {comments.length ? (
      comments.map((c) => {
        const isMine = user && c.userId === user.uid;
        const isEditing = editingId === c.id;

        return (
          <div
            key={c.id}
            style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)" }}
          >
            <div className="commentHeader">
              <div style={{ fontSize: 13, opacity: 0.85 }}>
                {c.userName || "Usuario"}{" "}
                <span className="muted">·</span>{" "}
                <span className="muted">
                  {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ""}
                  {c.isEdited ? " (editado)" : ""}
                </span>
              </div>

              {isMine && !isEditing ? (
                <div className="commentActions">
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() => startEdit(c)}
                    disabled={busyId === c.id}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn--ghost"
                    type="button"
                    onClick={() => removeComment(c.id)}
                    disabled={busyId === c.id}
                  >
                    Eliminar
                  </button>
                </div>
              ) : null}
            </div>

            <div style={{ marginTop: 8 }}>
              {isEditing ? (
                <div style={{ display: "grid", gap: 10 }}>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.12)",
                    }}
                    maxLength={1500}
                  />

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                      className="btn btn--ghost"
                      type="button"
                      onClick={cancelEdit}
                      disabled={busyId === c.id}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn"
                      type="button"
                      onClick={saveEdit}
                      disabled={busyId === c.id || editingText.trim().length < 2}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ whiteSpace: "pre-wrap" }}>{c.text}</div>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <div className="muted">Aún no hay comentarios.</div>
    )}
  </div>

  <form onSubmit={handleSendComment} style={{ marginTop: 14 }}>
    {!user ? (
      <div style={{ marginTop: 10 }}>
        <div className="muted">Inicia sesión para comentar.</div>
        <div style={{ marginTop: 8 }}>
          <Link to="/login" className="btn">
            Ir a login
          </Link>
        </div>
      </div>
    ) : (
      <div style={{ display: "grid", gap: 10 }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Escribe un comentario…"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
          }}
          maxLength={1500}
        />
        <div className="foroHeaderActions" style={{ justifyContent: "flex-end" }}>
          <button className="btn" disabled={sending || text.trim().length < 2}>
            {sending ? "Enviando…" : "Comentar"}
          </button>
        </div>
      </div>
    )}

    {err ? <div style={{ marginTop: 8, color: "#b42318", fontSize: 13 }}>{err}</div> : null}
  </form>
</div>
    </div>
  );
}