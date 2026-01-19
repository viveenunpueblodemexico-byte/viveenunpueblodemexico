import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteHeader from "../components/layout/SiteHeader/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter/SiteFooter";

import Home from "../pages/Home/Home";
import Pueblos from "../pages/Pueblos/Pueblos";
import PuebloDetalle from "../pages/PuebloDetalle/PuebloDetalle";
import Trabajo from "../pages/Trabajo/Trabajo";
import Vivienda from "../pages/Vivienda/Vivienda";
import Traspasos from "../pages/Traspasos/Traspasos";

export default function App() {
  return (
    <BrowserRouter>
      <SiteHeader />

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

      <SiteFooter />
    </BrowserRouter>
  );
}
