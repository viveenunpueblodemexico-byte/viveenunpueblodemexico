import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Container from "../Container/Container";
import "./SiteHeader.css";

import { useAuth } from "../../../auth/AuthProvider";

const NAV_LINKS = [
  { to: "/estados", label: "Estados" },
  { to: "/pueblos", label: "Pueblos" },
  { to: "/trabajo", label: "Trabajo" },
  { to: "/vivienda", label: "Vivienda" },
  { to: "/traspasos", label: "Traspasos" },
  { to: "/acerca", label: "Acerca de" },
];


export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
  const onResize = () => {
    if (window.innerWidth > 900) {
      setOpen(false);
    }
  };

  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}, []);

  const profilePhoto = user?.photoURL || null;
  const profileName = user?.displayName || user?.email || "Mi perfil";
  const profileRoute = isAdmin ? "/admin" : "/mis-publicaciones";

  async function onLogout() {
    await logout();
    setOpen(false);
  }


  return (
    <header className="siteHeader">
      <Container className="siteHeader__inner">
        {/* Brand */}
        <NavLink to="/" className="siteHeader__brand" onClick={() => setOpen(false)} aria-label="Ir al inicio">
          <img
            src="/logo-pueblos.png"
            alt="Vive en un Pueblo de México"
            className="siteHeader__logo"
          />
        </NavLink>

        {/* Desktop nav */}
        <nav className="siteHeader__nav" aria-label="Navegación principal">
        {NAV_LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `siteHeader__link ${isActive ? "is-active" : ""}`}>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* CTAs desktop */}
        <div className="siteHeader__cta">
          <NavLink to="/estados" className="siteHeader__btn siteHeader__btn--ghost">
            Explorar
          </NavLink>

          <a href="#newsletter" className="siteHeader__btn siteHeader__btn--primary">
            Recibir novedades
          </a>

          {!user ? (
            <NavLink to="/login" className="siteHeader__btn siteHeader__btn--ghost">
              Iniciar sesión
            </NavLink>
                      ) : (
            <>
              <button type="button" className="siteHeader__btn siteHeader__btn--ghost" onClick={onLogout}>
                Cerrar sesión
              </button>
              <NavLink
                to={profileRoute}
                className="siteHeader__profile"
                aria-label={`Abrir perfil de ${profileName}`}
                title={profileName}
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="siteHeader__profileImage"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="siteHeader__profileFallback" aria-hidden="true">
                    {profileName.charAt(0).toUpperCase()}
                  </span>
                )}
              </NavLink>
            </>

          )}
        </div>

      {/* Hamburger */}
        <button
          type="button"
          className={`siteHeader__hamburger ${open ? "is-open" : ""}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
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
            {user && (
              <div className="siteHeader__mobileProfile">
                <NavLink
                  to={profileRoute}
                  className="siteHeader__mobileProfileLink"
                  onClick={() => setOpen(false)}
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={profileName}
                      className="siteHeader__mobileProfileImage"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="siteHeader__mobileProfileFallback" aria-hidden="true">
                      {profileName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="siteHeader__mobileProfileText">{profileName}</span>
                </NavLink>
              </div>
            )}

            <div className="siteHeader__mobileLinks">
                          {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `siteHeader__mobileLink ${isActive ? "is-active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="siteHeader__mobileCta">
              <NavLink to="/estados" className="siteHeader__btn siteHeader__btn--ghost" onClick={() => setOpen(false)}>
                Explorar
              </NavLink>
              <a href="#newsletter" className="siteHeader__btn siteHeader__btn--primary" onClick={() => setOpen(false)}>
                Recibir novedades
              </a>

              {!user ? (
                <NavLink to="/login" className="siteHeader__btn siteHeader__btn--ghost" onClick={() => setOpen(false)}>
                  Iniciar sesión
                </NavLink>
              ) : (
                <button type="button" className="siteHeader__btn siteHeader__btn--ghost" onClick={onLogout}>
                  Cerrar sesión
                </button>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
