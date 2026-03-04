import { useState } from "react";
import FormularioActividad from "../components/FormularioActividad";

export default function GestionSolicitudes() {
  const [mostrarFormulario, setMostrarFormulario] = useState(true);

  return (
    <div className="p-6">
      {mostrarFormulario && (
        <FormularioActividad
          onCerrar={() => setMostrarFormulario(false)}
        />
      )}
    </div>
  );
}
