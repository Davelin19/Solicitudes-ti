import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditarAvance = () => {
  const { id } = useParams(); // ID DE LA HIJA
  const navigate = useNavigate();

  const [avance, setAvance] = useState(0);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("actividades")) || [];

    data.forEach((padre) => {
      const hija = padre.hijas?.find((h) => h.id === Number(id));
      if (hija) {
        setAvance(hija.avances);
      }
    });
  }, [id]);

  const guardar = () => {
    const data = JSON.parse(localStorage.getItem("actividades")) || [];

    const actualizado = data.map((padre) => ({
      ...padre,
      hijas: padre.hijas?.map((hija) =>
        hija.id === Number(id)
          ? { ...hija, avances: Number(avance) }
          : hija
      ),
    }));

    localStorage.setItem("actividades", JSON.stringify(actualizado));
    navigate(-1);
  };

  return (
    <div className="form-card">
      <h2>Editar avance</h2>

      <label>Avance (%)</label>
      <input
        type="number"
        min="0"
        max="100"
        value={avance}
        onChange={(e) => setAvance(e.target.value)}
      />

      <button onClick={guardar}>Guardar</button>
    </div>
  );
};

export default EditarAvance;
