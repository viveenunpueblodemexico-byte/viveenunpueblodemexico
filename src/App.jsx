import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [pueblos, setPueblos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPueblos() {
      try {
        const snap = await getDocs(collection(db, "pueblos"));
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPueblos(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al leer Firestore");
      }
    }

    loadPueblos();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Vive en un Pueblo de México</h1>

      {error && (
        <div style={{ color: "red", marginTop: 12 }}>
          Error: {error}
        </div>
      )}

      <h2 style={{ marginTop: 20 }}>Pueblos</h2>

      {pueblos.length === 0 && !error && <p>Cargando...</p>}

      <ul>
        {pueblos.map((pueblo) => (
          <li key={pueblo.id} style={{ marginBottom: 12 }}>
            <strong>{pueblo.nombre}</strong> — {pueblo.estado}
            <br />
            <small>{pueblo.descripcionCorta}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
