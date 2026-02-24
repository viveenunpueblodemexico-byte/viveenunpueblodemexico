import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container/Container";
import { useAuth } from "../../auth/AuthProvider";

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onLogin() {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
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
        <h1 style={{ marginBottom: 8 }}>Inicia sesión</h1>
        <p style={{ marginBottom: 16 }}>
          Para publicar, inicia sesión con Google.
        </p>

        {error ? <div style={{ marginBottom: 12, color: "crimson" }}>{error}</div> : null}

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn btn--primary" onClick={onLogin} disabled={loading}>
            {loading ? "Entrando…" : "Entrar con Google"}
          </button>
          <Link className="btn" to="/">Volver</Link>
        </div>
      </Container>
    </main>
  );
}
