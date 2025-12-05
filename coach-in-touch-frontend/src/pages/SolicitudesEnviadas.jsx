import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm";

function SolicitudesEnviadas() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/solicitudes/enviadas",
        {
          headers: { "x-auth-token": token },
        }
      );
      setSolicitudes(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar solicitudes enviadas:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Cargando tus solicitudes</h1>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mis Solicitudes Enviadas</h1>
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
              <h3>Solicitud a: {solicitud.entrenador_nombre}</h3>
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

              {/*feedback (HU-003)*/}
              {solicitud.estado === "aceptada" && (
                <div
                  style={{
                    marginTop: "15px",
                    borderTop: "1px solid #444",
                    paddingTop: "10px",
                  }}
                >
                  {/*consulta si ya tiene feedback*/}
                  {solicitud.tiene_feedback ? (
                    <div
                      style={{
                        color: "#2a9d8f",
                        fontStyle: "italic",
                        fontWeight: "bold",
                      }}
                    >
                      Ya has enviado tu valoración a este entrenador.
                    </div>
                  ) : (
                    //si no tiene feedback muestra el formulario
                    <FeedbackForm entrenadorId={solicitud.entrenador_id} />
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No has enviado ninguna solicitud.</p>
        )}
      </div>
    </div>
  );
}

export default SolicitudesEnviadas;
