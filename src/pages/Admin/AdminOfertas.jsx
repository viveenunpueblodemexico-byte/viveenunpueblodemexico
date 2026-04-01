import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import Container from "../../components/layout/Container/Container";
import { auth } from "../../firebase";
import {
  aprobarOferta,
  getOfertasPendientes,
  rechazarOferta,
  getOfertasPorStatus,
  marcarOfertaTomada,
  reactivarOferta,
  eliminarOfertaAdmin,
} from "../../services/ofertas";

const TIPOS_VALIDOS = ["trabajo", "vivienda", "traspasos"];
const VISTAS_VALIDAS = ["pendientes", "aprobadas", "rechazadas", "tomadas"];

function normalizeTipo(value) {
  return TIPOS_VALIDOS.includes(value) ? value : "trabajo";
}

function normalizeVista(value) {
  return VISTAS_VALIDAS.includes(value) ? value : "pendientes";
}

function statusLabel(status) {
  if (status === "tomada") return "Cerrada";
  if (status === "aprobada") return "Aprobada";
  if (status === "rechazada") return "Rechazada";
  if (status === "pendiente") return "Pendiente";
  return status || "—";
}


export default function AdminOfertas() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTipo = normalizeTipo(searchParams.get("tipo"));
  const initialVista = normalizeVista(searchParams.get("vista")); // pendientes | aprobadas | rechazadas | tomadas

  const [tipo, setTipo] = useState(initialTipo);
  const [vista, setVista] = useState(initialVista);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [pendientesCount, setPendientesCount] = useState(0);


  const count = items.length;
  const vistaLabel =
    vista === "pendientes"
      ? "Pendientes"
      : vista === "aprobadas"
      ? "Aprobadas"
      : vista === "rechazadas"
      ? "Rechazadas"
      : "Cerradas";
   // URL -> estado (cuando navegamos con back/forward o llegan links con query)
  useEffect(() => {
        const nextTipo = normalizeTipo(searchParams.get("tipo"));
    const nextVista = normalizeVista(searchParams.get("vista"));

    setTipo((prev) => (prev === nextTipo ? prev : nextTipo));
    setVista((prev) => (prev === nextVista ? prev : nextVista));
  }, [searchParams]);

  // Estado -> URL para compartir/recargar sin perder filtros
  useEffect(() => {
    const currentTipo = normalizeTipo(searchParams.get("tipo"));
    const currentVista = normalizeVista(searchParams.get("vista"));
    if (currentTipo === tipo && currentVista === vista) return;

    setSearchParams({ tipo, vista }, { replace: true });

  }, [tipo, vista, setSearchParams]);
 
  async function load() {
    setLoading(true);
    setError("");
    try {
      const data =
        vista === "pendientes"
          ? await getOfertasPendientes({ tipo, max: 200 })
          : await getOfertasPorStatus({
              tipo,
              status:
                vista === "aprobadas"
                  ? "aprobada"
                  : vista === "rechazadas"
                  ? "rechazada"
                  : "tomada",
              max: 200,
            });
      setItems(data);
    } catch (e) {
      setError(e?.message || "No se pudieron cargar las ofertas.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPendientesCount() {
  try {
    const data = await getOfertasPendientes({ tipo, max: 200 });
    setPendientesCount(data.length);
  } catch {
    // si falla, no rompemos UI
    setPendientesCount(0);
  }
}


    useEffect(() => { 
      load(); 
      loadPendientesCount();
    }, [tipo, vista]);


  const tabBtn = (active) => ({
    padding: "8px 12px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: active ? "var(--text)" : "transparent",
    color: active ? "white" : "var(--text)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 13,
  });

  async function onApprove(it) {
    setBusyId(it.id);
    try {
      await aprobarOferta({ puebloId: it.puebloId, ofertaId: it.id });
      setItems((prev) => prev.filter((x) => x.id !== it.id));
      await loadPendientesCount();

    } catch (e) {
      alert(e?.message || "No se pudo aprobar.");
    } finally {
      setBusyId("");
    }
  }

  async function onReject(it) {
  setBusyId(it.id);
  try {
    await rechazarOferta({ puebloId: it.puebloId, ofertaId: it.id });
    setItems((prev) => prev.filter((x) => x.id !== it.id));
    await loadPendientesCount();
  } finally {
    setBusyId("");
  }
}

async function onTaken(it) {
  setBusyId(it.id);
  try {
    await marcarOfertaTomada({ puebloId: it.puebloId, ofertaId: it.id });
    setItems((prev) => prev.filter((x) => x.id !== it.id));
    await loadPendientesCount();
  } finally {
    setBusyId("");
  }
}

async function onReactivate(it) {
  setBusyId(it.id);
  try {
    await reactivarOferta({ puebloId: it.puebloId, ofertaId: it.id });
    setItems((prev) => prev.filter((x) => x.id !== it.id));
    await loadPendientesCount();
  } finally {
    setBusyId("");
  }
}

async function onDelete(it) {
  const ok = window.confirm("¿Eliminar esta oferta definitivamente? Esta acción no se puede deshacer.");
  if (!ok) return;

  setBusyId(it.id);
  try {
    await eliminarOfertaAdmin({ puebloId: it.puebloId, ofertaId: it.id });
    setItems((prev) => prev.filter((x) => x.id !== it.id));
    await loadPendientesCount();
  } catch (e) {
    alert(e?.message || "No se pudo eliminar.");
  } finally {
    setBusyId("");
  }
}

  const empty = useMemo(() => !loading && count === 0, [loading, count]);

  return (
    <main style={{ padding: "24px 0" }}>
      <Container>
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Moderación de ofertas</h1>

             <p>
              {vistaLabel}: <b>{loading ? "…" : count}</b>
            </p>

          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* Tabs: Vista */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={tabBtn(vista === "pendientes")} onClick={() => setVista("pendientes")} disabled={loading}>
                Pendientes {loading ? "" : `(${pendientesCount})`}
              </button>

              <button style={tabBtn(vista === "aprobadas")} onClick={() => setVista("aprobadas")} disabled={loading}>Aprobadas</button>
              <button style={tabBtn(vista === "rechazadas")} onClick={() => setVista("rechazadas")} disabled={loading}>Rechazadas</button>
              <button style={tabBtn(vista === "tomadas")} onClick={() => setVista("tomadas")} disabled={loading}>Cerradas</button>
            </div>

            {/* Tabs: Tipo */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={tabBtn(tipo === "trabajo")} onClick={() => setTipo("trabajo")} disabled={loading}>Trabajo</button>
              <button style={tabBtn(tipo === "vivienda")} onClick={() => setTipo("vivienda")} disabled={loading}>Vivienda</button>
              <button style={tabBtn(tipo === "traspasos")} onClick={() => setTipo("traspasos")} disabled={loading}>Traspasos</button>
            </div>

            <button className="btn" onClick={load} disabled={loading}>
              Recargar
            </button>

            <Link className="btn" to="/">
              Ir al sitio
            </Link>

            <button className="btn" onClick={() => signOut(auth)}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {error ? <div style={{ marginTop: 12, color: "crimson" }}>{error}</div> : null}

        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          {loading ? <div>Cargando…</div> : null}
          {empty ? <div>No hay ofertas {vistaLabel.toLowerCase()} 🎉</div> : null}

          {items.map((it) => (
            <div
              key={it.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 14,
                textAlign: "left",
                background: "color-mix(in srgb, var(--bg) 92%, #fff 8%)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{it.titulo}</div>
                  <div style={{ opacity: 0.8, fontSize: 14 }}>
                    {it.puebloNombre || "—"} · {it.estado || "—"}{" "}
                    <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 999, border: "1px solid var(--border)", fontSize: 12 }}>
                      {it.tipo}
                    </span>
                    <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 999, border: "1px solid var(--border)", fontSize: 12, opacity: 0.9 }}>
                     {statusLabel(it.status)}
                    </span>

                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {it.puebloSlug ? (
                    <Link className="btn" to={`/pueblo/${it.puebloSlug}?back=${encodeURIComponent("/admin/ofertas")}`}>
                      Ver pueblo
                    </Link>
                  ) : null}

               {vista === "pendientes" ? (
                    <>
                      <button className="btn btn--primary" onClick={() => onApprove(it)} disabled={busyId === it.id}>
                        {busyId === it.id ? "…" : "Aprobar"}
                      </button>
                      <button className="btn" onClick={() => onReject(it)} disabled={busyId === it.id}>
                        {busyId === it.id ? "…" : "Rechazar"}
                      </button>
                    </>
                  ) : null}

                  {vista === "aprobadas" ? (
                    <>
                      <button className="btn" onClick={() => onTaken(it)} disabled={busyId === it.id}>
                        {busyId === it.id ? "…" : "Cerrar oferta"}
                      </button>
                      <button className="btn" onClick={() => onReject(it)} disabled={busyId === it.id}>
                        {busyId === it.id ? "…" : "Rechazar"}
                      </button>
                    </>
                  ) : null}
          
                  {vista === "tomadas" ? (
                    <button className="btn" onClick={() => onReactivate(it)} disabled={busyId === it.id}>
                      {busyId === it.id ? "…" : "Reactivar"}
                    </button>
                  ) : null}

                  {vista === "rechazadas" ? (
                    <button className="btn" onClick={() => onReactivate(it)} disabled={busyId === it.id}>
                      {busyId === it.id ? "…" : "Reactivar"}
                    </button>
                  ) : null}

                  <button
                    className="btn btn--danger"
                    onClick={() => onDelete(it)}
                    disabled={busyId === it.id}
                  >
                    {busyId === it.id ? "…" : "Eliminar"}
                  </button>
                </div>
              </div>

              {it.descripcion ? (
                <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>
                  {it.descripcion}
                </p>
              ) : null}

              {it.contactoEmail ? (
                <p style={{ marginTop: 8, fontSize: 14 }}>
                  Contacto: <b>{it.contactoEmail}</b>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
