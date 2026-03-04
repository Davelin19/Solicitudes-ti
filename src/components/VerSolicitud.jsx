import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/verSolicitud.css";

const VerSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerSolicitud();
  }, [id]);

  const obtenerSolicitud = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/solicitudes/${id}`
      );

      if (!response.ok) {
        throw new Error("No se encontró la solicitud");
      }

      const data = await response.json();
      setSolicitud(data);
    } catch (error) {
      console.error(error);
      setSolicitud(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Cargando solicitud...</p>;
  }

  if (!solicitud) {
    return <p>No se encontró la solicitud</p>;
  }

  return (
    <div className="ver-solicitud-container">
      <div className="ver-solicitud-card">
        <h1 className="ver-title">Detalle de la Solicitud</h1>

        <div className="ver-grid">
          <div>
            <span>Actividad</span>
            <p>{solicitud.actividad}</p>
          </div>

          <div>
            <span>Fecha</span>
            <p>{solicitud.fecha_solicitud?.slice(0, 10)}</p>
          </div>

          <div>
            <span>Estado</span>
            <p className={`estado ${solicitud.estado?.toLowerCase()}`}>
              {solicitud.estado}
            </p>
          </div>

          <div>
            <span>Responsable</span>
            <p>{solicitud.nombre_responsable}</p>
          </div>
        </div>

        <div className="ver-section">
          <span>Justificación</span>
          <p>{solicitud.justificacion}</p>
        </div>

        <div className="ver-section">
          <span>Observaciones</span>
          <p>{solicitud.observaciones}</p>
        </div>

        <div className="ver-actions">
          <button onClick={() => navigate(-1)} className="btn-volver">
            ⬅ Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerSolicitud;