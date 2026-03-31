import { Link } from "react-router-dom";
import Container from "../layout/Container/Container";
import "./AuthWindow.css";

export default function AuthWindow({
  title,
  subtitle,
  error,
  loading,
  primaryLabel,
  onPrimary,
  secondaryTo,
  secondaryLabel,
}) {
  return (
    <main className="authWindowPage">
      <Container>
        <section className="authWindow" role="dialog" aria-labelledby="auth-window-title" aria-modal="false">
          <img src="/logo-pueblos.png" alt="Vive en un Pueblo de México" className="authWindow__logo" />
          <h1 id="auth-window-title" className="authWindow__title">{title}</h1>
          <p className="authWindow__subtitle">{subtitle}</p>

          {error ? <p className="authWindow__error">{error}</p> : null}

          <div className="authWindow__actions">
            <button className="btn btn--primary" onClick={onPrimary} disabled={loading}>
              {loading ? "Entrando…" : primaryLabel}
            </button>
            <Link className="btn" to={secondaryTo}>
              {secondaryLabel}
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}