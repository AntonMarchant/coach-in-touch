import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; //importa hook para navegar

function Entrenadores() {
  const [entrenadores, setEntrenadores] = useState([]); //guarda la lista
  const [loading, setLoading] = useState(true); //mostrar un mensaje de carga
  const token = localStorage.getItem("token"); //verificar si el usuario esta logueado
  const navigate = useNavigate(); //inicia el hook

  //carga lista de entrenadores
  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        //funcion busqueda (HU-09)
        const res = await axios.get(
          "http://localhost:5000/api/usuarios/entrenadores"
        );
        setEntrenadores(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar entrenadores:", error);
        setLoading(false);
      }
    };
    fetchEntrenadores();
  }, []);

  //funcion para manejar la solicitud (HU-01)
  const handleSolicitud = async (entrenadorId) => {
    if (!token) {
      alert(
        "por favor, inicia sesion como deportista para enviar una solicitud."
      );
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/solicitudes/${entrenadorId}`,
        {}, //cuerpo vacio
        { headers: { "x-auth-token": token } }
      );
      alert("¡Solicitud enviada exitosamente!");
    } catch (error) {
      //muestra el error que da el backend
      alert("Error al enviar la solicitud: " + error.response.data.msg);
    }
  };

  //funcion para iniciar Chat (HU-08)
  const handleIniciarChat = async (entrenadorId) => {
    try {
      //llama al backend para crear una conversacion o traer una existente
      await axios.post(
        "http://localhost:5000/api/chat/iniciar",
        { otroUsuarioId: entrenadorId },
        { headers: { "x-auth-token": token } }
      );
      //redirige a la pagina de los chats
      navigate("/chat");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar chat");
    }
  };

  if (loading) {
    return <h1>Cargando entrenadores...</h1>;
  }

  //mensaje de carga
  return (
    <div>
      <h1>Encuentra tu entrenador</h1>
      <div
        className="entrenadores-lista"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {entrenadores.length > 0 ? (
          entrenadores.map((entrenador) => (
            <div
              key={entrenador.id}
              style={{
                border: "1px solid #555",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "#2a2a2a",
              }}
            >
              <h2>
                {entrenador.nombre} {entrenador.validado && "✅"}
              </h2>
              <p>
                <strong>Deporte:</strong> {entrenador.deporte}
              </p>
              <p>
                <strong>Experiencia:</strong>{" "}
                {entrenador.experiencia || "No especificada"}
              </p>

              {/*botones visibles solo si hay token*/}
              {token && (
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "10px" }}
                >
                  <button onClick={() => handleSolicitud(entrenador.id)}>
                    Solicitar
                  </button>

                  {/*bpton de chat*/}
                  <button
                    onClick={() => handleIniciarChat(entrenador.id)}
                    style={{ backgroundColor: "#4a4ae2" }}
                  >
                    Chat
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay entrenadores disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default Entrenadores;
