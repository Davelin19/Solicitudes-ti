import React, { useState, useMemo, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/tablaActividades.css";

const TablaActividades = ({
  actividades = [],
  onEliminar,
  onActualizarEstado,
  onIniciar
}) => {
  const [padreAbierto, setPadreAbierto] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("userData")) || {};
  const esSuperAdmin = usuario?.idapp?.rol === "Superadministrador";

  // =========================
  // FILTRO PADRES (sin eliminadas)
  // =========================
  const actividadesPadre = useMemo(() => {
    return actividades
      .filter(
        (a) =>
          a.tipo === "Padre" &&
          !a.eliminado &&
          a.estado !== "Completada" &&
          a.estado !== "Eliminada"
      )
      .sort((a, b) =>
        a.estado === "Bloqueada" ? 1 : -1
      );
  }, [actividades]);

  // =========================
  // HIJAS (sin eliminadas)
  // =========================
  const obtenerHijas = (padre) =>
    actividades.filter(
      (a) =>
        a.tipo === "Hija" &&
        Number(a.padre) === Number(padre) &&
        !a.eliminado &&
        a.estado !== "Completada" &&
        a.estado !== "Eliminada"
    );

  const completarActividad = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/actividades/${id}/completar`,
        { method: "PATCH" }
      );
      alert("Actividad completada");
    } catch {
      alert("Error al aprobar la actividad");
    }
  };

  const togglePadre = (id) =>
    setPadreAbierto((prev) => (prev === id ? null : id));

  const estadoClase = (estado = "") =>
    (estado || "No iniciada")
      .toLowerCase()
      .replace(/\s+/g, "-");

  // =========================
  // AUTO POR APROBAR
  // =========================
  useEffect(() => {
    actividades.forEach((a) => {
      if (
        a.avance === 100 &&
        a.estado !== "Por aprobar" &&
        a.estado !== "Completada"
      ) {
        onActualizarEstado?.(a.id, "Por aprobar");
      }
    });
  }, [actividades, onActualizarEstado]);

  // =========================
  // BOTONES COMPACTADOS
  // =========================
  const renderBotones = (actividad) => {
    const { estado, id, tipo, solicitud_id } = actividad;
    if (estado === "Completada" || estado === "Eliminada") return null;

    const esPadre = tipo === "Padre";

    const botones = {
      "No iniciada": (
        <>
          <button className="btn iniciar" onClick={() => onIniciar(id)}>▶</button>
          <Link to={`/actividades/editar/${id}`} className="btn editar">✏️</Link>
          <button className="btn eliminar" onClick={() => onEliminar?.(id)}>🗑</button>
          {esPadre && (
            <Link
              to={`/solicitudes/${solicitud_id}/crear-hija?hijaDe=${id}`}
              className="btn crear-hija"
            >
              ➕
            </Link>
          )}
        </>
      ),

      "En curso": (
        <>
          <button onClick={() => onActualizarEstado?.(id, "Bloqueada")}>🔒</button>
          <Link to={`/actividades/editar/${id}`} className="btn editar">✏️</Link>
          <button className="btn eliminar" onClick={() => onEliminar?.(id)}>🗑</button>
          {esPadre && (
            <Link
              to={`/solicitudes/${solicitud_id}/crear-hija?hijaDe=${id}`}
              className="btn crear-hija"
            >
              ➕
            </Link>
          )}
        </>
      ),

      "Bloqueada": (
        <>
          <button onClick={() => onActualizarEstado?.(id, "En curso")}>🔓</button>
          <Link to={`/actividades/editar/${id}`} className="btn editar">✏️</Link>
          <button className="btn eliminar" onClick={() => onEliminar?.(id)}>🗑</button>
        </>
      ),

      "Por aprobar": esSuperAdmin ? (
        <button className="btn aprobar" onClick={() => completarActividad(id)}>✅</button>
      ) : null
    };

    return (
      <>
        <Link to={`/actividades/ver/${id}`} className="btn ver">👁</Link>
        {botones[estado] || null}
      </>
    );
  };

  return (
    <div className="table-card">
      <table className="tabla-actividades">
        <thead>
          <tr>
            <th>#</th>
            <th>Actividad</th>
            <th>Estado</th>
            <th>Responsable</th>
            <th>Avance</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {actividadesPadre.map((padre, index) => {
            const hijas = obtenerHijas(padre.id);
            const abierto = padreAbierto === padre.id;

            return (
              <Fragment key={padre.id}>
                <tr
                  className="fila-padre"
                  onClick={() => togglePadre(padre.id)}
                >
                  <td>{index + 1}</td>
                  <td>{abierto ? "📂" : "📁"} {padre.tarea}</td>
                  <td>
                    <span className={`estado ${estadoClase(padre.estado)}`}>
                      {padre.estado}
                    </span>
                  </td>
                  <td>{padre.nombre_responsable || "—"}</td>
                  <td>{padre.avance || 0}%</td>
                  <td
                    className="acciones"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {renderBotones(padre)}
                  </td>
                </tr>

                {abierto &&
                  hijas.map((hija) => (
                    <tr key={hija.id} className="fila-hija">
                      <td></td>
                      <td>↳ {hija.tarea}</td>
                      <td>
                        <span className={`estado ${estadoClase(hija.estado)}`}>
                          {hija.estado}
                        </span>
                      </td>
                      <td>{hija.nombre_responsable}</td>
                      <td>{hija.avance || 0}%</td>
                      <td className="acciones">
                        {renderBotones(hija)}
                      </td>
                    </tr>
                  ))}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaActividades;