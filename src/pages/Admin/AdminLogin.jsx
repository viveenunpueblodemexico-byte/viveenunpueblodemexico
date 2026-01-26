import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import Container from "../../components/layout/Container/Container";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin/ofertas";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onLogin() {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e?.message || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "24px 0" }}>
      <Container>
        <h1 style={{ marginBottom: 8 }}>Admin</h1>
        <p style={{ marginBottom: 16 }}>
          Inicia sesión con Google para moderar ofertas.
        </p>

        {error ? (
          <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div>
        ) : null}

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn btn--primary" onClick={onLogin} disabled={loading}>
            {loading ? "Entrando…" : "Entrar con Google"}
          </button>
          <Link className="btn" to="/">
            Volver al sitio
          </Link>
        </div>
      </Container>
    </main>
  );
}
