import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [perfil, setPerfil] = useState({
    nombre: "",
    biografia: "",
    objetivos: "",
    experiencia: "",
    certificaciones: "",
    deporte_id: 1, //deja deporte por defecto al crear cuenta  (se cambiara)
    rol: "",
  });

  const navigate = useNavigate();

  //carga datos al inicio con useEffect
  //ejecuta automaticamente el hook cuando se carga el componente
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/perfil/me", {
          headers: { "x-auth-token": token },
        });
        setPerfil(res.data); //llena el estado con datos almacenados en el backend
      } catch (error) {
        console.error("error al cargar el perfil:", error);
      }
    };
    fetchPerfil();
  }, []); //array vacio = se ejecuta solo una vez

  //maneja cambios
  const onChange = (e) => {
    setPerfil({ ...perfil, [e.target.name]: e.target.value });
  };

  //maneja envio
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/perfil/me", perfil, {
        headers: { "x-auth-token": token },
      });

      alert("perfil actualizado con exito");
      navigate("/dashboard"); //devuelve al dashboard
    } catch (error) {
      console.error(error.response.data);
      alert("error al actualizar el perfil.");
    }
  };

  return (
    <div>
      <h1>edita tu perfil de {perfil.rol}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={perfil.nombre}
            onChange={onChange}
          />
        </div>
        <div>
          <label>biografia:</label>
          <textarea
            name="biografia"
            value={perfil.biografia || ""}
            onChange={onChange}
          />
        </div>

        {/*renderizado condicional*/}

        {/*mostrar solo si rol=deportista*/}
        {perfil.rol === "deportista" && (
          <div>
            <label>tus objetivos:</label>
            <textarea
              name="objetivos"
              value={perfil.objetivos || ""}
              onChange={onChange}
            />
          </div>
        )}

        {/*mostrar solo si rol=entrenador*/}
        {perfil.rol === "entrenador" && (
          <>
            <div>
              <label>tu experiencia:</label>
              <textarea
                name="experiencia"
                value={perfil.experiencia || ""}
                onChange={onChange}
              />
            </div>
            <div>
              <label>tus certificaciones:</label>
              <textarea
                name="certificaciones"
                value={perfil.certificaciones || ""}
                onChange={onChange}
              />
            </div>
          </>
        )}

        <button type="submit">actualizar perfil</button>
      </form>
    </div>
  );
}

export default Profile;
