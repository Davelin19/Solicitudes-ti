import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../assets/css/registroActividad.css";

const RegistroActividad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { solicitudId } = useParams(); // 🔥 ID DE LA SOLICITUD

  const query = new URLSearchParams(location.search);
  const padreDesdeTabla = query.get("hijaDe");

  const [equipo, setEquipo] = useState([]);
  const [actividadesPadre, setActividadesPadre] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    tarea: "",
    tipo: padreDesdeTabla ? "hijo" : "padre",
    padre: padreDesdeTabla || "",
    prioridad: "",
    responsable_id: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔒 Si no hay solicitudId, lo regresamos
  useEffect(() => {
    if (!solicitudId) {
      navigate("/solicitudes");
    }
  }, [solicitudId, navigate]);

  // 🔥 Cargar equipo
  useEffect(() => {
    const cargarEquipo = async () => {
      try {
        const res = await fetch(`${API_URL}/equipo`);
        const data = await res.json();
        setEquipo(data);
      } catch (err) {
        console.error("Error cargando equipo:", err);
      }
    };

    cargarEquipo();
  }, []);

  // 🔥 Cargar actividades padre
  useEffect(() => {
    const cargarPadres = async () => {
      try {
        const res = await fetch(`${API_URL}/actividades`);
        const data = await res.json();
        const padres = data.filter((a) => a.tipo === "padre");
        setActividadesPadre(padres);
      } catch (err) {
        console.error("Error cargando actividades:", err);
      }
    };

    cargarPadres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "tipo" && value === "padre" ? { padre: "" } : {}),
    }));
  };

  const validarFormulario = () => {
    if (!form.tarea || !form.tarea.trim())
      return "El nombre es obligatorio";

    if (!form.tipo)
      return "El tipo es obligatorio";

    if (form.tipo === "hijo" && !form.padre)
      return "Debe seleccionar una actividad padre";

    if (!form.prioridad)
      return "La prioridad es obligatoria";

    if (!form.responsable_id)
      return "Debe seleccionar un responsable";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/actividades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tarea: form.tarea,
          tipo: form.tipo,
          padre:
            form.tipo === "hijo"
              ? Number(form.padre)
              : null,
          prioridad: form.prioridad,
          responsable_id: Number(form.responsable_id),
          solicitud_id: Number(solicitudId), // 🔥 ESTA ES LA CLAVE
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("ERROR BACKEND:", data);
        throw new Error(data.message || "Error al guardar");
      }

      alert("Actividad creada correctamente ✅");

      navigate(`/solicitudes/ver/${solicitudId}`);

    } catch (err) {
      console.error("ERROR COMPLETO:", err);
      setError(err.message);
    }
  };

  return (
    <form className="actividad-form" onSubmit={handleSubmit}>
      <h2 className="form-title">📝 Registro de Actividad</h2>

      {error && <p className="error-msg">{error}</p>}

      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          name="tarea"
          value={form.tarea || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Tipo</label>
        <select
          name="tipo"
          value={form.tipo || ""}
          onChange={handleChange}
        >
          <option value="padre">Padre</option>
          <option value="hijo">Hijo</option>
        </select>
      </div>

      {form.tipo === "hijo" && (
        <div className="form-group">
          <label>Actividad padre</label>
          <select
            name="padreId"
            value={form.padre || ""}
            onChange={handleChange}
          >
            <option value="">Seleccione</option>
            {actividadesPadre.map((padre) => (
              <option key={padre.id} value={padre.id}>
                {padre.tarea}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label>Prioridad</label>
        <select
          name="prioridad"
          value={form.prioridad || ""}
          onChange={handleChange}
        >
          <option value="">Seleccione</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
      </div>

      <div className="form-group">
        <label>Responsable</label>
        <select
          name="responsable_id"
          value={form.responsable_id || ""}
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

      <button className="btn-submit">💾 Guardar</button>
    </form>
  );
};

export default RegistroActividad;