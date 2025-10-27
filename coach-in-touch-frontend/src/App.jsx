import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//importar paginas
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

//importar guardia
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <Router>
      <Routes>
        {/*Rutas publicas*/}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/*rutas privadas*/}
        <Route element={<RutaProtegida />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
