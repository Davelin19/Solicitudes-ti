import { useEffect, useState } from "react";
import TablaSolicitudes from "../components/TablaSolicitudes";
import "../assets/css/tablaSolicitudes.css";

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userString = localStorage.getItem("userData");

    // 🔥 Si no hay usuario guardado
    if (!userString) {
      window.location.href = "/";
      return;
    }

    const userData = JSON.parse(userString);

    console.log("Usuario logueado:", userData);

    // 🔥 Ajusta esto según cómo guardes el id
    const userId = userData.id || userData?.idapp?.id;

    if (!userId) {
      console.log("No se encontró id del usuario");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/solicitudes/solicitanteYResponsable/${userId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar solicitudes");
        }
        return res.json();
      })
      .then((data) => {
        setSolicitudes(data);
      })
      .catch((err) => {
        console.error("Error cargando solicitudes:", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  return (
    <div className="content">
      <div className="page-wrapper">
        <div className="card">
          <h1 className="page-title">Mis Solicitudes</h1>
          <p className="page-description">
            Listado de todas las solicitudes que has realizado.
          </p>

          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : (
            <TablaSolicitudes solicitudes={solicitudes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MisSolicitudes;