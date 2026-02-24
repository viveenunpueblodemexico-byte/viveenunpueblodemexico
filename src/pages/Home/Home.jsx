import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosDestacados } from "../../services/pueblos";
import PuebloCard from "../../components/PuebloCard";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import Container from "../../components/layout/Container/Container";
import Hero from "../../home/Hero/Hero";
import { useAuth } from "../../auth/AuthProvider"; 

import "./home.css";

export default function Home() {
  const { user, loginWithGoogle, logout } = useAuth(); 

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

      {/* ✅ CTA LOGIN */}
        <section className="home__authCta" aria-label="Iniciar sesión">
          {!user ? (
            <div className="home__authCard">
              <h2 className="home__authTitle">Publica oportunidades</h2>
              <p className="home__authSub">
                Inicia sesión con Google para publicar trabajo, vivienda o traspasos y ver tus publicaciones.
              </p>

              <div className="home__authActions">
                <button className="btnPrimary" type="button" onClick={loginWithGoogle}>
                  Iniciar con Google
                </button>
                <Link className="btn" to="/trabajo">
                  Ver oportunidades
                </Link>
              </div>
            </div>
          ) : (
            <div className="home__authCard">
              <h2 className="home__authTitle">Bienvenido</h2>
              <p className="home__authSub">
                Sesión iniciada: <b>{user.email || "Cuenta Google"}</b>
              </p>

              <div className="home__authActions">
                <Link className="btnPrimary" to="/mis-publicaciones">
                  Mis publicaciones
                </Link>
                <button className="btn" type="button" onClick={logout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </section>

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
