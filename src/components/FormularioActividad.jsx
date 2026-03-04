import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/FormularioActividad.css";

export default function FormularioActividad() {

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const idapp = userData.idapp
  const usuarioLogueado = userData?.user;
  const token = userData?.token;

  const [formulario, setFormulario] = useState({
    fecha: "",
    nombre: "",
    justificacion: "",
  });

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0];

    setFormulario((prev) => ({
      ...prev,
      fecha: hoy,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/solicitudes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // fecha: formulario.fecha,
          actividad: formulario.nombre,
          justificacion: formulario.justificacion,
          solicitante: idapp?.id,
        }),
      }
    );

    const data = await response.json(); // 👈 mover esto antes

    if (!response.ok) {
      console.log("ERROR BACKEND:", data);
      throw new Error(data.message || "Error al crear solicitud");
    }

    alert("Solicitud creada correctamente ✅");
    navigate("/solicitudes");

  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    alert(error.message);
  }
};

  return (
    <div className="form-container">
      <h2 className="form-title">Nueva Solicitud</h2>
      <p className="form-subtitle">
        Complete la información requerida para registrar la actividad
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              value={formulario.fecha}
              disabled
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Solicitante</label>
            <input
              type="text"
              value={usuarioLogueado?.nombre || ""}
              disabled
              className="form-input"
            />
          </div>

          <div className="form-group full">
            <label className="form-label">Actividad</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Describa la actividad"
            />
          </div>

          <div className="form-group full">
            <label className="form-label">Justificación</label>
            <textarea
              name="justificacion"
              rows="5"
              value={formulario.justificacion}
              onChange={handleChange}
              required
              className="form-textarea"
              placeholder="Explique el motivo"
            />
          </div>

        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/mis-solicitudes")}
            className="btn-cancel"
          >
            Cancelar
          </button>

          <button type="submit" className="btn-submit">
            Enviar Solicitud
          </button>
        </div>
      </form>
    </div>
  );
}