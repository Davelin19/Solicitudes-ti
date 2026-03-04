import { useEffect, useState, useMemo } from "react";
import TablaActividades from "../components/TablaActividades";

const API = "https://cv8qdx88-3000.use2.devtunnels.ms/api";

export default function GestionActividades() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // =========================
  // CARGAR ACTIVIDADES
  // =========================
  useEffect(() => {
    fetch(`${API}/actividades`)
      .then((res) => res.json())
      .then((data) => setActividades(data))
      .catch((err) => console.error("Error cargando actividades:", err))
      .finally(() => setLoading(false));
  }, []);

  // =========================
  // FILTRO GLOBAL EN TIEMPO REAL
  // =========================
  const actividadesFiltradas = useMemo(() => {
    if (!busqueda) return actividades;

    const texto = busqueda.toLowerCase();

    return actividades.filter((a) =>
      a.tarea?.toLowerCase().includes(texto) ||
      a.estado?.toLowerCase().includes(texto) ||
      a.nombre_responsable?.toLowerCase().includes(texto) ||
      a.nombres_apoyos?.toLowerCase().includes(texto) ||
      a.fecha_inicio?.includes(texto) ||
      a.fecha_fin?.includes(texto)
    );
  }, [actividades, busqueda]);

  // =========================
  // ELIMINAR ACTIVIDAD
  // =========================
  const eliminarActividad = (id) => {
    if (!window.confirm("¿Deseas eliminar esta actividad?")) return;

    fetch(`${API}/actividades/${id}`, {
      method: "DELETE",
    }).then(() => {
      setActividades((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, eliminado: true } : a
        )
      );
    });
  };

  // =========================
  // ACTUALIZAR ESTADO
  // =========================
  const actualizarEstado = async (id, nuevoEstado) => {
    await fetch(`${API}/actividades/${id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    setActividades((prev) =>
      prev.map((a) =>
        Number(a.id) === Number(id)
          ? { ...a, estado: nuevoEstado }
          : a
      )
    );
  };

  return (
    <div className="table-card">

      {/* HEADER */}
      <div className="header-actividades">

      <div className="header-texto">
        <h1>Gestión de Actividades</h1>
        <p>
          Administra las actividades donde eres responsable o apoyo
        </p>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, fecha, responsable o apoyo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="input-busqueda"
      />

    </div>

      {loading ? (
        <p>Cargando actividades...</p>
      ) : (
        <TablaActividades
          actividades={actividadesFiltradas}
          onEliminar={eliminarActividad}
          onActualizarEstado={actualizarEstado}
          onIniciar={(id) =>
            actualizarEstado(id, "En curso")
          }
        />
      )}
    </div>
  );
}