import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "./trabajo.css";

// ✅ auth + allowlist (solo para mostrar el botón Admin si aplica)
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { isEmailAllowed } from "../../utils/admin";

// ✅ data (ajusta el path si en tu proyecto el service está en otro lugar)
import { getOfertasActivas } from "../../services/ofertas";

export default function Trabajo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // filtros (client-side)
  const [q, setQ] = useState("");
  const [estadoSlug, setEstadoSlug] = useState("all");

  // estado auth para UI condicional
  const [adminUI, setAdminUI] = useState(false);

  // 1) Detectar si mostrar Admin (solo si está logueado y email permitido)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      const ok = isEmailAllowed(u?.email);
      setAdminUI(ok);
    });
    return () => unsub();
  }, []);

  // 2) Cargar ofertas activas
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getOfertasActivas({ tipo: "trabajo", max: 200 });
        setItems(data);
      } catch (e) {
        setError(e?.message || "No se pudieron cargar las ofertas.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const estados = useMemo(() => {
    const map = new Map();
    for (const it of items) {
      const key = it.estadoSlug || "sin-estado";
      if (!map.has(key)) map.set(key, it.estado || "Sin estado");
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((it) => {
      const okEstado = estadoSlug === "all" ? true : it.estadoSlug === estadoSlug;
      const okText = !needle
        ? true
        : `${it.titulo} ${it.descripcion} ${it.puebloNombre} ${it.estado}`
            .toLowerCase()
            .includes(needle);
      return okEstado && okText;
    });
  }, [items, q, estadoSlug]);

  return (
    <main className="trabajoPage">
      <Container>
        <div className="trabajoTop">
          <div className="trabajoActions">
            <Link to="/pueblos" className="btn">
              Explorar pueblos
            </Link>

            <Link to="/" className="btn">
              Volver al inicio
            </Link>

            <Link to="/trabajo/publicar" className="btn btn--primary">
              Publicar oferta
            </Link>

            {/* ✅ Admin SOLO si está logueado con correo permitido */}
            {adminUI ? (
              <Link to="/admin/ofertas" className="btn">
                Admin
              </Link>
            ) : null}
          </div>
        </div>

        <header className="trabajoHeader">
          <h1 className="trabajoTitle">Bolsa de Trabajo</h1>
          <p className="text-gray-600 text-center max-w-prose mx-auto">
            Oportunidades activas publicadas para pueblos de México.
          </p>
        </header>

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <input
              className="control"
              placeholder="Buscar (título, pueblo, estado, texto)…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ minWidth: 280 }}
            />

            <select
              className="control"
              value={estadoSlug}
              onChange={(e) => setEstadoSlug(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              {estados.map(([slug, name]) => (
                <option key={slug} value={slug}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            import.meta.env.DEV ? (
              <div style={{ color: "crimson" }}>{error}</div>
            ) : (
              <div style={{ color: "crimson" }}>
                No se pudieron cargar las ofertas. Intenta más tarde.
              </div>
            )
          ) : null}


          {!loading && filtered.length === 0 ? <div>No hay ofertas activas por ahora.</div> : null}

          <div style={{ display: "grid", gap: 12 }}>
            {filtered.map((it) => (
              <div
                key={it.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: 14,
                  textAlign: "left",
                }}
              >
                <div style={{ fontWeight: 800 }}>{it.titulo}</div>
                <div style={{ opacity: 0.85, fontSize: 14 }}>
                  {it.puebloNombre || "—"} · {it.estado || "—"}
                </div>

                {it.descripcion ? (
                  <p style={{ marginTop: 10, whiteSpace: "pre-wrap" }}>{it.descripcion}</p>
                ) : null}

                <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {it.puebloSlug ? (
                    <Link className="btn" to={`/pueblo/${it.puebloSlug}?back=${encodeURIComponent("/trabajo")}`}>
                      Ver pueblo
                    </Link>
                  ) : null}

                  {it.contactoEmail ? (
                    <a className="btn" href={`mailto:${it.contactoEmail}`}>
                      Contactar
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
