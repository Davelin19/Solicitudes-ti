import { useEffect } from "react";
import "../assets/css/modalVerGestionSolicitud.css";

export default function ModalVerGestionSolicitud({ isOpen, onClose, solicitud }) {

  // 🔥 Cerrar con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !solicitud) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-card"
        onClick={(e) => e.stopPropagation()} // 🔥 Evita que cierre si das click dentro
      >

        <div className="modal-header">
          <h2>Detalle de Solicitud</h2>
          <button className="modal-close" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          <div className="modal-row">
            <span>Fecha:</span>
            <strong>{new Date(solicitud.fecha_solicitud).toLocaleDateString()}</strong>
          </div>

          <div className="modal-row">
            <span>Solicitante:</span>
            <strong>{solicitud.nombre_solicitante}</strong>
          </div>

          <div className="modal-row">
            <span>Actividad:</span>
            <strong>{solicitud.actividad}</strong>
          </div>

          <div className="modal-row">
            <span>Estado:</span>
            <strong>{solicitud.estado}</strong>
          </div>

          <div className="modal-row">
            <span>Responsable:</span>
            <strong>{solicitud.nombre_responsable}</strong>
          </div>

          <div className="modal-row">
            <span>Justificación:</span>
            <p>{solicitud.justificacion || "—"}</p>
          </div>

          <div className="modal-row">
            <span>Observaciones:</span>
            <p>{solicitud.observaciones || "—"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}