import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "../Container/Container";
import "./siteHeader.css";

const navItems = [
  { to: "/pueblos", label: "Pueblos" },
  { to: "/trabajo", label: "Trabajo" },
  { to: "/vivienda", label: "Vivienda" },
  { to: "/traspasos", label: "Traspasos" },
  { to: "/acerca", label: "Acerca de" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="siteHeader" role="banner">
      <Container className="siteHeader__inner">
        {/* Brand */}
        <Link className="siteHeader__brand" to="/" onClick={close}>
          <span className="siteHeader__mark" aria-hidden="true">
            🌿
          </span>
          <span className="siteHeader__name">Vive en un Pueblo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="siteHeader__nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `siteHeader__link ${isActive ? "is-active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* CTAs */}
        <div className="siteHeader__cta">
          <Link className="siteHeader__btn siteHeader__btn--ghost" to="/pueblos">
            Explorar
          </Link>

          {/* Esto lo conectamos luego a tu sección Newsletter */}
          <a className="siteHeader__btn siteHeader__btn--primary" href="#newsletter">
            Recibir novedades
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="siteHeader__hamburger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="siteHeaderMobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </Container>

      {/* Mobile panel */}
      <div
        id="siteHeaderMobile"
        className={`siteHeader__mobile ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <Container className="siteHeader__mobileInner">
          <div className="siteHeader__mobileLinks">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  `siteHeader__mobileLink ${isActive ? "is-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="siteHeader__mobileCta">
            <Link
              className="siteHeader__btn siteHeader__btn--ghost"
              to="/pueblos"
              onClick={close}
            >
              Explorar
            </Link>
            <a
              className="siteHeader__btn siteHeader__btn--primary"
              href="#newsletter"
              onClick={close}
            >
              Recibir novedades
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}
