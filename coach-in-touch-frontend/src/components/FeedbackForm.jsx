import React, { useState } from "react";
import axios from "axios";

//recibe id de entrenador como una prop
function FeedbackForm({ entrenadorId }) {
  const [puntuacion, setPuntuacion] = useState(5); //por defecto 5 estrellas
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false); //para ocultar el form despues de enviarlo

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "¿Estas seguro de que quieres enviar esta valoración? No podras cambiarla despues."
      )
    ) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `http://localhost:5000/api/feedback/${entrenadorId}`,
          { puntuacion: parseInt(puntuacion), comentario },
          { headers: { "x-auth-token": token } }
        );
        alert("¡Feedback enviado con éxito!");
        setEnviado(true); //oculta formulario
      } catch (error) {
        alert("Error al enviar feedback: " + error.response.data.msg);
      }
    }
  };

  //si se envio muestra mensaje de agradecimiento
  if (enviado) {
    return <p style={{ color: "#2a9d8f" }}>Gracias por tu valoracion</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: "10px",
        borderTop: "1px solid #444",
        paddingTop: "10px",
      }}
    >
      <h4>Deja tu Feedback:</h4>
      <div>
        <label>Puntuación (1-5): </label>
        <select
          value={puntuacion}
          onChange={(e) => setPuntuacion(e.target.value)}
        >
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="1">1 ⭐</option>
        </select>
      </div>
      <div style={{ marginTop: "10px" }}>
        <textarea
          placeholder="Escribe un breve comentario sobre tu experiencia"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          style={{ width: "100%", minHeight: "80px" }}
        />
      </div>
      <button
        type="submit"
        style={{ backgroundColor: "#e76f51", marginTop: "10px" }}
      >
        Enviar Feedback
      </button>
    </form>
  );
}

export default FeedbackForm;
