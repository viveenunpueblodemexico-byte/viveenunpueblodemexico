import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import PuebloCard from "../../components/PuebloCard";
import { getPueblosPublicados } from "../../services/pueblos";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import { slugify } from "../../utils/slug";

import "./estado.css";

export default function Estado() {
  const { estadoSlug = "" } = useParams();

  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const pueblosFiltrados = useMemo(() => {
    const target = (estadoSlug || "").trim().toLowerCase();
    if (!target) return [];

    return pueblos.filter((p) => slugify(p.estado || "") === target);
  }, [pueblos, estadoSlug]);

  const estadoNombre = pueblosFiltrados[0]?.estado || "";

  useEffect(() => {
    const title = estadoNombre
      ? `Pueblos en ${estadoNombre} | Vive en un Pueblo`
      : "Estado | Vive en un Pueblo";

    const description = estadoNombre
      ? `Explora pueblos publicados en ${estadoNombre}.`
      : "Explora pueblos publicados por estado.";

    setPageSEO({
      title,
      description,
      url: buildAbsoluteUrl(`/estado/${estadoSlug}`),
      type: "website",
    });

    return () => clearManagedSEO();
  }, [estadoNombre, estadoSlug]);

  return (
    <main className="estado">
      <Container>
        <header className="estado__header">
          <div className="estado__titleBlock">
            <h1 className="estado__title">
              {estadoNombre ? `Pueblos en ${estadoNombre}` : "Estado"}
            </h1>
            <p className="estado__subtitle">
              {estadoNombre
                ? "Selecciona un pueblo para ver su ficha."
                : "No pudimos identificar el estado."}
            </p>
          </div>

          <div className="estado__actions">
            <Link className="estado__back" to="/estados">
              Volver a estados
            </Link>
          </div>
        </header>

        {error && <p className="estado__status estado__status--error">Error: {error}</p>}
        {loading && !error && <p className="estado__status">Cargando...</p>}

        {!loading && !error && pueblosFiltrados.length === 0 && (
          <p className="estado__status">
            No hay pueblos publicados para este estado (o el slug no coincide).
          </p>
        )}

        <section className="estado__grid" aria-label="Listado de pueblos por estado">
          {pueblosFiltrados.map((p) => (
            <Link
            key={p.id}
            to={`/pueblo/${p.slug || p.id}?back=${encodeURIComponent(`/estado/${estadoSlug}`)}`}
            className="estado__cardLink"
            >
            <PuebloCard pueblo={p} />
            </Link>
          ))}
        </section>
      </Container>
    </main>
  );
}
