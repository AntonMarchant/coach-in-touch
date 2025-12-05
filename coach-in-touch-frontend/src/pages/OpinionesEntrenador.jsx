import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function OpinionesEntrenador() {
  const { entrenadorId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/feedback/${entrenadorId}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        setFeedbacks(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [entrenadorId]);

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: "15px", backgroundColor: "#555" }}
      >
        ← Volver
      </button>
      <h1>Opiniones del Entrenador</h1>

      {loading ? (
        <h2>Cargando</h2>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {feedbacks.length > 0 ? (
            feedbacks.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #555",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#2a2a2a",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h3 style={{ margin: 0 }}>{item.deportista_nombre}</h3>
                  <span style={{ color: "#e9c46a", fontSize: "1.2rem" }}>
                    {"⭐".repeat(item.puntuacion)}
                  </span>
                </div>
                <p style={{ color: "#ccc", fontStyle: "italic" }}>
                  "{item.comentario}"
                </p>
                <small style={{ color: "#666" }}>
                  {new Date(item.fecha_feedback).toLocaleDateString()}
                </small>
              </div>
            ))
          ) : (
            <p>Este entrenador aún no tiene valoraciones.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default OpinionesEntrenador;
