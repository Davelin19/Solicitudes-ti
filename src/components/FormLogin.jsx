import React, { useState } from "react";


export const FormLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);


const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    if (localStorage.getItem("userData") != null) {
      window.location.href = "/solicitudes";
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: username,
        clave: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.mensaje || "Credenciales inválidas");
      return;
    }

    // 🔥 AQUÍ YA TENEMOS EL USUARIO
    console.log("Usuario:", data);

    // Si necesitas idapp
    const responseEquipo = await fetch(
      `${import.meta.env.VITE_API_URL}/equipo/idapp/${data.user.id}`
    );

    const idapp = await responseEquipo.json();

    const userCompleto = {
      ...data,
      idapp: idapp,
    };

    // 🔥 Guardar en localStorage
    localStorage.setItem("userData", JSON.stringify(userCompleto));

    window.location.href = "/solicitudes";

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    setError("Error de conexión. Por favor intenta nuevamente.");
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <form id="form" method="POST" action="/solicitudes" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>Usuario del Sistema</label>
        <input
          type="text"
          placeholder="Usuario del aplicativo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "INGRESAR"}
      </button>
    </form>
  );
};

export default FormLogin;
