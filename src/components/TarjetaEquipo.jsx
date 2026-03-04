import "../assets/css/tarjetaEquipo.css";

const TarjetaEquipo = ({ foto, nombre, rol, cargo }) => {
  return (
    <div className="tarjeta-equipo">
      <div className="tarjeta-imagen">
        <img src={foto} alt={nombre} />
      </div>

      <div className="tarjeta-info">
        <h2>{nombre}</h2>
        <h4>{rol}</h4>
        <p>{cargo}</p>
      </div>
    </div>
  );
};

export default TarjetaEquipo;
