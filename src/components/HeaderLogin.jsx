import React from "react";

const HeaderLogin = () => {
  return (
    <div id="header">
      <div className="header-text">
        <h1>Inicio de Sesión</h1>
        <p>Ingresa tus credenciales para continuar</p>
      </div>

      <div className="logos">
        <img
          src="https://ccvalledupar.org.co/wp-content/uploads/2022/09/logo-ccv-marca-pais.png"
          alt="Logo Cámara de Comercio"
        />
      </div>
    </div>
  );
};

export default HeaderLogin;
