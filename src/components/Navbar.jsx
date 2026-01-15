import { Link, useLocation } from "react-router-dom";

const linkStyle = (active) => ({
  textDecoration: "none",
  opacity: active ? 1 : 0.82,
  fontWeight: active ? 600 : 500,
});

export default function Navbar() {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <nav
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Marca / Inicio */}
        <Link to="/" style={{ textDecoration: "none", fontWeight: 700 }}>
          Vive en un Pueblo
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Link to="/pueblos" style={linkStyle(isActive("/pueblos"))}>
            Pueblos
          </Link>
          <Link to="/trabajo" style={linkStyle(isActive("/trabajo"))}>
            Trabajo
          </Link>
          <Link to="/vivienda" style={linkStyle(isActive("/vivienda"))}>
            Vivienda
          </Link>
          <Link to="/traspasos" style={linkStyle(isActive("/traspasos"))}>
            Traspasos
          </Link>
        </div>
      </nav>
    </header>
  );
}
