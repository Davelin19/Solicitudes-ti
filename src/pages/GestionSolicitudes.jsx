import { useState, useEffect } from "react";
import "../assets/css/gestionSolicitudes.css";
import ModalVerGestionSolicitud from "../components/ModalVerGestionSolicitud";

const API_BASE = "https://cv8qdx88-3000.use2.devtunnels.ms/api";

export default function GestionSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/solicitudes`)
      .then(res => res.json())
      .then(data => setSolicitudes(data))
      .catch(err => console.error("Error cargando datos:", err))
      .finally(() => setLoading(false));
  }, []);

  const abrirModal = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSolicitudSeleccionada(null);
  };

  if (loading) return <div className="loading-state">Cargando solicitudes...</div>;

  return (
    <div className="gs-container">
      <div className="gs-card">
        <h1 className="page-title">Gestión de Solicitudes</h1>

        <div className="gs-table-wrapper">
          <table className="gs-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Solicitante</th>
                <th>Actividad</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.filter(s => s.estado !== "Pendiente").length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay solicitudes gestionadas
                  </td>
                </tr>
              ) : (
                solicitudes
                  .filter(s => s.estado !== "Pendiente")
                  .map((s) => (
                    <tr key={s.id}>
                      <td>{new Date(s.fecha_solicitud).toLocaleDateString()}</td>
                      <td><strong>{s.nombre_solicitante}</strong></td>
                      <td>{s.actividad}</td>
                      <td>
                        <span className={`gs-badge ${s.estado.toLowerCase().trim()}`}>
                          {s.estado}
                        </span>
                      </td>
                      <td>
                        <button
                          className="gs-btn-ver"
                          onClick={() => abrirModal(s)}
                        >
                          👁 Ver
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalVerGestionSolicitud
        isOpen={modalOpen}
        onClose={cerrarModal}
        solicitud={solicitudSeleccionada}
      />
    </div>
  );
}