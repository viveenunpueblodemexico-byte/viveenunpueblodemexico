import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pueblos from "./pages/Pueblos";
import PuebloDetalle from "./pages/PuebloDetalle";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pueblos" element={<Pueblos />} />
      <Route path="/pueblo/:slug" element={<PuebloDetalle />} />

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
