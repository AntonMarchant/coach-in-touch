import React, { useState, useEffect } from "react";
import axios from "axios";
import FeedbackForm from "../components/FeedbackForm"; //importa formulario

function SolicitudesEnviadas() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchSolicitudes();
  }, []);

  if (loading) {
    return <h1>Cargando tus solicitudes</h1>;
  }

  return (
    <div>
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
              }}
            >
              <h3>Solicitud a: {solicitud.entrenador_nombre}</h3>
              <p>
                <strong>Estado:</strong> {solicitud.estado}
              </p>

              {/*logica del Feedback HU-003*/}
              {solicitud.estado === "aceptada" && (
                <FeedbackForm entrenadorId={solicitud.entrenador_id} />
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
