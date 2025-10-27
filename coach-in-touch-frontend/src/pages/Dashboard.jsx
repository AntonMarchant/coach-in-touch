import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  //funcion cierre sesion
  const handleLogout = () => {
    localStorage.removeItem("token"); //borra token
    window.location.href = "/login"; //fuerza recarga y redirige al login
  };

  return (
    <div>
      <h1>bienvenido a tu dashboard</h1>
      <p>has iniciado sesión correctamente.</p>

      <Link to="/perfil">
        <button>ir a mi perfil</button>
      </Link>

      <button onClick={handleLogout} style={{ backgroundColor: "#ff4d4d" }}>
        cerrar sesion
      </button>
    </div>
  );
}

export default Dashboard;
