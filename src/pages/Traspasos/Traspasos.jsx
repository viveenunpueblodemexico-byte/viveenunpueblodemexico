import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "./traspasos.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { isEmailAllowed } from "../../utils/admin";

import { getOfertasActivas } from "../../services/ofertas";

export default function Traspasos() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [estadoSlug, setEstadoSlug] = useState("all");
  const [adminUI, setAdminUI] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setAdminUI(isEmailAllowed(u?.email)));
    return () => unsub();
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getOfertasActivas({ tipo: "traspasos", max: 200 });
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
      const hay = `${it.titulo || ""} ${it.descripcion || ""} ${it.puebloNombre || ""} ${it.estado || ""}`
        .toLowerCase()
        .includes(needle);
      return okEstado && hay;
    });
  }, [items, q, estadoSlug]);

  return (
    <Container>
      <section className="traspasosPage">
        <div className="traspasosTop">
          <div className="traspasosActions">
            <Link className="btn" to="/pueblos">Explorar pueblos</Link>
            <Link className="btn" to="/">Volver al inicio</Link>

            <Link className="btn btn--primary" to="/traspasos/publicar">Publicar traspaso</Link>
            {adminUI ? <Link className="btn" to="/admin/ofertas">Admin</Link> : null}
          </div>

          <header className="traspasosHeader">
            <h1 className="traspasosTitle">Traspasos</h1>
            <p className="traspasosLead">
              Negocios y proyectos publicados por la comunidad en pueblos de México.
              (Se muestran únicamente las publicaciones aprobadas).
            </p>
          </header>
        </div>

        <div className="traspasosFilters">
          <input
            className="control"
            placeholder="Buscar por negocio, pueblo o estado…"
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

        <div className="traspasosList">
          {!loading && !error && filtered.length === 0 ? (
            <div className="traspasosEmpty">
              <h3>No hay traspasos publicados por ahora.</h3>
              <p>
                Si vas a traspasar un negocio, proyecto o iniciativa local,
                publícalo para que otras personas interesadas lo conozcan.
              </p>
              <Link className="btn btn--primary" to="/traspasos/publicar">Publicar traspaso</Link>
            </div>
          ) : null}

          {filtered.map((it) => (
            <article key={it.id} className="traspasosCard">
              <h3>{it.titulo}</h3>
              <p className="traspasosMeta">{it.puebloNombre} · {it.estado}</p>
              <p className="traspasosDesc">{it.descripcion}</p>
              {it.contactoEmail ? <p className="traspasosContact">Contacto: {it.contactoEmail}</p> : null}
              {it.puebloSlug ? <Link className="btn" to={`/pueblo/${it.puebloSlug}`}>Ver pueblo</Link> : null}
            </article>
          ))}
        </div>
      </section>
    </Container>
  );
}
