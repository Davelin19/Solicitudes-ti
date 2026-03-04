import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/MainLayout";

import Login from "./pages/Login";
import MisSolicitudes from "./pages/MisSolicitudes";
import NuevaSolicitud from "./pages/NuevaSolicitud";
import GestionSolicitudes from "./pages/GestionSolicitudes";
import MisActividades from "./pages/MisActividades";
import NuevaActividad from "./pages/NuevaActividad";
import Historial from "./pages/Historial";
import Equipo from "./pages/Equipo";
import EditarAvance from "./pages/EditarAvance";
import VerActividad from "./pages/VerActividad";
import EditarActividad from "./pages/EditarActividad";
import SolicitudesPendientes from "./pages/SolicitudesPendientes";
import VerSolicitudPage from "./pages/VerSolicitudPage";
import MainLayout from "./layouts/MainLayout";
import CrearActividadHija from "./pages/CrearActividadHija";
import MisActividadescopy from "./pages/MisActividadescopy";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN → SIN SIDEBAR */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* SISTEMA → CON SIDEBAR */}
        <Route element={<MainLayout />}>
          <Route path="/solicitudes" element={<MisSolicitudes />} />
          <Route path="/nueva-solicitud" element={<NuevaSolicitud />} />
          <Route path="/gestion" element={<GestionSolicitudes />} />
          <Route path="/solicitudes-pendientes"element={<SolicitudesPendientes />} />
          <Route path="/solicitudes/ver/:id" element={<VerSolicitudPage />} />


          {/* ACTIVIDADES */}
          <Route path="/actividades" element={<MisActividades />} />
          <Route path="/nueva-actividad/:solicitudId" element={<NuevaActividad />} />
          <Route path="/actividades/ver/:id" element={<VerActividad />} />
          <Route path="/actividades/editar/:id" element={<EditarActividad />} />
          <Route path="/actividades/hija/editar/:id" element={<EditarAvance />} />
          <Route path="/solicitudes/:solicitudId/crear-hija" element={<CrearActividadHija />} />
          <Route path="/gestion-actividades" element={<MisActividadescopy />} />

          <Route path="/historial" element={<Historial />} />
          <Route path="/equipo" element={<Equipo />} />
        </Route>

        {/* CUALQUIER OTRA → LOGIN */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
