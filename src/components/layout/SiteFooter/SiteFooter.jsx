import Container from "../Container/Container";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="siteFooter">
      <Container className="siteFooter__inner">
        <div className="siteFooter__left">
          <span className="siteFooter__brand">🌿 Vive en un Pueblo</span>
          <span className="siteFooter__note">mock visual</span>
        </div>

        <nav className="siteFooter__nav" aria-label="Enlaces del pie">
          <a className="siteFooter__link" href="/pueblos">Pueblos</a>
          <a className="siteFooter__link" href="/trabajo">Trabajo</a>
          <a className="siteFooter__link" href="/vivienda">Vivienda</a>
          <a className="siteFooter__link" href="/traspasos">Traspasos</a>
          <a className="siteFooter__link" href="/acerca">Acerca</a>
        </nav>
      </Container>
    </footer>
  );
}
