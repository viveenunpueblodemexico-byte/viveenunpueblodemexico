import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosPublicados } from "../../services/pueblos";
import PuebloCard from "../../components/PuebloCard";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import Container from "../../components/layout/Container/Container";

import "./pueblos.css";

export default function Pueblos() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageSEO({
      title: "Catálogo de pueblos para vivir en México | Vive en un Pueblo",
      description:
        "Explora pueblos publicados en el catálogo. Encuentra comunidades con calidad de vida y oportunidades locales.",
      url: buildAbsoluteUrl("/pueblos"),
      type: "website",
    });

    async function loadPueblos() {
      setLoading(true);
      setError("");
      try {
        const data = await getPueblosPublicados({ max: 100 });
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error al leer Firestore");
      } finally {
        setLoading(false);
      }
    }

    loadPueblos();

    return () => {
      clearManagedSEO();
    };
  }, []);

  return (
    <main className="pueblos">
      <Container>
        <header className="pueblos__header">
          <div className="pueblos__titleBlock">
            <h1 className="pueblos__title">Catálogo de pueblos</h1>
            <p className="pueblos__subtitle">
              Pueblos publicados y curados. Abre una ficha para ver detalles,
              imágenes y oportunidades.
            </p>
          </div>

          <Link className="pueblos__back" to="/">
            Volver
          </Link>
        </header>

        {error && <p className="pueblos__status pueblos__status--error">Error: {error}</p>}
        {loading && !error && <p className="pueblos__status">Cargando...</p>}

        {!loading && !error && pueblos.length === 0 && (
          <p className="pueblos__status">Aún no hay pueblos publicados.</p>
        )}

        <section className="pueblos__grid" aria-label="Listado de pueblos">
          {pueblos.map((p) => (
            <Link
              key={p.id}
              to={`/pueblo/${p.slug || p.id}`}
              className="pueblos__cardLink"
            >
              <PuebloCard pueblo={p} />
            </Link>
          ))}
        </section>
      </Container>
    </main>
  );
}
