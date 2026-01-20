import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosDestacados } from "../../services/pueblos";
import PuebloCard from "../../components/PuebloCard";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import Container from "../../components/layout/Container/Container";
import Hero from "../../home/Hero/Hero";

import "./home.css";

export default function Home() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEO + OG
    setPageSEO({
      title: "Vive en un Pueblo de México | Descubre comunidades para vivir y trabajar",
      description:
        "Explora pueblos de México para vivir, trabajar remoto o emprender. Calidad de vida, comunidad y oportunidades locales.",
      url: buildAbsoluteUrl("/"),
      type: "website",
    });

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getPueblosDestacados({ max: 6 });
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los pueblos destacados.");
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => {
      clearManagedSEO();
    };
  }, []);

  return (
  <main className="home">
    <Container>
      {/* HERO (componente) */}
      <Hero />

      {/* DESTACADOS */}
      <section id="destacados" className="home__section">
        <h2 className="home__sectionTitle">Destacados</h2>

        {loading && !error && <p className="home__status">Cargando...</p>}
        {error && <p className="home__status home__status--error">{error}</p>}

        {!loading && !error && pueblos.length === 0 && (
          <p className="home__status">Aún no hay pueblos destacados.</p>
        )}

        <div className="home__carousel">
          {pueblos.map((p) => (
            <Link
              key={p.id}
              to={`/pueblo/${p.slug || p.id}`}
              className="home__cardLink"
            >
              <PuebloCard pueblo={p} />
            </Link>
          ))}
        </div>

      </section>
    </Container>
  </main>
);

}
