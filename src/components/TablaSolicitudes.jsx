import { Link } from "react-router-dom";
import { useState } from "react";
import "../assets/css/gestionSolicitudes.css";

const TextoVerMas = ({ texto, maxChars = 80 }) => {
  const [expandido, setExpandido] = useState(false);

  if (!texto) return "—";

  const esLargo = texto.length > maxChars;

  return (
    <div>
      <div className={`gs-texto ${expandido ? "expandido" : ""}`}>
        {expandido ? texto : texto.slice(0, maxChars)}
        {!expandido && esLargo && "..."}
      </div>

      {esLargo && (
        <span
          className="gs-ver-mas"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Ver menos" : "Ver más"}
        </span>
      )}
    </div>
  );
};

const TablaSolicitudes = ({ solicitudes = [] }) => {

  const userData = JSON.parse(localStorage.getItem("userData"));
  const usuarioLogueado = userData?.user;
  const idapp = userData?.idapp

  return (
    <div className="gs-table-wrapper">
      <table className="gs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitud</th>
            <th>solicitante</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th className="gs-actions-header">Acción</th>
          </tr>
        </thead>

        <tbody>
          {solicitudes.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                No hay solicitudes registradas
              </td>
            </tr>
          ) : (
            solicitudes.map((s) => {

              const esResponsable =
                idapp?.id === s.responsable;

              return (
                <tr key={s.id}>
                  <td>{s.id}</td>

                  <td>
                    <TextoVerMas texto={s.actividad} />
                  </td>

                  {/* 🔥 NUEVA COLUMNA SOLICITANTE */}
                  <td>
                    {s.nombre_solicitante || "—"}
                  </td>

                  <td>
                    {s.fecha_solicitud
                      ? s.fecha_solicitud.slice(0, 10)
                      : "—"}
                  </td>

                  <td>
                    <span className={`gs-badge ${(s.estado || "").toLowerCase()}`}>
                      {s.estado}
                    </span>
                  </td>

                  <td className="gs-actions-cell">
                    <div className="gs-actions">

                      <Link
                        to={`/solicitudes/ver/${s.id}`}
                        className="gs-btn gs-btn-view"
                        title="Ver solicitud"
                      >
                        👁
                      </Link>

                      {/* 🔥 SOLO EL RESPONSABLE VE ESTO */}
                      {esResponsable && (
                        <Link
                          to={`/nueva-actividad/${s.id}`}
                          state={{
                            solicitudNombre: s.actividad,
                          }}
                          className="gs-btn gs-btn-approve"
                          title="Crear actividad"
                        >
                          ➕
                        </Link>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSolicitudes;