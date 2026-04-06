import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosDestacados } from "../../services/pueblos";
import PuebloCard from "../../components/PuebloCard";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../../utils/seo";
import Container from "../../components/layout/Container/Container";
import Hero from "../../home/Hero/Hero";
import { useAuth } from "../../auth/AuthProvider";
import { subscribeNewsletter } from "../../services/newsletter";
import { trackEvent } from "../../services/telemetry";
import puebloBannerVideo from "../../assets/Peaceful Mexican Town Website Banner_720p.mp4";

import "./home.css";

const TESTIMONIOS = [
  {
    autor: "Mariana, Oaxaca",
    texto: "Encontré una renta accesible y pude mudarme en menos de un mes.",
  },
  {
    autor: "Luis, Jalisco",
    texto: "Publicamos una vacante local y en 48h ya teníamos candidatos.",
  },
  {
    autor: "Ana, Yucatán",
    texto: "El catálogo nos ayudó a comparar pueblos con más claridad.",
  },
];


export default function Home() {
  const { user, loginWithGoogle, logout, isAdmin } = useAuth();

  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [newsletterSending, setNewsletterSending] = useState(false);

  useEffect(() => {
   
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


    async function onNewsletterSubmit(e) {
    e.preventDefault();
    setNewsletterMsg("");
    setNewsletterSending(true);

    try {
      await subscribeNewsletter({
        email: newsletterEmail,
        acceptedTerms: newsletterConsent,
        source: "home",
      });

      await trackEvent("subscribe_newsletter", { source: "home" });

      setNewsletterEmail("");
      setNewsletterConsent(false);
      setNewsletterMsg("¡Gracias! Ya te suscribiste a novedades.");
    } catch (err) {
      setNewsletterMsg(err?.message || "No se pudo completar la suscripción.");
    } finally {
      setNewsletterSending(false);
    }
  }

  return (

      <main className="home">
      <Container>
        <Hero />


        <section className="home__authCta" aria-label="Iniciar sesión">
  {!user ? (
            <div className="home__authCard home__authCard--videoBg">
              <video className="home__authBgVideo" autoPlay muted loop playsInline preload="metadata">
                <source src={puebloBannerVideo} type="video/mp4" />
              </video>

              <div className="home__authBgOverlay" />

              <div className="home__authContent">
                <h2 className="home__authTitle">Publica oportunidades</h2>
                <p className="home__authSub">
                  Inicia sesión con Google para publicar trabajo, vivienda o traspasos y ver tus publicaciones.
                </p>

                <div className="home__authActions">
                  <button
                    className="btnPrimary"
                    type="button"
                    onClick={async () => {
                      await trackEvent("click_publicar", { source: "home_login_cta" });
                      await loginWithGoogle();
                    }}
                  >
                    Iniciar con Google
                  </button>
                  <Link className="btn" to="/trabajo" onClick={() => trackEvent("click_publicar", { source: "home_trabajo_link" })}>
                    Ver oportunidades
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="home__authCard home__authCard--videoBg">
              <video className="home__authBgVideo" autoPlay muted loop playsInline preload="metadata">
                <source src={puebloBannerVideo} type="video/mp4" />
              </video>

              <div className="home__authBgOverlay" />

              <div className="home__authContent">
                <h2 className="home__authTitle">Bienvenido</h2>
                <p className="home__authSub">
                  Sesión iniciada: <b>{user.email || "Cuenta Google"}</b>
                </p>

                <div className="home__authActions">
                  <Link className="btnPrimary" to="/mis-publicaciones" onClick={() => trackEvent("click_publicar", { source: "home_mis_publicaciones" })}>
                    Mis publicaciones
                  </Link>

                  {isAdmin ? (
                    <Link className="btn" to="/admin">
                      Panel admin
                    </Link>
                  ) : null}

                  <button className="btn" type="button" onClick={logout}>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section id="destacados" className="home__section">
          <h2 className="home__sectionTitle">Destacados</h2>

          {loading && !error && <p className="home__status">Cargando...</p>}
          {error && <p className="home__status home__status--error">{error}</p>}

          {!loading && !error && pueblos.length === 0 && <p className="home__status">Aún no hay pueblos destacados.</p>}

          <div className="home__carousel">
            {pueblos.map((p) => (
              <Link
                key={p.id}
                to={`/pueblo/${p.slug || p.id}`}
                className="home__cardLink"
                onClick={() => trackEvent("view_pueblo", { source: "home_destacados", puebloId: p.id, puebloSlug: p.slug || p.id })}
              >
                <PuebloCard pueblo={p} />
              </Link>
            ))}
          </div>
        </section>

        <section className="home__testimonios" aria-label="Testimonios">
          <h2 className="home__sectionTitle">Historias de la comunidad</h2>
          <div className="home__testimoniosGrid">
            {TESTIMONIOS.map((t) => (
              <article key={t.autor} className="home__testimonioCard">
                <p className="home__testimonioText">“{t.texto}”</p>
                <p className="home__testimonioAutor">— {t.autor}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="newsletter" className="home__newsletter" aria-label="Newsletter">
          <h2 className="home__sectionTitle">Recibe novedades</h2>
          <p className="home__newsletterText">Te enviaremos noticias de pueblos, nuevas oportunidades y lanzamientos.</p>

          <form className="home__newsletterForm" onSubmit={onNewsletterSubmit}>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />

            <label className="home__newsletterConsent">
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
              />
              Acepto el aviso de privacidad.
            </label>

            <button type="submit" className="btnPrimary" disabled={newsletterSending}>
              {newsletterSending ? "Enviando..." : "Suscribirme"}
            </button>
          </form>

          {newsletterMsg ? <p className="home__newsletterMsg">{newsletterMsg}</p> : null}

          <div className="home__newsletterLinks">
            <Link className="btn" to="/faq">
              Ver FAQ
            </Link>
          <Link className="btn" to="/registrar-municipio">
              Soy municipio
            </Link>
                    </div>
        </section>
      </Container>
    </main>
  );

}
