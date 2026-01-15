import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPueblosPublicados } from "../services/pueblos";
import PuebloCard from "../components/PuebloCard";
import { setPageSEO, buildAbsoluteUrl, clearManagedSEO } from "../utils/seo";
import Navbar from "../components/Navbar";

export default function Pueblos() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEO + OG
    setPageSEO({
      title: "Catálogo de pueblos para vivir en México | Vive en un Pueblo",
      description:
        "Explora pueblos publicados en el catálogo. Encuentra comunidades con calidad de vida y oportunidades locales.",
      url: buildAbsoluteUrl("/pueblos"),
      type: "website",
    });


     
    async function loadPueblos() {
      setLoading(true);
      setError("");

      try {
        const data = await getPueblosPublicados({ max: 100 });
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError(err?.message || "Error al leer Firestore");
      } finally {
        setLoading(false);
      }
    }

    loadPueblos();

    return () => {
      clearManagedSEO();
    };
  }, []);

  return (
    
    <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 980, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <Navbar />
          <h1 style={{ margin: 0 }}>Catálogo de pueblos</h1>
          <p style={{ opacity: 0.85, marginTop: 8, lineHeight: 1.5 }}>
            Pueblos publicados y curados. Abre una ficha para ver detalles, imágenes y oportunidades.
          </p>
        </div>

        <Link to="/" style={{ opacity: 0.85 }}>
          Volver
        </Link>
      </div>

      {error && (
        <div style={{ color: "red", marginTop: 12 }}>Error: {error}</div>
      )}

      {loading && !error && <p style={{ marginTop: 12 }}>Cargando...</p>}

      {!loading && !error && pueblos.length === 0 && (
        <p style={{ marginTop: 12 }}>Aún no hay pueblos publicados.</p>
      )}

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gap: 14,
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {pueblos.map((p) => (
          <Link
            key={p.id}
            to={`/pueblo/${p.slug || p.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <PuebloCard pueblo={p} />
          </Link>
        ))}
      </div>
    </div>
  );
}
