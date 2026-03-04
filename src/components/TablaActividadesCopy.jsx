import React, { useState, useMemo, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/tablaActividades.css";

const TablaActividadesCopy = ({
  actividades = [],
  onEliminar,
  onActualizarEstado,
  onIniciar
}) => {

  const [padreAbierto, setPadreAbierto] = useState(null);
  const [hijas, setHijas] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("userData")) || {};
  const esSuperAdmin = usuario?.idapp?.rol === "Superadministrador";

  // =========================
  // PADRES (🔥 filtro agregado)
  // =========================
  const actividadesPadre = useMemo(() =>
    actividades
      .filter(a =>
        a.tipo === "Padre" &&
        !a.eliminado &&
        a.estado !== "Completada" &&
        a.estado !== "Eliminada" // 🔥 FILTRO NUEVO
      )
      .sort((a, b) =>
        a.estado === "Bloqueada" ? 1 :
        b.estado === "Bloqueada" ? -1 : 0
      ),
    [actividades]
  );

  // =========================
  // HIJAS (🔥 filtro agregado)
  // =========================
  const obtenerHijas = async (padreId) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/actividades/hijas/${padreId}`);
    const data = await res.json();

    const filtradas = data?.filter(
      h => h.estado !== "Completada" && h.estado !== "Eliminada"
    );

    setHijas(filtradas?.length ? filtradas : null);
  };

  const togglePadre = (id) => {
    obtenerHijas(id);
    setPadreAbierto(prev => prev === id ? null : id);
  };

  const completarActividad = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/actividades/${id}/completar`, {
      method: "PATCH"
    });
  };

  const estadoClase = (estado = "") =>
    estado.toLowerCase().replace(/\s+/g, "-");

  // =========================
  // AUTO POR APROBAR
  // =========================
  useEffect(() => {
    actividades.forEach(a => {
      if (a.avance === 100 && !["Por aprobar", "Completada"].includes(a.estado)) {
        onActualizarEstado?.(a.id, "Por aprobar");
      }
    });
  }, [actividades]);

  // =========================
  // BOTONES SEGÚN ESTADO
  // =========================
  const renderBotones = (actividad) => {
    const { id, estado, tipo, solicitud_id } = actividad;

    const btnVer = (
      <Link to={`/actividades/ver/${id}`} className="btn ver">👁</Link>
    );

    const btnEditar = (
      <Link to={`/actividades/editar/${id}`} className="btn editar">✏️</Link>
    );

    const btnEliminar = (
      <button className="btn eliminar" onClick={() => onEliminar?.(id)}>🗑</button>
    );

    const btnCrearHija = tipo === "Padre" && (
      <Link
        to={`/solicitudes/${solicitud_id}/crear-hija?hijaDe=${id}`}
        className="btn crear-hija"
      >
        ➕
      </Link>
    );

    const btnIniciar = (
      <button className="btn iniciar" onClick={() => onIniciar(id)}>▶</button>
    );

    const btnBloquear = (
      <button onClick={() => onActualizarEstado?.(id, "Bloqueada")}>🔒</button>
    );

    const btnDesbloquear = (
      <button onClick={() => onActualizarEstado?.(id, "En curso")}>🔓</button>
    );

    const btnAprobar = esSuperAdmin && (
      <button className="btn aprobar" onClick={() => completarActividad(id)}>✅</button>
    );

    switch (estado) {

      case "No iniciada":
        return <>{btnVer}{btnIniciar}{btnEditar}{btnEliminar}{btnCrearHija}</>;

      case "En curso":
        return <>{btnVer}{btnBloquear}{btnEditar}{btnEliminar}{btnCrearHija}</>;

      case "Bloqueada":
        return <>{btnVer}{btnDesbloquear}{btnEditar}{btnEliminar}</>;

      case "Por aprobar":
        return <>{btnVer}{btnAprobar}</>;

      default:
        return null;
    }
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
            const abierto = padreAbierto === padre.id;

            return (
              <Fragment key={padre.id}>
                <tr
                  className="fila-padre"
                  onClick={() => togglePadre(padre.id)}
                  style={{ cursor: "pointer" }}
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
                  <td className="acciones" onClick={(e) => e.stopPropagation()}>
                    {renderBotones(padre)}
                  </td>
                </tr>

                {abierto && hijas?.map(hija => (
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

export default TablaActividadesCopy;