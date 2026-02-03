import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

function parseAllowlist() {
  const raw = (import.meta.env.VITE_ADMIN_EMAILS || "").trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const allow = useMemo(() => parseAllowlist(), []);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Cargando…</div>;


  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  const email = (user.email || "").toLowerCase();
  console.log("Pv5fo9NYXqUhY9Av9qQQLsi3Vk42", user?.uid);
 console.log("ADMIN CHECK user.email =", email);
 console.log("ADMIN ALLOWLIST =", allow);


  const isAllowed = allow.length === 0 ? false : allow.includes(email);

  if (!isAllowed) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Acceso denegado</h2>
        <p>Este usuario no está en la lista de administradores.</p>
        <button className="btn" onClick={() => signOut(auth)}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return children;
}
