import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  //estado guarda correo/contraseña
  const [formData, setFormData] = useState({
    correo: "",
    contrasena: "",
  });

  const navigate = useNavigate();

  //maneja cambios
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //maneja envio
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      //llamada a la API (axios)
      //lama endpoint del login
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      //guarda token en almacenamiento local del navegador
      localStorage.setItem("token", res.data.token);

      console.log("Token guardado:", res.data.token);
      alert("inicio de sesion exitoso");

      navigate("/dashboard");
    } catch (error) {
      console.error(error.response.data);
      alert("error al iniciar sesion: " + error.response.data.msg);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="correo electrnico"
            name="correo"
            value={formData.correo}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="contraseña"
            name="contrasena"
            value={formData.contrasena}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit">iniciar sesión</button>
      </form>
    </div>
  );
}

export default Login;
