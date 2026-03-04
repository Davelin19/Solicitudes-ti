import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/css/verActividad.css";

const VerActividad = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actividad, setActividad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idsApoyos, setIdsApoyos] = useState([]);

  useEffect(() => {
    obtenerActividad();
  }, []);

  const obtenerActividad = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/actividades/${id}`
      );

      const data = await res.json();

      console.log("Actividad recibida:", data);

      setActividad(data);

      const ids =
        data.ids_apoyos && data.ids_apoyos.trim() !== ""
          ? data.ids_apoyos.split(",").map((id) => id.trim())
          : [];

      setIdsApoyos(ids);
    } catch (error) {
      console.error("Error al obtener actividad:", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarApoyo = async (id_apoyo) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/actividades/${id}/apoyos/${id_apoyo}`,
        {
          method: "DELETE",
        }
      );

      obtenerActividad();
    } catch (error) {
      alert(
        `No se pudo eliminar el apoyo ${id_apoyo} de la actividad ${id}`
      );
    }
  };

  if (loading) {
    return <p>Cargando actividad...</p>;
  }

  if (!actividad) {
    return <p>No se encontró la actividad</p>;
  }

  const nombresApoyos =
    actividad.nombres_apoyos && actividad.nombres_apoyos.trim() !== ""
      ? actividad.nombres_apoyos.split(",").map((a) => a.trim())
      : [];

  return (
    <div className="ver-actividad-container">
      <div className="ver-actividad-card">
        <h1 className="ver-title">Detalle de la Actividad</h1>

        <div className="ver-grid">
          <div>
            <span>Actividad</span>
            <p>{actividad.tarea}</p>
          </div>

          <div>
            <span>Estado</span>
            <p
              className={`estado ${actividad.estado
                ?.toLowerCase()
                .replace(" ", "-")}`}
            >
              {actividad.estado}
            </p>
          </div>

          <div>
            <span>Responsable</span>
            <p>{actividad.nombre_responsable}</p>
          </div>

          <div>
            <span>Avance</span>
            <p>{actividad.avance}%</p>
          </div>

          {/* 🔥 NUEVO CAMPO AGREGADO */}
          <div>
            <span>Evidencias</span>
            {actividad.evidencias ? (
              <p>
                <a
                  href={actividad.evidencias}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-evidencias"
                >
                  🔗 Ver evidencias
                </a>
              </p>
            ) : (
              <p>No hay evidencias cargada</p>
            )}
          </div>

          <div>
            <span>Apoyos</span>

            {nombresApoyos.length === 0 ? (
              <p>No tiene apoyos</p>
            ) : (
              <ul>
                {nombresApoyos.map((apoyo, i) => (
                  <li className="listado-apoyo" key={i}>
                    {apoyo}
                    {idsApoyos[i] && (
                      <button
                        className="btn-equis"
                        onClick={() => eliminarApoyo(idsApoyos[i])}
                      >
                        X
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <span>Fecha Inicio</span>
            <p>
              {actividad.fecha_inicio
                ? `${actividad.fecha_inicio}`.slice(0, 10)
                : ""}
            </p>
          </div>

          <div>
            <span>Fecha Fin</span>
            <p>
              {actividad.fecha_final
                ? `${actividad.fecha_final}`.slice(0, 10)
                : ""}
            </p>
          </div>
        </div>

        <div className="ver-actions">
          <button onClick={() => navigate(-1)} className="btn-volver">
            ⬅ Volver
          </button>

          <button
            onClick={() =>
              navigate(`/actividades/editar/${actividad.id}`)
            }
            className="btn-editar"
          >
            ✏️ Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerActividad;