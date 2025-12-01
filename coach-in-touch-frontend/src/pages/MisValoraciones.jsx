import React, { useState, useEffect } from "react";
import axios from "axios";

function MisValoraciones() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/feedback/mis-feedbacks",
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
  }, []);

  if (loading) return <h1>Cargando valoraciones</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Mis Valoraciones y Comentarios</h1>

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
          <p>
            Aun no tienes valoraciones, sigue trabajando duro con tus
            deportistas!
          </p>
        )}
      </div>
    </div>
  );
}

export default MisValoraciones;
