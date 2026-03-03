import "./ThreadList.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase"; // <-- ajusta esta ruta si tu db está en otro archivo

export default function ThreadList({ puebloId, puebloSlug, mode = "preview", limitCount = 5 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const q = useMemo(() => {
  if (!puebloId) return null;

  const ref = collection(db, "pueblos", puebloId, "threads");
  const parts = [where("status", "==", "visible"), orderBy("createdAt", "desc")];
  if (mode === "preview") parts.push(limit(limitCount));
  return query(ref, ...parts);
}, [puebloId, mode, limitCount]);

useEffect(() => {
  if (!q) return;

  if (!items.length) setLoading(true);

  const unsub = onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(rows);
      setLoading(false);
    },
    (err) => {
      console.error("ThreadList onSnapshot error:", err);
      setLoading(false);
    }
  );

  return () => unsub();
}, [q]);

  if (loading) return <div className="muted">Cargando foro…</div>;
  if (!items.length) return <div className="muted">Aún no hay preguntas. Sé el primero 🙂</div>;

  return (
    <div className="foro__list">
      {items.map((t) => (
        <Link
          key={t.id}
          className="foro__item"
          to={`/pueblo/${puebloSlug || puebloId}/foro/${t.id}`}
        >
          <div className="foro__title">{t.title}</div>
          <div className="foro__meta">
            <span className="foro__cat">{t.category || "general"}</span>
            {t.userName ? <span className="foro__by"> · {t.userName}</span> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}