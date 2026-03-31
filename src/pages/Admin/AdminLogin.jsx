import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import AuthWindow from "../../components/auth/AuthWindow";

export default function AdminLogin() {
  const { loginWithGoogle } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <AuthWindow
        title="Acceso admin"
        subtitle="Inicia sesión con Google para moderar ofertas y foro."
        error={error}
        loading={loading}
        primaryLabel="Inicia sesión con Google"
        onPrimary={onLogin}
        secondaryTo="/"
        secondaryLabel="Volver al sitio"
      />
  );
}
