import { useEffect, useState } from "react";
import "../assets/css/solicitudesPendientes.css";
import ModalAprobar from "../components/ModalAprobar";
import ModalRechazar from "../components/ModalRechazar";

const API_BASE = import.meta.env.VITE_API_URL;

const SolicitudesPendientes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [equipo, setEquipo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [decision, setDecision] = useState("");

  const [observaciones, setObservaciones] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [responsable, setResponsable] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resSol, resEq] = await Promise.all([
          fetch(`${API_BASE}/solicitudes`),
          fetch(`${API_BASE}/equipo`)
        ]);

        if (!resSol.ok || !resEq.ok) {
          throw new Error("Error cargando datos");
        }

        const dataSol = await resSol.json();
        const dataEq = await resEq.json();

        setSolicitudes(dataSol.filter(s => s.estado === "Pendiente"));
        setEquipo(dataEq);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const abrirModal = (solicitud, tipo) => {
    setSolicitudSeleccionada(solicitud);
    setDecision(tipo);
    setObservaciones("");
    setPrioridad("");
    setResponsable("");
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setSolicitudSeleccionada(null);
  };

  const confirmarDecision = async () => {
    if (!solicitudSeleccionada) return;

    if (decision === "Aprobada" && (!prioridad || !responsable)) {
      alert("⚠️ Debes asignar prioridad y responsable.");
      return;
    }

    const payload = {
      estado: decision,
      observaciones: observaciones.trim()
    };

    if (decision === "Aprobada") {
      payload.prioridad = prioridad;
      payload.responsable = responsable;
    }

    try {
      const response = await fetch(
        `${API_BASE}/solicitudes/${solicitudSeleccionada.id}/decision`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      // 🔥 Eliminar del listado
      setSolicitudes(prev =>
        prev.filter(s => s.id !== solicitudSeleccionada.id)
      );

      cerrarModal();
    } catch (err) {
      alert("❌ No se pudo actualizar: " + err.message);
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div className="content">
      <div className="page-wrapper">
        <div className="card">
          <h1 className="page-title">Solicitudes Pendientes</h1>

          {solicitudes.length === 0 ? (
            <p className="tabla-vacia">
              No hay solicitudes pendientes 🎉
            </p>
          ) : (
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Solicitante</th>
                  <th>Actividad</th>
                  <th>Justificación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id}>
                    <td>{`${s.fecha_solicitud}`.slice(0, 10)}</td>
                    <td>{s.nombre_solicitante}</td>
                    <td>{s.actividad}</td>

                    <td className="justificacion-cell">
                      {s.justificacion
                        ? s.justificacion.length > 40
                          ? s.justificacion.slice(0, 40) + "..."
                          : s.justificacion
                        : "—"}
                    </td>

                    <td>
                      <span className="badge-pendiente">
                        {s.estado}
                      </span>
                    </td>

                    <td className="acciones-botones">
                      <button
                        className="btn-aprobar"
                        onClick={() => abrirModal(s, "Aprobada")}
                      >
                        ✔
                      </button>

                      <button
                        className="btn-rechazar"
                        onClick={() => abrirModal(s, "Rechazada")}
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL APROBAR */}
      <ModalAprobar
        isOpen={modalOpen && decision === "Aprobada"}
        onClose={cerrarModal}
        onConfirm={confirmarDecision}
        solicitante={solicitudSeleccionada?.nombre_solicitante}
        equipo={equipo}
        responsable={responsable}
        setResponsable={setResponsable}
        prioridad={prioridad}
        setPrioridad={setPrioridad}
        observaciones={observaciones}
        setObservaciones={setObservaciones}
      />

      {/* MODAL RECHAZAR */}
      <ModalRechazar
        isOpen={modalOpen && decision === "Rechazada"}
        onClose={cerrarModal}
        onConfirm={confirmarDecision}
        solicitante={solicitudSeleccionada?.nombre_solicitante}
        observaciones={observaciones}
        setObservaciones={setObservaciones}
      />
    </div>
  );
};

export default SolicitudesPendientes;