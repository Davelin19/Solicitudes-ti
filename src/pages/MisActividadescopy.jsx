import { useEffect, useState, useMemo } from "react";
import TablaActividadesCopy from "../components/TablaActividadesCopy";

export default function GestionActividades() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("userData"));
  const API = import.meta.env.VITE_API_URL;

  // =========================
  // GET → CARGAR ACTIVIDADES
  // =========================
  useEffect(() => {
    const cargarActividades = async () => {
      try {
        const res = await fetch(`${API}/actividades`);
        if (!res.ok) throw new Error("Error cargando actividades");

        const data = await res.json();
        setActividades(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarActividades();
  }, [API]);

  // =========================
  // 🔥 FILTRO RESPONSABLE / APOYO ROBUSTO
  // =========================
  const actividadesFiltradas = useMemo(() => {
    if (!usuario?.idapp?.nombre) return [];

    const nombreUsuario = usuario.idapp.nombre
      .trim()
      .toLowerCase();

    return actividades.filter((a) => {
      // RESPONSABLE
      const responsable = a.nombre_responsable
        ?.trim()
        .toLowerCase();

      const esResponsable = responsable === nombreUsuario;

      // APOYOS
      let esApoyo = false;

      if (Array.isArray(a.nombres_apoyos)) {
        esApoyo = a.nombres_apoyos
          .map((n) => n?.trim().toLowerCase())
          .includes(nombreUsuario);
      } else if (typeof a.nombres_apoyos === "string") {
        esApoyo = a.nombres_apoyos
          .split(",")
          .map((n) => n.trim().toLowerCase())
          .includes(nombreUsuario);
      }

      return esResponsable || esApoyo;
    });
  }, [actividades, usuario]);

  // =========================
  // PATCH → BORRADO LÓGICO
  // =========================
  const eliminarActividad = async (id) => {
    if (!window.confirm("¿Deseas eliminar esta actividad?")) return;

    try {
      const res = await fetch(
        `${API}/actividades/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Error al eliminar");

      setActividades((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, eliminado: true } : a
        )
      );
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  // =========================
  // PATCH → ACTUALIZAR ESTADO
  // =========================
  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(
        `${API}/actividades/${id}/estado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      if (!res.ok)
        throw new Error("Error actualizando estado");

      setActividades((prev) =>
        prev.map((a) =>
          Number(a.id) === Number(id)
            ? { ...a, estado: nuevoEstado }
            : a
        )
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="table-card">
      <h1>Mis actividades</h1>
      <p>
        Administra las actividades donde eres responsable
        o apoyo
      </p>

      {loading ? (
        <p>Cargando actividades...</p>
      ) : (
        <TablaActividadesCopy
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