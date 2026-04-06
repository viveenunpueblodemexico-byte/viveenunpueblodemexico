import { useEffect } from "react";
import { Link } from "react-router-dom";
import { buildAbsoluteUrl, clearManagedSEO, setPageSEO } from "../../utils/seo";
import "./faq.css";

const FAQ_ITEMS = [
  {
    q: "¿Qué es Vive en un Pueblo de México?",
    a: "Es una plataforma para descubrir pueblos y oportunidades de trabajo, vivienda y traspasos.",
  },
  {
    q: "¿Necesito cuenta para explorar?",
    a: "No. Puedes explorar sin cuenta. Solo necesitas iniciar sesión para publicar.",
  },
  {
    q: "¿Cómo publico una oferta?",
    a: "Ve a Trabajo, Vivienda o Traspasos y entra a Publicar. Inicia sesión con Google para completar el formulario.",
  },
  {
    q: "¿Las publicaciones se moderan?",
    a: "Sí. Existe un panel de moderación para revisar y aprobar contenido antes de su visibilidad total.",
  },
  {
    q: "¿Puedo editar mi publicación?",
    a: "Sí. Desde tu sección de Mis publicaciones puedes gestionar tus ofertas.",
  },
  {
    q: "¿Cómo puedo registrar mi municipio?",
    a: "Usa el formulario de Registrar municipio para que el equipo te contacte.",
  },
  {
    q: "¿El uso tiene costo?",
    a: "En esta etapa inicial, la exploración y publicación comunitaria está planteada como acceso abierto.",
  },
];

export default function Faq() {
  useEffect(() => {
    setPageSEO({
      title: "Preguntas frecuentes | Vive en un Pueblo de México",
      description:
        "Resuelve dudas sobre publicaciones, moderación, seguridad y uso de la plataforma Vive en un Pueblo de México.",
      url: buildAbsoluteUrl("/faq"),
      type: "website",
    });

    return () => clearManagedSEO();
  }, []);

  return (
    <main className="faqPage">
      <section className="faqPage__hero">
        <h1 className="faqPage__title">Preguntas frecuentes</h1>
        <p className="faqPage__sub">
          Aquí resolvemos lo más común sobre publicaciones, moderación y uso general de la plataforma.
        </p>
      </section>

      <section className="faqPage__grid" aria-label="Listado de preguntas frecuentes">
        {FAQ_ITEMS.map((item) => (
          <article key={item.q} className="faqPage__item">
            <h2>{item.q}</h2>
            <p>{item.a}</p>
          </article>
        ))}
      </section>

      <div className="faqPage__actions">
        <Link className="btn" to="/registrar-municipio">
          Registrar municipio
        </Link>
        <Link className="btn" to="/pueblos">
          Ver catálogo
        </Link>
      </div>
    </main>
  );
}