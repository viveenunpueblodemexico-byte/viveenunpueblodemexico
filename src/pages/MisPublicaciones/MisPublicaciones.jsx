import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import RequireUser from "../../components/auth/RequireUser";
import { getMisOfertas, editarOfertaUsuario, eliminarOfertaUsuario } from "../../services/ofertas";
import "./MisPublicaciones.css";

function badge(status) {
  const map = {
    pendiente: "badge badge--pending",
    aprobada: "badge badge--ok",
    rechazada: "badge badge--bad",
    tomada: "badge badge--muted",
  };
  return map[status] || "badge";
}

function label(status) {
  const map = {
    pendiente: "Pendiente",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
    tomada: "Tomada",
  };
  return map[status] || status || "—";
}

function fmtDate(ts) {
  try {
    const d = ts?.toDate?.() || (ts ? new Date(ts) : null);
    if (!d) return "—";
    return d.toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return "—";
  }
}

export default function MisPublicacionesPage() {
  return (
    <RequireUser>
      <MisPublicacionesInner />
    </RequireUser>
  );
}

function MisPublicacionesInner() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tipo, setTipo] = useState("todas"); // todas | trabajo | vivienda | traspasos

  useEffect(() => {
    async function load() {
        setLoading(true);
        setError("");
        try {
        const data = await getMisOfertas({ userId: user.uid, max: 200 });
        setItems(data);
        } catch (e) {
        setError(e?.message || "No se pudieron cargar tus publicaciones.");
        } finally {
        setLoading(false);
        }
    }

    if (user?.uid) load();
    }, [user?.uid]);

  // Editar con UX consistente:
  // mandamos al formulario de "publicar" con modo edición (query params).
  function editUrl(it) {
    const base =
      it.tipo === "trabajo" ? "/trabajo/publicar" :
      it.tipo === "vivienda" ? "/vivienda/publicar" :
      "/traspasos/publicar";
    return `${base}?edit=1&puebloId=${encodeURIComponent(it.puebloId)}&ofertaId=${encodeURIComponent(it.id)}`;
  }


async function onDelete(it) {
  try {
    const ok = window.confirm("¿Eliminar esta publicación? Esta acción no se puede deshacer.");
    if (!ok) return;

    await eliminarOfertaUsuario({ puebloId: it.puebloId, ofertaId: it.id });

    // refrescar lista
    const data = await getMisOfertas({ userId: user.uid, max: 200 });
    setItems(data);
  } catch (e) {
    alert(e?.message || "No se pudo eliminar.");
  }
}


  const filtered = useMemo(() => {
    if (tipo === "todas") return items;
    return items.filter((x) => x.tipo === tipo);
  }, [items, tipo]);

  const stats = useMemo(() => {
  const s = { total: filtered.length, pendiente: 0, aprobada: 0, rechazada: 0, tomada: 0 };
  for (const it of filtered) {
    if (it.status === "pendiente") s.pendiente++;
    else if (it.status === "aprobada") s.aprobada++;
    else if (it.status === "rechazada") s.rechazada++;
    else if (it.status === "tomada") s.tomada++;
  }
  return s;
}, [filtered]);

  return (
    <div className="container mispub">
      <div className="mispub__header">
        <div>
          <h1 className="mispub__title">Mis publicaciones</h1>
          <p className="mispub__subtitle">
            Aquí ves tus ofertas, incluyendo las pendientes (hasta que un admin las apruebe).
          </p>
        </div>
        <Link className="mispub__back" to="/">Volver</Link>
      </div>

      <div className="mispub__controls">
        <label className="mispub__filter">
          Filtrar por tipo
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="trabajo">Trabajo</option>
            <option value="vivienda">Vivienda</option>
            <option value="traspasos">Traspasos</option>
          </select>
        </label>
      </div>

      {loading ? <div className="mispub__loading">Cargando…</div> : null}
      {error ? <div className="alert alert--error">{error}</div> : null}

      {!loading && !error && filtered.length === 0 ? (
        
        <div className="mispub__empty">
          <p>No tienes publicaciones aún.</p>
          <div className="mispub__cta">
            <Link className="btnPrimary" to="/trabajo/publicar">Publicar trabajo</Link>
            <Link className="btn" to="/vivienda/publicar">Publicar vivienda</Link>
            <Link className="btn" to="/traspasos/publicar">Publicar traspasos</Link>
          </div>
        </div>
      ) : null}

      {!loading && !error ? (
      <div className="mispub__stats">
        <div className="stat"><b>{stats.total}</b><span>Total</span></div>
        <div className="stat"><b>{stats.pendiente}</b><span>Pendientes</span></div>
        <div className="stat"><b>{stats.aprobada}</b><span>Aprobadas</span></div>
        <div className="stat"><b>{stats.rechazada}</b><span>Rechazadas</span></div>
        <div className="stat"><b>{stats.tomada}</b><span>Tomadas</span></div>
        </div>
        ) : null}

<div className="mispub__list">
  {filtered.map((it) => {
  const canUserEdit = it.status === "pendiente" && it.activo === false;

  return (
    <div key={`${it.puebloId}-${it.id}`} className="mispub__card">
      <div className="mispub__row">
        <div className="mispub__titleRow">
          <span className={badge(it.status)}>{label(it.status)}</span>
          <h3 className="mispub__cardTitle">{it.titulo}</h3>
        </div>

        <div className="mispub__meta">
          <span className="mispub__pill">{it.tipo}</span>
          <span className="mispub__dot">•</span>
          <span>{fmtDate(it.createdAt)}</span>
        </div>
      </div>

      <p className="mispub__desc">
        {(it.descripcion || "").slice(0, 180)}
        {(it.descripcion || "").length > 180 ? "…" : ""}
      </p>

      <div className="mispub__footer">
        <div className="mispub__place">
          <b>{it.puebloNombre || "—"}</b>
          <span className="mispub__muted"> — {it.estado || "—"}</span>
        </div>

        <div className="mispub__actions">
          <Link className="mispub__link" to={`/pueblo/${it.puebloSlug || ""}`}>
            Ver pueblo
          </Link>

          {canUserEdit ? (
            <>
              <Link className="btn btn--primary" to={editUrl(it)}>Editar</Link>
              <button className="btn btn--danger" type="button" onClick={() => onDelete(it)}>
                Eliminar
              </button>
            </>
          ) : (
             <span className="mispub__hint">
              {it.status === "aprobada" ? "Aprobada: ya no se puede editar." :
              it.status === "rechazada" ? "Rechazada: ya no se puede editar." :
              it.status === "tomada" ? "Tomada: ya no se puede editar." :
              "Esta publicación ya no es editable."}
            </span>
          )}
        </div>
      </div>
    </div>
  );
})}
</div>
     
    </div>
  );
}