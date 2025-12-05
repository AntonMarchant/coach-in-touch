import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Entrenadores() {
  const [entrenadores, setEntrenadores] = useState([]); //guarda la lista
  const [loading, setLoading] = useState(true); //mostrar un mensaje de carga

  //estados para los filtros
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaDeporte, setBusquedaDeporte] = useState("");

  const token = localStorage.getItem("token"); //verificar si el usuario esta logueado
  const navigate = useNavigate();

  //carga lista de entrenadores
  const fetchEntrenadores = async () => {
    setLoading(true);
    try {
      //crea URL con parametros tipo query (ej /api/usuarios/entrenadores?nombre=juan&deporte=futbol)
      const params = new URLSearchParams();
      if (busquedaNombre) params.append("nombre", busquedaNombre);
      if (busquedaDeporte) params.append("deporte", busquedaDeporte);

      const res = await axios.get(
        `http://localhost:5000/api/usuarios/entrenadores?${params.toString()}`
      );
      setEntrenadores(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar entrenadores:", error);
      //error 404 si es que no hay resultados con esos filtros
      if (error.response && error.response.status === 404) {
        setEntrenadores([]);
      }
      setLoading(false);
    }
  };

  //carga al inicio sin filtros
  useEffect(() => {
    fetchEntrenadores();
  }, []);

  //maneja la subida del formulario de busqueda
  const handleBuscar = (e) => {
    e.preventDefault();
    fetchEntrenadores();
  };

  //limpia filtros de busqueda
  const handleLimpiar = () => {
    setBusquedaNombre("");
    setBusquedaDeporte("");
    //fuerza una recarga limpia
    window.location.reload();
  };

  //funcion para manejar la solicitud (HU-01)
  const handleSolicitud = async (entrenadorId) => {
    if (!token) {
      alert(
        "Por favor inicia sesión como deportista para enviar una solicitud."
      );
      return;
    }
    try {
      await axios.post(
        `http://localhost:5000/api/solicitudes/${entrenadorId}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      alert("Solicitud enviada exitosamente");
    } catch (error) {
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
      alert("Error al iniciar chat");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Encuentra tu Entrenador</h1>

      {/*barra de busqueda*/}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <form
          onSubmit={handleBuscar}
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#333",
              color: "white",
            }}
          />
          <select
            value={busquedaDeporte}
            onChange={(e) => setBusquedaDeporte(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #555",
              backgroundColor: "#333",
              color: "white",
            }}
          >
            <option value="">Todos los deportes</option>
            <option value="Atletismo">Atletismo</option>
            <option value="Baloncesto">Baloncesto</option>
            <option value="Tenis">Tenis</option>
            <option value="Fútbol">Fútbol</option>
            <option value="Voleibol">Voleibol</option>
          </select>
          <button type="submit" style={{ backgroundColor: "#646cff" }}>
            Buscar 🔍
          </button>
          <button
            type="button"
            onClick={handleLimpiar}
            style={{ backgroundColor: "#555" }}
          >
            Limpiar
          </button>
        </form>
      </div>

      {/*lista de resultados*/}
      {loading ? (
        <h2>Cargando</h2>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {entrenadores.length > 0 ? (
            entrenadores.map((entrenador) => (
              <div
                key={entrenador.id}
                style={{
                  border: "1px solid #555",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  backgroundColor: "#222",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h2 style={{ margin: 0 }}>
                    {entrenador.nombre} {entrenador.validado && "✅"}
                  </h2>
                  <span
                    style={{
                      backgroundColor: "#333",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "0.9rem",
                      color: "#e9c46a",
                    }}
                  >
                    {entrenador.deporte || "General"}
                  </span>
                </div>

                {/*informacion entrenador*/}
                <p>
                  <strong>Biografía:</strong>{" "}
                  {entrenador.biografia || "Sin biografía"}
                </p>
                <p>
                  <strong>Experiencia:</strong>{" "}
                  {entrenador.experiencia || "No especificada"}
                </p>
                <p>
                  <strong>Certificaciones:</strong>{" "}
                  {entrenador.certificaciones || "No detalladas"}
                </p>

                {token && (
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button onClick={() => handleSolicitud(entrenador.id)}>
                      Solicitar
                    </button>
                    <button
                      onClick={() => handleIniciarChat(entrenador.id)}
                      style={{ backgroundColor: "#4a4ae2" }}
                    >
                      Chat
                    </button>
                    <button
                      onClick={() => navigate(`/opiniones/${entrenador.id}`)}
                      style={{ backgroundColor: "#e9c46a", color: "black" }}
                    >
                      Ver Opiniones
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No se encontraron entrenadores.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Entrenadores;
