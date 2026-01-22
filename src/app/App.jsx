import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteHeader from "../components/layout/SiteHeader/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter/SiteFooter";

import Home from "../pages/Home/Home";
import Estados from "../pages/Estados/Estados";
import Estado from "../pages/Estado/Estado";
import Pueblos from "../pages/Pueblos/Pueblos";
import PuebloDetalle from "../pages/PuebloDetalle/PuebloDetalle";
import Trabajo from "../pages/Trabajo/Trabajo";
import TrabajoPublicar from "../pages/Trabajo/TrabajoPublicar";
import Vivienda from "../pages/Vivienda/Vivienda";
import Traspasos from "../pages/Traspasos/Traspasos";

export default function App() {
  return (
    <BrowserRouter>
    <div className="appShell">
      <SiteHeader />

       <main className="appMain">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estados" element={<Estados />} />
        <Route path="/estado/:estadoSlug" element={<Estado />} />

        <Route path="/pueblos" element={<Pueblos />} />
        <Route path="/pueblo/:slug" element={<PuebloDetalle />} />

        <Route path="/trabajo" element={<Trabajo />} />
        <Route path="/trabajo/publicar" element={<TrabajoPublicar />} />
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
       </main>

        <SiteFooter />
      </div>
    </BrowserRouter>
  );
}