import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/css/editarActividad.css";

export default function EditarActividad() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [listaApoyos, setListaApoyos] = useState([]);

  // 🔐 USUARIO LOGUEADO
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const esSuperAdmin = usuario?.rol === "Superadministrador";

  useEffect(() => {
    // 🔹 CARGAR ACTIVIDAD
    fetch(`${import.meta.env.VITE_API_URL}/actividades`)
      .then((res) => res.json())
      .then((data) => {
        const encontrada = data.find((act) => act.id == id);
        if (!encontrada) {
          setError("No se encontró la actividad");
          return;
        }
        setForm(encontrada);
        
      })
      
      .catch(() => {
        setError("Error cargando actividad");
      });

    // 🔹 CARGAR APOYOS
    fetch(`${import.meta.env.VITE_API_URL}/equipo`)
      .then((res) => res.json())
      .then((data) => setListaApoyos(data))
      .catch(() => console.error("Error cargando apoyos"));
  }, [id]);

  // 🔐 VALIDAR RESPONSABLE
  const esResponsable =
    usuario?.nombre === form?.nombre_responsable;

  const puedeEditarEstado = esSuperAdmin || esResponsable;

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "avance") {
      value = Number(value);
    }

    setForm((prev) => {
      let nuevoEstado = prev.estado;

      if (name === "estado") {
        nuevoEstado = value;
      }

      if (name === "avance" && value === 100) {
        nuevoEstado = "Por aprobar";
      }

      if (name === "avance" && value < 100 && prev.estado === "Por aprobar") {
        nuevoEstado = "En curso";
      }

      return {
        ...prev,
        [name]: value,
        estado: nuevoEstado,
      };
    });
  };

  const validarFormulario = () => {
    if (!form.tarea.trim()) return "El nombre es obligatorio";
    if (form.avance < 0 || form.avance > 100)
      return "El avance debe estar entre 0 y 100";
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
      // 🔹 ACTUALIZAR ACTIVIDAD
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/actividades/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error();

      // 🔹 GUARDAR EVIDENCIA (PATCH)
      if (form.evidencias) {
        await fetch(
          `${import.meta.env.VITE_API_URL}/actividades/${id}/evidencias`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              evidencias: form.evidencias,
            }),
          }
        );
        
      }

      alert("Actividad actualizada correctamente");
      navigate("/actividades");

    } catch {
      alert("Error al actualizar actividad");
    }

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/actividades/apoyos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actividad_id: id,
            usuario_ids: form.apoyos,
          }),
        }
      );
    } catch {
      alert("Error al guardar los apoyos");
    }
  };

  if (error) return <p className="error-msg">{error}</p>;
  if (!form) return <p>Cargando...</p>;

  return (
    <div className="editar-container">
      <div className="editar-card">
        <h1>✏️ Editar Actividad</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="tarea"
              value={form.tarea}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Enlace de evidencias (Drive)</label>
            <input
              type="url"
              name="evidencias"
              value={form.evidencias || ""}
              onChange={handleChange}
              placeholder="https://drive.google.com/..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Estado</label>
              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                disabled={!puedeEditarEstado}
              >
                <option value="No iniciada">No iniciada</option>
                <option value="En curso">En curso</option>
                <option value="Bloqueada">Bloqueada</option>
                <option value="Por aprobar">Por aprobar</option>
                <option value="Completada">Completada</option>
              </select>
            </div>

            <div className="form-group">
              <label>Responsable</label>
              <select
                name="responsable_id"
                value={form.responsable_id || ""}
                onChange={handleChange}
              >
                <option value="">Seleccione responsable</option>
                {listaApoyos.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Avance: {form.avance}%</label>
            <input
              type="range"
              min="0"
              max="100"
              name="avance"
              value={form.avance}
              onChange={handleChange}
            />
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${form.avance}%` }}
              ></div>
            </div>
          </div>

          <div className="form-group">
            <label>Apoyos</label>
            <select
              name="apoyos"
              multiple
              value={form.apoyos || []}
              onChange={(e) => {
                const values = Array.from(
                  e.target.selectedOptions,
                  option => Number(option.value)
                );
                setForm(prev => ({
                  ...prev,
                  apoyos: values
                }));
              }}
            >
              {listaApoyos.map((apoyo) => (
                <option key={apoyo.id} value={apoyo.id}>
                  {apoyo.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <div className="form-actions">
            <button type="submit" className="btn-save">
              💾 Guardar
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              ⬅ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}