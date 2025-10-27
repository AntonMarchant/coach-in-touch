import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  //usa useState para guardar lo que escribe el usuario
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    rol: "deportista", //valor por defecto
    deporte_id: "1", //valor por defecto, como string se maneja mejor en formularios
  });

  //permite enviar al usuario a otra pagina
  const navigate = useNavigate();

  //funcion activa cada vez que usuario escribe en un campo
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //funcion activa cuando usuario presiona registrar
  const onSubmit = async (e) => {
    e.preventDefault(); //peviene que el formulario recargue la pagina

    try {
      //envia deporte_id como un numero
      const dataParaEnviar = {
        ...formData,
        deporte_id: parseInt(formData.deporte_id),
      };

      //envia datos de estado (datos del form) a backend usando axios
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        dataParaEnviar
      );

      console.log(res.data); //muestra respuesta del backend en consola
      //registro existoso
      alert("registro exitoso, ahora puedes iniciar sesion.");
      navigate("/login");
    } catch (error) {
      console.error(error.response.data);
      alert("error en el registro: " + error.response.data.msg);
    }
  };

  return (
    <div>
      <h1>crea tu nueva cuenta</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="correo electronico"
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

        {/*seleccionar rol*/}
        <div>
          <label>quiero registrarme como:</label>
          <select name="rol" value={formData.rol} onChange={onChange}>
            <option value="deportista">deportista</option>
            <option value="entrenador">entrenador</option>
          </select>
        </div>

        {/*seleccionar deporte*/}
        <div>
          <label>mi deporte principal:</label>
          <select
            name="deporte_id"
            value={formData.deporte_id}
            onChange={onChange}
          >
            <option value="1">atletismo</option>
            <option value="2">baloncesto</option>
            <option value="3">tenis</option>
            <option value="4">futbol</option>
            <option value="5">voleibol</option>
          </select>
        </div>

        <button type="submit">registrar</button>
      </form>
    </div>
  );
}

export default Register;
