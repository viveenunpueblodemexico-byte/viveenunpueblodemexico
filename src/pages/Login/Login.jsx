import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import AuthWindow from "../../components/auth/AuthWindow";

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
        if (e?.code === "auth/popup-closed-by-user") {
        setError("");
        return;
      }
      setError("No se pudo iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthWindow
      title="Inicia sesión"
      subtitle="Para publicar, inicia sesión con Google."
      error={error}
      loading={loading}
      primaryLabel="Inicia sesión con Google"
      onPrimary={onLogin}
      secondaryTo="/"
      secondaryLabel="Volver"
    />
  );
}
