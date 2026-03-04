import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaHistorialActividades from "../components/TablaHistorialActividades";
import "../assets/css/historial.css";

const Historial = () => {
  const navigate = useNavigate();
  const [actividades, setActividades] = useState([]);

  // 🔹 Cargar actividades desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("actividades");
    if (data) {
      setActividades(JSON.parse(data));
    }
  }, []);

  // 🔹 Solo ver
  const handleVer = (actividad) => {
    navigate(`/actividades/ver/${actividad.id}`);
  };

  return (
    <div className="historial-page">
      <h1 className="historial-title">📜 Historial de Actividades</h1>

      <TablaHistorialActividades
        actividades={actividades}
        onVer={handleVer}
      />
    </div>
  );
};

export default Historial;
