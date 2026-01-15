import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pueblos from "./pages/Pueblos";
import PuebloDetalle from "./pages/PuebloDetalle";
import Trabajo from "./pages/Trabajo";
import Vivienda from "./pages/Vivienda";
import Traspasos from "./pages/Traspasos";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pueblos" element={<Pueblos />} />
      <Route path="/pueblo/:slug" element={<PuebloDetalle />} />

      <Route path="/trabajo" element={<Trabajo />} />
      <Route path="/vivienda" element={<Vivienda />} />
      <Route path="/traspasos" element={<Traspasos />} />

      <Route
        path="*"
        element={
          <div style={{ padding: 24, fontFamily: "system-ui" }}>
            <h2>No encontrado</h2>
          </div>
        }
      />
    </Routes>
  );
}
