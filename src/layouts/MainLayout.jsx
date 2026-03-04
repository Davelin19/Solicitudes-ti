import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../assets/css/layout.css";

const MainLayout = () => {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  return (
    <div className="app-layout">
      <Sidebar
        abierto={sidebarAbierto}
        setAbierto={setSidebarAbierto}
      />

      <main
        className={`main-content ${
          sidebarAbierto ? "with-sidebar" : "full"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
