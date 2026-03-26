// src/components/comments/CommentsList.jsx
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { listenComments, updateComment, removeComment } from "../../services/comments";
import { useAuth } from "../../auth/AuthProvider"; // ajusta si tu hook se llama distinto

function canManageComment({ user, comment, isAdmin }) {
  if (!user) return false;
  if (isAdmin) return true;
  return comment?.userId && user.uid === comment.userId;
}

export default function CommentsList({
  entityField = "puebloId",   // o "appId" / "expertId"
  entityId,
  isAdmin = false,           // pásalo desde tu layout/admin si aplica
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!entityId) return;
    const unsub = listenComments(
      { entityField, entityId },
      setComments,
      (e) => {
        console.error(e);
        toast.error("No se pudieron cargar los comentarios");
      }
    );
    return () => unsub?.();
  }, [entityField, entityId]);

  const editingComment = useMemo(
    () => comments.find((c) => c.id === editingId),
    [comments, editingId]
  );

  const startEdit = (c) => {
    setEditingId(c.id);
    setDraft(c.text || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft("");
  };

  const saveEdit = async () => {
    const text = (draft || "").trim();
    if (!editingId) return;
    if (text.length < 2) return toast.error("El comentario es muy corto");

    // permiso extra en UI
    if (!canManageComment({ user, comment: editingComment, isAdmin })) {
      return toast.error("No tienes permiso para editar este comentario");
    }

    try {
      await updateComment(editingId, { text });
      toast.success("Comentario actualizado");
      cancelEdit();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar");
    }
  };

  const doDelete = async (c) => {
    if (!canManageComment({ user, comment: c, isAdmin })) {
      return toast.error("No tienes permiso para eliminar este comentario");
    }

    const ok = window.confirm("¿Eliminar este comentario? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
      await removeComment(c.id);
      toast.success("Comentario eliminado");
      if (editingId === c.id) cancelEdit();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo eliminar");
    }
  };

  if (!entityId) return null;

  return (
    <div className="space-y-3">
      {comments.length === 0 && (
        <div className="text-sm text-neutral-600">Aún no hay comentarios.</div>
      )}

      {comments.map((c) => {
        const manageable = canManageComment({ user, comment: c, isAdmin });
        const isEditing = editingId === c.id;

        return (
          <div
            key={c.id}
            className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-900 truncate">
                  {c.userName || "Usuario"}
                </div>
                <div className="text-xs text-neutral-500">
                  {c.createdAt?.toDate?.()
                    ? c.createdAt.toDate().toLocaleString()
                    : ""}
                  {c.isEdited ? " · editado" : ""}
                </div>
              </div>

              {manageable && !isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-xs rounded-lg border px-2 py-1 hover:bg-neutral-50"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => doDelete(c)}
                    className="text-xs rounded-lg border px-2 py-1 hover:bg-neutral-50"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              {!isEditing ? (
                <p className="text-sm text-neutral-800 whitespace-pre-wrap">
                  {c.text}
                </p>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-neutral-200 p-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="text-xs rounded-lg border px-3 py-1 hover:bg-neutral-50"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-xs rounded-lg border px-3 py-1 hover:bg-neutral-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}