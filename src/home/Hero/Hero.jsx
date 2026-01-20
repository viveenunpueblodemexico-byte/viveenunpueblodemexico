import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./hero.css";

export default function Hero() {
  const tabs = useMemo(
    () => [
      {
        key: "vivir",
        label: "Para vivir",
        rows: [
          { title: "Calidad de vida", text: "Clima, tranquilidad y ritmo más humano." },
          { title: "Costos más accesibles", text: "Vivienda y servicios con mejor balance." },
          { title: "Conectividad", text: "Recomendaciones para trabajo remoto y servicios." },
        ],
      },
      {
        key: "trabajar",
        label: "Para trabajar",
        rows: [
          { title: "Trabajo remoto", text: "Conectividad, espacios tranquilos y ritmo sostenible." },
          { title: "Oportunidades", text: "Servicios, comercio, turismo y oficios locales." },
          { title: "Movilidad", text: "Accesos, rutas y cercanía a ciudades clave." },
        ],
      },
      {
        key: "emprender",
        label: "Para emprender",
        rows: [
          { title: "Negocios locales", text: "Ideas alineadas a la economía de cada región." },
          { title: "Turismo y experiencias", text: "Productos y servicios para visitantes y comunidad." },
          { title: "Comunidad", text: "Redes y colaboración para crecer acompañado." },
        ],
      },
    ],
    []
  );

  const [active, setActive] = useState("vivir");
  const activeTab = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <section className="hero">
      <div className="hero__grid">
        {/* Columna izquierda */}
        <div className="hero__left">
          <div className="hero__pill">
            <span className="hero__pillIcon" aria-hidden="true">🌿</span>
            <span>Descubre pueblos con calidad de vida</span>
          </div>

          <h1 className="hero__title">Vive en un pueblo de México</h1>

          <p className="hero__subtitle">
            Descubre comunidades con buena calidad de vida y oportunidades locales.
            Empieza por el catálogo y explora lo más destacado.
          </p>

          <div className="hero__cta">
            <Link className="btn btn--primary" to="/pueblos">
              Ver catálogo
            </Link>

            <a className="btn btn--ghost" href="#destacados">
              Explorar destacados
            </a>
          </div>

          <div className="hero__miniGrid">
            <div className="hero__miniCard">
              <div className="hero__miniTitle">Catálogo</div>
              <div className="hero__miniText">Pueblos curados y en crecimiento</div>
            </div>

            <div className="hero__miniCard">
              <div className="hero__miniTitle">Oportunidades</div>
              <div className="hero__miniText">Trabajo, vivienda y traspasos</div>
            </div>

            <div className="hero__miniCard">
              <div className="hero__miniTitle">Comunidad</div>
              <div className="hero__miniText">Guías, tips y novedades</div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="hero__right">
          <div className="hero__panel">
            <div className="hero__tabs" role="tablist" aria-label="Secciones del panel">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  className={`hero__tab ${active === t.key ? "is-active" : ""}`}
                  type="button"
                  role="tab"
                  aria-selected={active === t.key}
                  onClick={() => setActive(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="hero__panelBody">
              {activeTab.rows.map((r) => (
                <div className="hero__row" key={r.title}>
                  <div className="hero__rowTitle">{r.title}</div>
                  <div className="hero__rowText">{r.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
