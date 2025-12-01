import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; //importa el hook

function MisSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //carga solicitudes recibidas
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      //trae todas las solicitudes pendientes y aceptadas
      const res = await axios.get(
        "http://localhost:5000/api/solicitudes/recibidas",
        {
          headers: { "x-auth-token": token },
        }
      );
      setSolicitudes(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      setLoading(false);
    }
  };

  //funcion de aceptar o rechazar la soli
  const handleResponder = async (solicitudId, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/solicitudes/responder/${solicitudId}`,
        { nuevoEstado },
        { headers: { "x-auth-token": token } }
      );
      //actualiza lista para que la solicitud cambie de estado en la interfaz
      alert(
        `Solicitud ${
          nuevoEstado === "aceptada" ? "aceptada" : "rechazada"
        } con éxito.`
      );
      fetchSolicitudes(); //recarga la lista
    } catch (error) {
      alert("Error al responder: " + error.response.data.msg);
    }
  };

  if (loading) return <h1>Cargando tus solicitudes</h1>;

  return (
    <div>
      <h1>Gestionar Solicitudes</h1>
      <div
        className="solicitudes-lista"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {solicitudes.length > 0 ? (
          solicitudes.map((solicitud) => (
            <div
              key={solicitud.id}
              style={{
                border: "1px solid #555",
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: "#2a2a2a",
              }}
            >
              <h3>Solicitud de: {solicitud.deportista_nombre}</h3>
              <p>
                <strong>Mensaje:</strong> {solicitud.mensaje || "Sin mensaje"}
              </p>
              <p>
                <strong>Estado: </strong>
                <span
                  style={{
                    color:
                      solicitud.estado === "aceptada"
                        ? "#4ade80"
                        : solicitud.estado === "rechazada"
                        ? "#f87171"
                        : "#fbbf24",
                  }}
                >
                  {solicitud.estado.toUpperCase()}
                </span>
              </p>

              {/*botones para pendientes*/}
              {solicitud.estado === "pendiente" && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => handleResponder(solicitud.id, "aceptada")}
                    style={{ backgroundColor: "#2a9d8f" }}
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleResponder(solicitud.id, "rechazada")}
                    style={{ backgroundColor: "#e76f51", marginLeft: "10px" }}
                  >
                    Rechazar
                  </button>
                </div>
              )}

              {/*boton para aceptadas (HU-11)*/}
              {solicitud.estado === "aceptada" && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() =>
                      navigate(
                        `/progreso-deportista/${solicitud.deportista_id}`
                      )
                    }
                    style={{ backgroundColor: "#e9c46a", color: "black" }}
                  >
                    Ver Progreso / Reportar
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No tienes solicitudes (ni pendientes ni aceptadas).</p>
        )}
      </div>
    </div>
  );
}

export default MisSolicitudes;
