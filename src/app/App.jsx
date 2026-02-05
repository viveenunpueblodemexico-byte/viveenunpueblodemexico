import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteHeader from "../components/layout/SiteHeader/SiteHeader";
import SiteFooter from "../components/layout/SiteFooter/SiteFooter";

import Home from "../pages/Home/Home";
import Estados from "../pages/Estados/Estados";
import Estado from "../pages/Estado/Estado";
import Pueblos from "../pages/Pueblos/Pueblos";
import PuebloDetalle from "../pages/PuebloDetalle/PuebloDetalle";

import AdminLogin from "../pages/Admin/AdminLogin";
import AdminOfertas from "../pages/Admin/AdminOfertas";
import RequireAdmin from "../components/auth/RequireAdmin";

import Trabajo from "../pages/Trabajo/Trabajo";
import TrabajoPublicar from "../pages/Trabajo/TrabajoPublicar";
import Vivienda from "../pages/Vivienda/Vivienda";
import Traspasos from "../pages/Traspasos/Traspasos";
import ViviendaPublicar from "../pages/Vivienda/ViviendaPublicar";
import TraspasosPublicar from "../pages/Traspasos/TraspasosPublicar";

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
        <Route path="/vivienda/publicar" element={<ViviendaPublicar />} />
        <Route path="/traspasos" element={<Traspasos />} />
        <Route path="/traspasos/publicar" element={<TraspasosPublicar />} />


        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/ofertas"
          element={
            <RequireAdmin>
              <AdminOfertas />
            </RequireAdmin>
          }
        />


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