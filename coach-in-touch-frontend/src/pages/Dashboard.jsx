import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [perfil, setPerfil] = useState(null); //estado para guardar el perfil
  const [loading, setLoading] = useState(true);

  //carga perfil de usuario al entrar al Dashboard
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/perfil/me", {
          headers: { "x-auth-token": token },
        });
        setPerfil(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setLoading(false); // Dejamos de cargar aunque falle para mostrar algo
      }
    };
    fetchPerfil();
  }, []);

  //funcion cierre sesion
  const handleLogout = () => {
    localStorage.removeItem("token"); //borra token
    window.location.href = "/login"; //fuerza recarga y redirige al login
  };

  if (loading) return <h1>Cargando tu Dashboard</h1>;
  if (!perfil)
    return <h1>Error al cargar perfil. Intenta iniciar sesión nuevamente.</h1>;

  return (
    <div>
      <h1>¡Bienvenido, {perfil.nombre}!</h1>
      <p>
        Has iniciado sesión como: <strong>{perfil.rol}</strong>
      </p>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/perfil">
          <button>Ir a mi Perfil</button>
        </Link>

        {/*boton de chat para entrenador/deportista y no admin*/}
        {perfil.rol !== "administrador" && (
          <Link to="/chat" style={{ marginLeft: "10px" }}>
            <button style={{ backgroundColor: "#4a4ae2" }}>Mis Mensajes</button>
          </Link>
        )}
      </div>

      {/*boton solo para deportistas*/}
      {perfil.rol === "deportista" && (
        <>
          <Link to="/entrenadores">
            <button>Buscar Entrenadores</button>
          </Link>
          <Link to="/mis-solicitudes-enviadas" style={{ marginLeft: "10px" }}>
            <button style={{ backgroundColor: "#2a9d8f" }}>
              Ver mis Solicitudes
            </button>
          </Link>
          <Link to="/mi-progreso" style={{ marginLeft: "10px" }}>
            <button style={{ backgroundColor: "#e9c46a", color: "black" }}>
              Mi Progreso
            </button>
          </Link>
        </>
      )}

      {/*boton solo entrenadores*/}
      {perfil.rol === "entrenador" && (
        <>
          <Link to="/mis-solicitudes">
            <button style={{ backgroundColor: "#2a9d8f" }}>
              Gestionar Solicitudes
            </button>
          </Link>
          <Link to="/mis-valoraciones" style={{ marginLeft: "10px" }}>
            <button style={{ backgroundColor: "#e9c46a", color: "black" }}>
              Ver mis Valoraciones
            </button>
          </Link>
        </>
      )}

      {/*botones admin*/}
      {perfil.rol === "administrador" && (
        <Link to="/admin/pendientes" style={{ marginLeft: "10px" }}>
          <button style={{ backgroundColor: "#e76f51" }}>Panel de Admin</button>
        </Link>
      )}

      {/*boton cerrar sesion*/}
      <div
        style={{
          marginTop: "30px",
          borderTop: "1px solid #444",
          paddingTop: "20px",
        }}
      >
        <button onClick={handleLogout} style={{ backgroundColor: "#ff4d4d" }}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
