import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import { getPueblosPublicados } from "../../services/pueblos";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import { slugify } from "../../utils/slug";

import "./estados.css";

export default function Estados() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageSEO({
      title: "Estados | Vive en un Pueblo",
      description:
        "Explora pueblos publicados por estado. Encuentra comunidades con calidad de vida y oportunidades locales.",
      url: buildAbsoluteUrl("/estados"),
      type: "website",
    });

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPueblosPublicados({ max: 200 });
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error al leer Firestore");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => clearManagedSEO();
  }, []);

  const estados = useMemo(() => {
    const map = new Map();

    for (const p of pueblos) {
      const estado = (p.estado || "").trim();
      if (!estado) continue;

      const key = slugify(estado);
      if (!key) continue;

      const prev = map.get(key);
      if (!prev) {
        map.set(key, { estado, estadoSlug: key, count: 1 });
      } else {
        map.set(key, { ...prev, count: prev.count + 1 });
      }
    }

    return Array.from(map.values()).sort((a, b) => {
      // Primero por cantidad desc, luego alfabético
      if (b.count !== a.count) return b.count - a.count;
      return a.estado.localeCompare(b.estado, "es");
    });
  }, [pueblos]);

  return (
    <main className="estados">
      <Container>
        <header className="estados__header">
          <div className="estados__titleBlock">
            <h1 className="estados__title">Explorar por estado</h1>
            <p className="estados__subtitle">
              Selecciona un estado para ver los pueblos publicados.
            </p>
          </div>

          <Link className="estados__back" to="/">
            Volver
          </Link>
        </header>

        {error && <p className="estados__status estados__status--error">Error: {error}</p>}
        {loading && !error && <p className="estados__status">Cargando...</p>}

        {!loading && !error && estados.length === 0 && (
          <p className="estados__status">Aún no hay pueblos publicados.</p>
        )}

        <section className="estados__grid" aria-label="Listado de estados">
          {estados.map((e) => (
            <Link key={e.estadoSlug} to={`/estado/${e.estadoSlug}`} className="estados__cardLink">
              <article className="estadoCard">
                <div className="estadoCard__name">{e.estado}</div>
                <div className="estadoCard__meta">{e.count} pueblo(s)</div>
              </article>
            </Link>
          ))}
        </section>
      </Container>
    </main>
  );
}
