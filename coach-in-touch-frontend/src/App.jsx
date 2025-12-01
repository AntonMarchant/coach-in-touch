import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; //incluye toastify (para notis)
import "react-toastify/dist/ReactToastify.css"; //css de toastify
import io from "socket.io-client"; //importa el socket

//importa paginas
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Entrenadores from "./pages/Entrenadores";
import MisSolicitudes from "./pages/MisSolicitudes";
import AdminPanel from "./pages/AdminPanel";
import SolicitudesEnviadas from "./pages/SolicitudesEnviadas";
import Chat from "./pages/Chat";
import Progreso from "./pages/Progreso";
import ProgresoDeportista from "./pages/ProgresoDeportista";
import MisValoraciones from "./pages/MisValoraciones";

//importa el guardia
import RutaProtegida from "./components/RutaProtegida";

//inicia el socket fuera del componente para que no se reconecte en cada render de la aplicacion
const socket = io("http://localhost:5000");

function App() {
  //efecto para toda la aplicacion para escuchar notificaciones
  useEffect(() => {
    socket.on("nueva_notificacion", (data) => {
      //muestra la notificacion
      toast.info(data.mensaje, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });

    //limpieza al desmontar la noti
    return () => {
      socket.off("nueva_notificacion");
    };
  }, []);

  return (
    <Router>
      {/*contenedor de notis*/}
      <ToastContainer />

      <Routes>
        {/*rutas publicas*/}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/entrenadores" element={<Entrenadores />} />

        {/*rutas privadas*/}
        <Route element={<RutaProtegida />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
          <Route
            path="/mis-solicitudes-enviadas"
            element={<SolicitudesEnviadas />}
          />
          <Route path="/admin/pendientes" element={<AdminPanel />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/mi-progreso" element={<Progreso />} />
          <Route
            path="/progreso-deportista/:deportistaId"
            element={<ProgresoDeportista />}
          />
          <Route path="/mis-valoraciones" element={<MisValoraciones />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
