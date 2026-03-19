import { useEffect, useMemo, useState } from "react";
import { Link , useSearchParams } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "./trabajo.css";
import { timeAgo } from "../../utils/date";

// ✅ auth + allowlist (solo para mostrar el botón Admin si aplica)
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { isEmailAllowed } from "../../utils/admin";

// ✅ data (ajusta el path si en tu proyecto el service está en otro lugar)
import { getOfertasActivas } from "../../services/ofertas";

export default function Trabajo() {
  const [searchParams] = useSearchParams();

  const puebloSlugParam = (searchParams.get("pueblo") || "").trim();
  const puebloNombreParam = (searchParams.get("puebloNombre") || "").trim();

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

    const okPueblo = !puebloSlugParam
      ? true
      : (it.puebloSlug || "") === puebloSlugParam;

    const okText = !needle
      ? true
      : `${it.titulo || ""} ${it.descripcion || ""} ${it.puebloNombre || ""} ${it.estado || ""}`
          .toLowerCase()
          .includes(needle);

    return okEstado && okPueblo && okText;
  });
}, [items, q, estadoSlug, puebloSlugParam]);

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

            
          </div>
        </div>

        <header className="trabajoHeader">
          {puebloSlugParam && filtered.length > 0 ? (
            <div
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: 14,
                opacity: 0.9,
              }}
            >
              Mostrando oportunidades para <strong>{puebloNombreParam || puebloSlugParam}</strong>
            </div>
          ) : null}

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


          {!loading && !error && filtered.length === 0 ? (
            <div
              style={{
                margin: "28px auto 0",
                maxWidth: 680,
                padding: "28px 22px",
                textAlign: "center",
                borderRadius: 22,
                border: "1px solid rgba(35, 58, 50, 0.08)",
                background: "rgba(255,255,255,0.38)",
              }}
            >
              <img
                src="/pueblos-iso.png"
                alt="Vive en un Pueblo"
                style={{
                  width: 72,
                  height: 72,
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto 14px",
                }}
              />

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#23433a",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                }}
              >
                {puebloNombreParam
                  ? `Aún no hay ofertas activas en ${puebloNombreParam}`
                  : "Aún no hay ofertas activas"}
              </h3>

              <p
                style={{
                  margin: "0 auto",
                  maxWidth: "48ch",
                  lineHeight: 1.6,
                  color: "rgba(35, 58, 50, 0.76)",
                }}
              >
                {puebloNombreParam
                  ? "Todavía no se han publicado oportunidades laborales para este pueblo. Puedes ver todas las ofertas disponibles o publicar la primera."
                  : "Todavía no se han publicado oportunidades laborales. Puedes explorar otros pueblos o publicar la primera oferta."}
              </p>

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to="/trabajo"
                  className="btn"
                  style={{
                    border: "1px solid rgba(35, 58, 50, 0.14)",
                    background: "transparent",
                  }}
                >
                  Ver todo
                </Link>

                <Link to="/trabajo/publicar" className="btn btn--primary">
                  Publicar oferta
                </Link>
              </div>
            </div>
          ) : null}

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
                  {it.createdAt ? ` · ${timeAgo(it.createdAt)}` : ""}
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
