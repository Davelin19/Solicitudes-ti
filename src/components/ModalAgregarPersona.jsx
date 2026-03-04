import { useState } from "react";
const URL_FOTO_BASE="https://funcionarios.ccvalledupar.org.co/timeittemporal/img/fotoshojadevida"
const ModalAgregarPersona = ({
  visible,
  onClose,
  todasPersonas,
  onAgregar,
}) => {
  const [personaSeleccionada, setPersonaSeleccionada] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("");

  if (!visible) return null;

  const handleAgregar = async () => {
    if (!personaSeleccionada) {
      alert("Selecciona una persona");
      return;
    }
    if(!rolSeleccionado){
        alert("Seleccione un rol");
        return;
    }
    
    const persona = {
        nombre:todasPersonas.filter(p=>p.id==personaSeleccionada)[0].nombre_completo,
        cargo: todasPersonas.filter(p=>p.id==personaSeleccionada)[0].cargo,
        rol: rolSeleccionado,
        foto: `${URL_FOTO_BASE}/${todasPersonas.filter(p=>p.id==personaSeleccionada)[0].foto}`,
        id_aplicativo: todasPersonas.filter(p=>p.id==personaSeleccionada)[0].id
    }
    await onAgregar(persona);
    setPersonaSeleccionada("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Agregar Persona al Equipo</h2>

        <select
        name="TodasPersonas"
          value={personaSeleccionada}
          onChange={(e) =>
            setPersonaSeleccionada(e.target.value)
          }
        >
          <option value="" name="TodasPersonas">
            Selecciona una persona
          </option>
          
          
          {todasPersonas.map((persona) => (
            <option
            name="TodasPersonas"
              key={persona.id}
              value={persona.id}
            >
              {persona.id} - {persona.nombre_completo}
            </option>
          ))}
        </select>
        <form action="">
            {personaSeleccionada&&<div className="modal-registro-personas">
            <img width="100" src={`${URL_FOTO_BASE}/${todasPersonas.filter(p=>p.id==personaSeleccionada)[0].foto}`} alt={todasPersonas.filter(p=>p.id==personaSeleccionada)[0].nombre_completo} />
            <br/><label>ID App</label>
            <input type="text" value={todasPersonas.filter(p=>p.id==personaSeleccionada)[0].id} disabled />
            <label>Nombre</label>
            <input type="text" value={todasPersonas.filter(p=>p.id==personaSeleccionada)[0].nombre_completo} disabled />
            <label>Cargo</label>
            <input type="text" value={todasPersonas.filter(p=>p.id==personaSeleccionada)[0].cargo} disabled />
            <label htmlFor="rol">Rol</label>
            <select  value={rolSeleccionado} onChange={(e)=>setRolSeleccionado(e.target.value)}>
                <option value="" defaultChecked>Seleccione un rol</option>
                <option value="Superadministrador">Superadministrador</option>
                <option value="Administrador">Administrador</option>
                <option value="Desarrollador" >Desarrollador</option>
                <option value="Soporte">Soporte</option>
                <option value="Gestion">Gestión</option>
                </select>
            </div>}
         </form>

        <div className="modal-actions">
          <button onClick={handleAgregar}>
            ✅ Agregar
          </button>

          <button onClick={onClose}>
            ❌ Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarPersona;