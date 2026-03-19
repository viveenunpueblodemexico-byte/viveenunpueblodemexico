import { Link, NavLink } from "react-router-dom";
import Container from "../Container/Container";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <Container className="siteFooter__inner">
        <Link to="/" className="siteFooter__left" aria-label="Ir al inicio">
          <img
            src="/pueblos-iso.png"
            alt="Vive en un Pueblo de México"
            className="siteFooter__logo"
          />

          <span className="siteFooter__brandText">
            <span className="siteFooter__brandTitle">Vive en un Pueblo</span>
            <span className="siteFooter__brandSub">de México</span>
          </span>
        </Link>

        <nav className="siteFooter__nav" aria-label="Enlaces del pie">
          <NavLink className="siteFooter__link" to="/pueblos">Pueblos</NavLink>
          <NavLink className="siteFooter__link" to="/trabajo">Trabajo</NavLink>
          <NavLink className="siteFooter__link" to="/vivienda">Vivienda</NavLink>
          <NavLink className="siteFooter__link" to="/traspasos">Traspasos</NavLink>
          <NavLink className="siteFooter__link" to="/acerca">Acerca</NavLink>
          <NavLink className="siteFooter__link" to="/privacidad">Privacidad</NavLink>
          <NavLink className="siteFooter__link" to="/terminos">Términos</NavLink>
          <NavLink className="siteFooter__link" to="/cookies">Cookies</NavLink>
        </nav>
      </Container>
    </footer>
  );
}
