import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import {
  collectionGroup,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminForo() {
  const [tab, setTab] = useState("reportes"); // "reportes" | "threads"
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filtros
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [reasonFilter, setReasonFilter] = useState("all");

  // data
  const [reports, setReports] = useState([]);
  const [threads, setThreads] = useState([]);

  const reportsQuery = useMemo(() => {
    const base = [orderBy("createdAt", "desc"), limit(50)];
    const ref = collectionGroup(db, "reports");

    // status abierto/cerrado
    if (onlyOpen) base.unshift(where("status", "==", "abierto"));

    // filtro por reason
    if (reasonFilter !== "all") base.unshift(where("reason", "==", reasonFilter));

    // Nota: where + orderBy puede pedir índice. Firebase te da el link para crearlo.
    return query(ref, ...base);
  }, [onlyOpen, reasonFilter]);

  const threadsQuery = useMemo(() => {
    // Lista global de threads (últimos 50 visibles/ocultos)
    // Si quieres filtrar solo visibles: where("status","==","visible")
    const ref = collectionGroup(db, "threads");
    return query(ref, where("status","==","visible"), orderBy("createdAt", "desc"), limit(50));
  }, []);

  async function loadReports() {
    setErr("");
    setLoading(true);
    try {
      const snap = await getDocs(reportsQuery);
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        setErr(`Error: ${e.code || "?"} — ${e.message || "?"}`);
      } finally {
      setLoading(false);
    }
  }

  async function loadThreads() {
    setErr("");
    setLoading(true);
    try {
      const snap = await getDocs(threadsQuery);
      setThreads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
      setErr("No se pudieron cargar threads (posible índice faltante).");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (tab === "reportes") loadReports();
    else loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, reportsQuery]);

  // ===== Acciones Admin =====

  async function setThreadStatus(puebloId, threadId, status) {
    if (!puebloId || !threadId) return;
    try {
      const ref = doc(db, "pueblos", puebloId, "threads", threadId);
      await updateDoc(ref, {
        status,
        updatedAt: serverTimestamp(),
        moderatedAt: serverTimestamp(),
        moderatedBy: "admin",
        moderatedAction: status === "oculto" ? "ocultar" : "mostrar",
      });
    } catch (e) {
      console.error(e);
      setErr("No se pudo cambiar el status del thread.");
    }
  }

  async function resolveReport(puebloId, threadId, reportId) {
    if (!puebloId || !threadId || !reportId) return;
    try {
      const ref = doc(db, "pueblos", puebloId, "threads", threadId, "reports", reportId);
      await updateDoc(ref, {
        status: "resuelto",
        resolvedAt: serverTimestamp(),
        resolvedBy: "admin",
      });
    } catch (e) {
      console.error(e);
      setErr("No se pudo marcar el reporte como resuelto.");
    }
  }

  async function resolveAndHide(puebloId, threadId, reportId) {
    await setThreadStatus(puebloId, threadId, "oculto");
    await resolveReport(puebloId, threadId, reportId);
    // recargar rápido
    if (tab === "reportes") loadReports();
  }

  async function resolveOnly(puebloId, threadId, reportId) {
    await resolveReport(puebloId, threadId, reportId);
    if (tab === "reportes") loadReports();
  }

  async function toggleThread(puebloId, threadId, currentStatus) {
    const next = currentStatus === "oculto" ? "visible" : "oculto";
    await setThreadStatus(puebloId, threadId, next);
    if (tab === "threads") loadThreads();
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin — Foro</h2>
          <div className="muted" style={{ marginTop: 6 }}>
            Moderación de hilos y reportes.
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn btn--ghost" onClick={() => setTab("reportes")} disabled={tab === "reportes"}>
            Reportes
          </button>
          <button className="btn btn--ghost" onClick={() => setTab("threads")} disabled={tab === "threads"}>
            Threads
          </button>
          <Link className="btn btn--ghost" to="/admin/ofertas">
            Admin Ofertas →
          </Link>
        </div>
      </div>

      {tab === "reportes" ? (
        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" checked={onlyOpen} onChange={(e) => setOnlyOpen(e.target.checked)} />
            Solo abiertos
          </label>

          <select value={reasonFilter} onChange={(e) => setReasonFilter(e.target.value)} style={{ padding: "8px 10px", borderRadius: 10 }}>
            <option value="all">Todos los motivos</option>
            <option value="spam">Spam</option>
            <option value="acoso">Acoso</option>
            <option value="datos_personales">Datos personales</option>
            <option value="ilegal">Ilegal</option>
            <option value="otro">Otro</option>
          </select>

          <button className="btn" onClick={loadReports}>
            Recargar
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 16 }}>
          <button className="btn" onClick={loadThreads}>
            Recargar
          </button>
        </div>
      )}

      {err ? (
        <div style={{ marginTop: 12, color: "#b42318", fontSize: 13 }}>
          {err} (Si el error menciona “requires an index”, abre el link que te da Firebase y créalo.)
        </div>
      ) : null}

      {loading ? (
        <div className="muted" style={{ marginTop: 14 }}>Cargando…</div>
      ) : null}

      {/* ===== TAB: REPORTES ===== */}
      {tab === "reportes" && !loading ? (
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {reports.length ? (
            reports.map((r) => {
              const puebloId = r.puebloId;
              const threadId = r.threadId;

              return (
                <div key={r.id} style={{ padding: 12, borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.35)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>
                      <b>{r.reason || "reporte"}</b>{" "}
                      <span className="muted">·</span>{" "}
                      <span className="muted">{r.status || "—"}</span>{" "}
                      <span className="muted">·</span>{" "}
                      <span className="muted">{puebloId || "—"}</span>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link className="btn btn--ghost" to={`/pueblo/${r.puebloSlug}/foro/${threadId}`}>
                        Ver hilo
                      </Link>

                      <button className="btn btn--ghost" onClick={() => resolveOnly(puebloId, threadId, r.id)}>
                        Marcar resuelto
                      </button>

                      <button className="btn" onClick={() => resolveAndHide(puebloId, threadId, r.id)}>
                        Ocultar + resolver
                      </button>
                    </div>
                  </div>

                  {r.details ? (
                    <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{r.details}</div>
                  ) : (
                    <div className="muted" style={{ marginTop: 8 }}>Sin detalles.</div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="muted" style={{ marginTop: 10 }}>No hay reportes para mostrar.</div>
          )}
        </div>
      ) : null}

      {/* ===== TAB: THREADS ===== */}
      {tab === "threads" && !loading ? (
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {threads.length ? (
            threads.map((t) => {
              const puebloId = t.puebloId || t.puebloSlug; // por si guardas slug
              const status = t.status || "visible";

              return (
                <div key={t.id} style={{ padding: 12, borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.35)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{t.title || "—"}</div>
                      <div className="muted" style={{ marginTop: 4, fontSize: 13 }}>
                        {t.category || "general"} · {puebloId || "—"} · {status}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link className="btn btn--ghost" to={`/pueblo/${puebloId}/foro/${t.id}`}>
                        Ver
                      </Link>
                      <button className="btn" onClick={() => toggleThread(puebloId, t.id, status)}>
                        {status === "oculto" ? "Mostrar" : "Ocultar"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="muted" style={{ marginTop: 10 }}>No hay threads para mostrar.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}