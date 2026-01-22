// src/pages/Trabajo/Trabajo.jsx
import { Link } from "react-router-dom";
import Container from "../../components/layout/Container/Container"; // ajusta ruta si aplica
import "./trabajo.css";

export default function Trabajo() {
  return (
    <main className="trabajoPage">
      <Container>
        <div className="trabajoTop">
          <div className="trabajoActions">
            <Link to="/pueblos" className="btn">
              Explorar pueblos
            </Link>

            <Link to="/" className="btn">
              Volver al inicio
            </Link>

            <Link to="/trabajo/publicar" className="btn btn--primary">
              Publicar oferta
            </Link>
          </div>
        </div>

        <header className="trabajoHeader">
          <h1 className="trabajoTitle">Trabajo — Próximamente…</h1>
          <p className="text-gray-600 text-center max-w-prose mx-auto">
            Estamos preparando la Bolsa de Trabajo para pueblos de México. Muy pronto podrás
            explorar oportunidades locales, remotas y proyectos comunitarios.
          </p>

        </header>
      </Container>
    </main>
  );
}
