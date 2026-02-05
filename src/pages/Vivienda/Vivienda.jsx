import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import "../trabajo/trabajo.css";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { isEmailAllowed } from "../../utils/admin";

import { getOfertasActivas } from "../../services/ofertas";

export default function Vivienda() {
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
      const hay = `${it.titulo || ""} ${it.descripcion || ""} ${it.puebloNombre || ""} ${it.estado || ""}`
        .toLowerCase()
        .includes(needle);
      return okEstado && hay;
    });
 }, [items, q, estadoSlug]);

  return (
    <Container>
      <div className="trabajo-header">
        <h1>Vivienda</h1>
        <p className="trabajo-subtitle">
          Opciones publicadas por la comunidad (se muestran solo las aprobadas).
        </p>

        <div className="trabajo-actions">
          <Link className="btn" to="/vivienda/publicar">Publicar</Link>
          {adminUI ? <Link className="btn" to="/admin/ofertas">Admin</Link> : null}
        </div>
      </div>

      <div className="trabajo-filters">
        <input
          className="control"
          placeholder="Buscar…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="control" value={estadoSlug} onChange={(e) => setEstadoSlug(e.target.value)}>
          <option value="all">Todos los estados</option>
          {estados.map(([slug, name]) => (
            <option key={slug} value={slug}>{name}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Cargando…</p> : null}
      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

      <div className="trabajo-list">
        {!loading && !error && filtered.length === 0 ? <p>No hay publicaciones por ahora.</p> : null}
        {filtered.map((it) => (
          <article key={it.id} className="trabajo-card">
            <h3>{it.titulo}</h3>
            <p className="trabajo-meta">
              {it.puebloNombre} · {it.estado} · vivienda
            </p>
            <p className="trabajo-desc">{it.descripcion}</p>
            {it.contactoEmail ? <p className="trabajo-contact">Contacto: {it.contactoEmail}</p> : null}
            {it.puebloSlug ? <Link className="btn" to={`/pueblo/${it.puebloSlug}`}>Ver pueblo</Link> : null}
          </article>
        ))}
      </div>
    </Container>
  );
}
