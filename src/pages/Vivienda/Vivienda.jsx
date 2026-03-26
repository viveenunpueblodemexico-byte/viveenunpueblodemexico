import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "./vivienda.css";
import { timeAgo } from "../../utils/date";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { isEmailAllowed } from "../../utils/admin";

import { getOfertasActivas } from "../../services/ofertas";

export default function Vivienda() {

  const [searchParams] = useSearchParams();

  const puebloSlugParam = (searchParams.get("pueblo") || "").trim();
  const puebloNombreParam = (searchParams.get("puebloNombre") || "").trim();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [estadoSlug, setEstadoSlug] = useState("all");
  const [adminUI, setAdminUI] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setAdminUI(isEmailAllowed(u?.email));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getOfertasActivas({ tipo: "vivienda", max: 200 });
        setItems(data);
      } catch (e) {
        setError(e?.message || "No se pudieron cargar las publicaciones.");
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

    const hay = !needle
      ? true
      : `${it.titulo || ""} ${it.descripcion || ""} ${it.puebloNombre || ""} ${it.estado || ""}`
          .toLowerCase()
          .includes(needle);

    return okEstado && okPueblo && hay;
  });
}, [items, q, estadoSlug, puebloSlugParam]);

  return (
    <Container>
      <section className="viviendaPage">
        <div className="viviendaTop">
          <div className="viviendaActions">
            <Link className="btn" to="/pueblos">Explorar pueblos</Link>
            <Link className="btn" to="/">Volver al inicio</Link>

            <Link className="btn btn--primary" to="/vivienda/publicar">Publicar vivienda</Link>
            
          </div>

          <header className="viviendaHeader">

            {puebloSlugParam && filtered.length > 0 ? (
              <div
                style={{
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 14,
                  opacity: 0.9,
                }}
              >
                Mostrando opciones de vivienda para <strong>{puebloNombreParam || puebloSlugParam}</strong>
              </div>
            ) : null}

            <h1 className="viviendaTitle">Vivienda</h1>
            <p className="viviendaLead">
              Opciones de vivienda publicadas por la comunidad en pueblos de México.
              (Se muestran únicamente las publicaciones aprobadas).
            </p>
          </header>
        </div>

        <div className="viviendaFilters">
          <input
            className="control"
            placeholder="Buscar por pueblo, estado o descripción…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="control"
            value={estadoSlug}
            onChange={(e) => setEstadoSlug(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {estados.map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>
        </div>

        {loading ? <p>Cargando…</p> : null}
        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

        <div className="viviendaList">
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
                  ? `Aún no hay más opciones de vivienda en ${puebloNombreParam}`
                  : "Aún no hay opciones de vivienda publicadas"}
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
                  ? "Todavía no se han publicado opciones de vivienda para este pueblo. Puedes ver todas las publicaciones disponibles o compartir la primera."
                  : "Todavía no se han publicado opciones de vivienda. ¿Tienes una casa, cuarto o espacio disponible en un pueblo? Publícalo para que la comunidad lo encuentre."}
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
                  to="/vivienda"
                  className="btn"
                  style={{
                    border: "1px solid rgba(35, 58, 50, 0.14)",
                    background: "transparent",
                  }}
                >
                  Ver todo
                </Link>

                <Link to="/vivienda/publicar" className="btn btn--primary">
                  Publicar vivienda
                </Link>
              </div>
            </div>
          ) : null}

          {filtered.map((it) => (
            <article key={it.id} className="viviendaCard">
              <h3>{it.titulo}</h3>
              <p className="viviendaMeta">
                {it.puebloNombre} · {it.estado}
                {it.createdAt ? ` · ${timeAgo(it.createdAt)}` : ""}
              </p>

              <p className="viviendaDesc">{it.descripcion}</p>
              {it.contactoEmail ? <p className="viviendaContact">Contacto: {it.contactoEmail}</p> : null}
              {it.puebloSlug ? <Link className="btn" to={`/pueblo/${it.puebloSlug}`}>Ver pueblo</Link> : null}
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
