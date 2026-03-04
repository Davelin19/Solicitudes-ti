import { useState, useMemo, useEffect } from "react";
import { Eye } from "lucide-react";
import "../assets/css/historial.css";

const TablaHistorialActividades = ({ onVer }) => {
  const [busqueda, setBusqueda] = useState("");
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Cargar Completadas + Eliminadas
  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const [resCompletadas, resEliminadas] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/actividades/consultar/estado/Completada`),
          fetch(`${import.meta.env.VITE_API_URL}/actividades/consultar/estado/Eliminada`)
        ]);

       

        const completadas = await resCompletadas.json();
        const eliminadas = await resEliminadas.json();

        const data = [...completadas, ...eliminadas];
        console.log(data)

        const userData = JSON.parse(localStorage.getItem("userData"));
        const rol = userData?.idapp?.rol;

        if (rol === "Superadministrador") {
          setActividades(data);
        } else {
          const filtradas = data.filter(
            d => d.responsable_id === userData?.idapp?.id
          );
          setActividades(filtradas);
        }

      } catch (error) {
        console.error("Error cargando historial:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, []);

  // 🔎 Filtro buscador
  const actividadesFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase();

    return actividades.filter((act) =>
      act.tarea?.toLowerCase().includes(texto) ||
      act.nombre_responsable?.toLowerCase().includes(texto) ||
      act.nombres_apoyos?.toLowerCase().includes(texto) ||
      act.fecha_inicio?.toLowerCase().includes(texto) ||
      act.fecha_final?.toLowerCase().includes(texto)
    );
  }, [busqueda, actividades]);

  if (loading) return <p>Cargando historial...</p>;

  return (
    <div className="historial-wrapper">

      {/* 🔍 BUSCADOR */}
      <div className="historial-top">
        <input
          type="text"
          placeholder="Buscar por nombre, fecha o apoyos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

      {/* TABLA */}
      <div className="tabla-historial-container">
        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Apoyos</th>
              <th>Fecha inicio</th>
              <th>Fecha fin</th>
              <th className="acciones-header">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {actividadesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="tabla-vacia">
                  No hay resultados
                </td>
              </tr>
            ) : (
              actividadesFiltradas.map((actividad) => (
                <tr key={actividad.id} className="fila">
                  <td>{actividad.tarea}</td>
                  <td>{actividad.nombre_responsable}</td>

                  <td>
                    <span
                      className={
                        actividad.estado === "Eliminada"
                          ? "estado-eliminada"
                          : "estado-completado"
                      }
                    >
                      {actividad.estado}
                    </span>
                  </td>

                  <td>{actividad.nombres_apoyos || "—"}</td>

                  <td>
                    {actividad.fecha_inicio
                      ? actividad.fecha_inicio.slice(0, 10)
                      : "—"}
                  </td>

                  <td>
                    {actividad.fecha_final
                      ? actividad.fecha_final.slice(0, 10)
                      : "—"}
                  </td>

                  <td>
                    <div className="acciones">
                      <button
                        className="btn ver"
                        onClick={() => onVer?.(actividad)}
                        title="Ver"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaHistorialActividades;