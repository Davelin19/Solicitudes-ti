import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../assets/css/sidebar.css";

const Sidebar = ({ abierto, setAbierto }) => {
  const [gestionAbierta, setGestionAbierta] = useState(false);
  const [gestionAbierta1, setGestionAbierta1] = useState(false);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));
  const rol = userData?.idapp.rol;

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <>
      {!abierto && (
        <button
          className="floating-toggle"
          onClick={() => setAbierto(true)}
        >
          ☰
        </button>
      )}

      <aside className={`sidebar ${!abierto ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Sistema</h2>
          <button className="toggle-btn" onClick={() => setAbierto(false)}>
            ☰
          </button>
        </div>

        <nav className="sidebar-menu">

          {/* ===== SOLICITUDES ===== */}
          <div className="menu-section">
            <p className="menu-title">Solicitudes</p>

            <Link to="/" className="menu-item">
              📄 Mis Solicitudes
            </Link>

            {/* Solo admin y usuario pueden registrar */}
           <Link to="/nueva-solicitud" className="menu-item">
            ➕ Registrar Solicitud
          </Link>

            {/* Gestión solo admin y gestor */}
            {(rol === "Superadministrador") && (
              <>
                <button
                  className="menu-item menu-toggle"
                  onClick={() => setGestionAbierta(!gestionAbierta)}
                >
                  🛠 Gestión
                  <span className={`arrow ${gestionAbierta ? "open" : ""}`}>
                    ▶
                  </span>
                </button>

                {gestionAbierta && (
                  <div className="submenu">
                    <Link to="/gestion" className="submenu-item">
                      📋 Gestión Solicitudes
                    </Link>

                    <Link to="/solicitudes-pendientes" className="submenu-item">
                      ⏳ Solicitudes Pendientes
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ===== MATRIZ ===== */}
          <div className="menu-section">
            <p className="menu-title">Matriz de Actividades</p>

            <button
              className="menu-item menu-toggle"
              onClick={() => setGestionAbierta1(!gestionAbierta1)}
            >
              📂 Actividades
              <span className={`arrow ${gestionAbierta1 ? "open" : ""}`}>
                ▶
              </span>
            </button>

            {gestionAbierta1 && (
              <div className="submenu">
                <Link to="/gestion-actividades" className="submenu-item">
                  📋 Mis Actividades
                </Link>
              {(rol === "Superadministrador") && (
                <Link to="/actividades" className="submenu-item">
                  🛠 Gestión de Actividades
                </Link>
              )}
              </div>
            )}

            <Link to="/historial" className="menu-item">
              🕒 Historial
            </Link>

            {/* Equipo solo admin */}
            
              <Link to="/equipo" className="menu-item">
                👥 Equipo
              </Link>
          </div>

          {/* ===== CERRAR SESIÓN ===== */}
          <div className="menu-section">
            <button className="menu-item logout-btn" onClick={handleLogout}>
              🚪 Cerrar Sesión
            </button>
          </div>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;