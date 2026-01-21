import { Link, NavLink } from "react-router-dom";
import Container from "../Container/Container";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <Container className="siteFooter__inner">
        <Link to="/" className="siteFooter__left" aria-label="Ir al inicio">
          <span className="siteFooter__brand">
            <span className="siteFooter__leaf" aria-hidden="true">🌿</span>
            Vive en un Pueblo
          </span>
          <span className="siteFooter__note">mock visual</span>
        </Link>

        <nav className="siteFooter__nav" aria-label="Enlaces del pie">
          <NavLink className="siteFooter__link" to="/pueblos">Pueblos</NavLink>
          <NavLink className="siteFooter__link" to="/trabajo">Trabajo</NavLink>
          <NavLink className="siteFooter__link" to="/vivienda">Vivienda</NavLink>
          <NavLink className="siteFooter__link" to="/traspasos">Traspasos</NavLink>
          <NavLink className="siteFooter__link" to="/acerca">Acerca</NavLink>
        </nav>
      </Container>
    </footer>
  );
}
