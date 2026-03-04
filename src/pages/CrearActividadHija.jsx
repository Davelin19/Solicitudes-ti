import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../assets/css/registroActividad.css";

const CrearActividadHija = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { solicitudId } = useParams();

  const query = new URLSearchParams(location.search);
  const padreId = query.get("hijaDe");

  const API_URL = import.meta.env.VITE_API_URL;

  const [equipo, setEquipo] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    tipo: "Hija",
    prioridad: "",
    responsable_id: "",
  });

  // Validar existencia de datos
  useEffect(() => {
    if (!padreId || !solicitudId) {
      navigate("/solicitudes");
    }
  }, [padreId, solicitudId, navigate]);

  // Cargar responsables
  useEffect(() => {
    const cargarEquipo = async () => {
      try {
        const res = await fetch(`${API_URL}/equipo`);
        const data = await res.json();
        setEquipo(data);
      } catch (err) {
        console.error(err);
      }
    };
    cargarEquipo();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.prioridad) return "Seleccione una prioridad";
    if (!form.responsable_id) return "Seleccione un responsable";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/actividades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tarea: form.nombre,
          tipo: "Hija",
          padre: Number(padreId),
          prioridad: form.prioridad,
          responsable_id: Number(form.responsable_id),
          solicitud_id: Number(solicitudId),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al crear actividad hija");
      }

      navigate(`/solicitudes/ver/${solicitudId}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="actividad-container">
      <form className="actividad-form glass" onSubmit={handleSubmit}>
        <h2 className="form-title">✨ Crear Actividad Hija</h2>

        {error && <div className="error-box">{error}</div>}

        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Diseñar módulo de login"
          />
        </div>

        <div className="form-group">
          <label>Tipo</label>
          <input
            type="text"
            value="Hija"
            disabled
            className="input-disabled"
          />
        </div>

        <div className="form-group">
          <label>Prioridad</label>
          <select
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            <option value="Alta">🔴 Alta</option>
            <option value="Media">🟡 Media</option>
            <option value="Baja">🟢 Baja</option>
          </select>
        </div>

        <div className="form-group">
          <label>Responsable</label>
          <select
            name="responsable_id"
            value={form.responsable_id}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            {equipo.map((miembro) => (
              <option key={miembro.id} value={miembro.id}>
                {miembro.nombre}
              </option>
            ))}
          </select>
        </div>

        <button className="btn-submit modern-btn" disabled={loading}>
          {loading ? "Guardando..." : "💾 Crear Actividad"}
        </button>
      </form>
    </div>
  );
};

export default CrearActividadHija;