import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

function linkStyle({ isActive }) {
  return {
    padding: "8px 12px",
    borderRadius: 999,
    textDecoration: "none",
    border: "1px solid rgba(0,0,0,0.12)",
    background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
    color: "inherit",
    fontWeight: 700,
    fontSize: 13,
  };
}

export default function AdminLayout() {
  const navigate = useNavigate();

  async function onLogout() {
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  }

  return (
    <div style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Panel admin</h2>
          <div className="muted" style={{ marginTop: 6 }}>Moderación y gestión.</div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <NavLink to="/admin/ofertas" style={linkStyle}>Ofertas</NavLink>
          <NavLink to="/admin/foro" style={linkStyle}>Foro</NavLink>

          <button className="btn btn--ghost" onClick={() => navigate("/")}>Ir al sitio</button>
          <button className="btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Outlet />
      </div>
    </div>
  );
}