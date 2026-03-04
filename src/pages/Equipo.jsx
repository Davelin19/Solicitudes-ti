import { useEffect, useState } from "react";
import TarjetaEquipo from "../components/TarjetaEquipo";
import ModalAgregarPersona from "../components/ModalAgregarPersona";
import "../assets/css/equipo.css";

const Equipo = () => {
  const [todos, setTodos] = useState(null);
  const [equipo, setEquipo] = useState([]);
  const [equipoFiltrado, setEquipoFiltrado] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [superadministrador,setSuperadministrador] = useState(false)

  // 🔥 MODAL AGREGAR
  const [mostrarModal, setMostrarModal] = useState(false);

  // 🔥 MODAL EDITAR
  const [modalEditar, setModalEditar] = useState(false);
  const [actividadEditar, setActividadEditar] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/equipo`)
      .then((res) => res.json())
      .then((data) => {
        setEquipo(data.filter(d=>d.rol!="Suspendido"));
        setEquipoFiltrado(data.filter(d=>d.rol!="Suspendido"));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });

    fetch(`${import.meta.env.VITE_API_URL}/equipo/funcionarios/todos`)
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
     
      if(JSON.parse(localStorage.getItem("userData")).idapp.rol=="Superadministrador"){
        
        setSuperadministrador(true)
      }
  }, []);

  // 🔍 BUSCAR
  const buscarPersona = () => {
    const resultado = equipo.filter((persona) =>
      persona.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setEquipoFiltrado(resultado);
  };

  // 🗑 ELIMINAR
  const eliminarPersona = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta persona?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/equipo/${id}`, {
        method: "DELETE",
      });

      const actualizado = equipo.filter((p) => p.id !== id);
      setEquipo(actualizado);
      setEquipoFiltrado(actualizado);
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  // ➕ AGREGAR
  const agregarPersona = async (persona) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/equipo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(persona),
      });

      const nuevaPersona = await res.json();

      const actualizado = [...equipo, nuevaPersona];
      setEquipo(actualizado);
      setEquipoFiltrado(actualizado);
      setMostrarModal(false);
    } catch (error) {
      alert("Error al agregar persona");
    }
  };

  // ✏ ABRIR MODAL EDITAR
  const abrirModalEditar = (persona) => {
    setActividadEditar(persona);
    setModalEditar(true);
  };

  // ❌ CERRAR MODAL
  const cerrarModalEditar = () => {
    setModalEditar(false);
    setActividadEditar(null);
  };

  // 💾 GUARDAR EDICIÓN
const handleEditar = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/equipo/${actividadEditar.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: actividadEditar.nombre,
          cargo: actividadEditar.cargo,
          rol: actividadEditar.rol,
        }),
      }
    );

    if (!res.ok) throw new Error("Error al actualizar");

    const actualizado = equipo.map((p) =>
      p.id === actividadEditar.id ? actividadEditar : p
    );

    setEquipo(actualizado);
    setEquipoFiltrado(actualizado);
    cerrarModalEditar();
  } catch (error) {
    alert("Error al actualizar persona");
  }
};

  if (loading) return <p>Cargando equipo...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="equipo-page">
      <h1 className="equipo-title">👥 Nuestro Equipo</h1>

      <div className="equipo-actions">
        <div className="equipo-search">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button onClick={buscarPersona}>🔍 Buscar</button>
        </div>

        {superadministrador && (
          <button
            className="btn-agregar"
            onClick={() => setMostrarModal(true)}
          >
            ➕ Agregar
          </button>
        )}
      </div>

      <div className="equipo-grid">
        {equipoFiltrado.map((persona) => (
          <div key={persona.id} className="tarjeta-wrapper">
            <TarjetaEquipo
              foto={persona.foto}
              nombre={persona.nombre}
              rol={persona.rol}
              cargo={persona.cargo}
            />

          {superadministrador && (
            <>
              <button
                className="btn-editar"
                onClick={() => abrirModalEditar(persona)}
              >
                ✏ Editar
              </button>

              <button
                className="btn-eliminar"
                onClick={() => eliminarPersona(persona.id)}
              >
                🗑 Eliminar
              </button>
            </>
          )}
          </div>
        ))}
      </div>

{/* MODAL EDITAR */}
{modalEditar && (
  <div className="modal-overlay">
    <div className="modal-container">
      <h2>Editar Persona</h2>

      <form onSubmit={handleEditar}>
        {/* 🔒 NOMBRE BLOQUEADO */}
        <input
          type="text"
          value={actividadEditar?.nombre || ""}
          onChange={(e) =>
            setActividadEditar({
              ...actividadEditar,
              nombre: e.target.value,
            })
          }
          placeholder="Nombre"
          required
          disabled
        />

        {/* 🔒 CARGO BLOQUEADO */}
        <input
          type="text"
          value={actividadEditar?.cargo || ""}
          onChange={(e) =>
            setActividadEditar({
              ...actividadEditar,
              cargo: e.target.value,
            })
          }
          placeholder="Cargo"
          required
          disabled
        />

        {/* ✅ SOLO SE PODRÁ EDITAR EL ROL */}
        <select
          value={actividadEditar?.rol || ""}
          onChange={(e) =>
            setActividadEditar({
              ...actividadEditar,
              rol: e.target.value,
            })
          }
        >
          <option value="Superadministrador">
            Superadministrador
          </option>
          <option value="Administrador">Administrador</option>
          <option value="Desarrollador">Desarrollador</option>
          <option value="Soporte">Soporte</option>
          <option value="Gestion">Gestion</option>
        </select>

        <div className="modal-buttons">
          <button type="submit" className="btn-guardar">
            💾 Guardar
          </button>

          <button
            type="button"
            className="btn-cancelar"
            onClick={cerrarModalEditar}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <ModalAgregarPersona
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        todasPersonas={todos}
        onAgregar={agregarPersona}
      />
    </section>
  );
};

export default Equipo;