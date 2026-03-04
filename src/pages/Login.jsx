import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/Login.css";
import HeaderLogin from "../components/HeaderLogin";
import FormLogin from "../components/FormLogin";
import FooterLogin from "../components/FooterLogin";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /solicitudes if already logged in
    if (localStorage.getItem("userData") != null) {
      navigate("/solicitudes");
    }
  }, [navigate]);

  return (
    <div className="login-wrapper">
      {/* LADO IZQUIERDO - Solo visible en pantallas grandes */}
      <div className="login-left">
        <h1>Sistema de Solicitudes de TI</h1>
        <p>Cámara de Comercio de Valledupar</p>
      </div>

      {/* LADO DERECHO */}
      <div className="login-right">
        <div className="login-card">
          <HeaderLogin />
          <FormLogin />
          <FooterLogin />
        </div>
      </div>
    </div>
  );
};

export default Login;
