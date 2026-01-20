import { NavLink } from "react-router-dom";
import { useState } from "react";
import Container from "../Container/Container";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="siteHeader">
      <Container className="siteHeader__inner">
        {/* Brand */}
        <NavLink to="/" className="siteHeader__brand" onClick={() => setOpen(false)}>
          <span className="siteHeader__mark" aria-hidden="true">🌿</span>
          <span className="siteHeader__name">Vive en un Pueblo</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="siteHeader__nav" aria-label="Navegación principal">
          <NavLink to="/pueblos" className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}>
            Pueblos
          </NavLink>
          <NavLink to="/trabajo" className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}>
            Trabajo
          </NavLink>
          <NavLink to="/vivienda" className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}>
            Vivienda
          </NavLink>
          <NavLink to="/traspasos" className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}>
            Traspasos
          </NavLink>
          <NavLink to="/acerca" className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}>
            Acerca de
          </NavLink>
        </nav>

        {/* CTAs desktop */}
        <div className="siteHeader__cta">
          <NavLink to="/pueblos" className="siteHeader__btn siteHeader__btn--ghost">
            Explorar
          </NavLink>
          <a href="#newsletter" className="siteHeader__btn siteHeader__btn--primary">
            Recibir novedades
          </a>
        </div>

        {/* Hamburger */}
        <button
          type="button"
          className="siteHeader__hamburger"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </Container>

      {/* Mobile panel */}
      {open && (
        <div className="siteHeader__mobile">
          <Container>
            <div className="siteHeader__mobileLinks">
              <NavLink to="/pueblos" className={({ isActive }) => `siteHeader__mobileLink ${isActive ? "is-active" : ""}`} onClick={() => setOpen(false)}>
                Pueblos
              </NavLink>
              <NavLink to="/trabajo" className={({ isActive }) => `siteHeader__mobileLink ${isActive ? "is-active" : ""}`} onClick={() => setOpen(false)}>
                Trabajo
              </NavLink>
              <NavLink to="/vivienda" className={({ isActive }) => `siteHeader__mobileLink ${isActive ? "is-active" : ""}`} onClick={() => setOpen(false)}>
                Vivienda
              </NavLink>
              <NavLink to="/traspasos" className={({ isActive }) => `siteHeader__mobileLink ${isActive ? "is-active" : ""}`} onClick={() => setOpen(false)}>
                Traspasos
              </NavLink>
              <NavLink to="/acerca" className={({ isActive }) => `siteHeader__mobileLink ${isActive ? "is-active" : ""}`} onClick={() => setOpen(false)}>
                Acerca de
              </NavLink>
            </div>

            <div className="siteHeader__mobileCta">
              <NavLink to="/pueblos" className="siteHeader__btn siteHeader__btn--ghost" onClick={() => setOpen(false)}>
                Explorar
              </NavLink>
              <a href="#newsletter" className="siteHeader__btn siteHeader__btn--primary" onClick={() => setOpen(false)}>
                Recibir novedades
              </a>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
