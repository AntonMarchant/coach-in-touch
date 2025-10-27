import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function RutaProtegida() {
  const token = localStorage.getItem("token");

  if (!token) {
    //sin token redirige al login
    return <Navigate to="/login" />;
  }

  //con token muestra el componente hijo como el dashboard
  return <Outlet />;
}

export default RutaProtegida;
