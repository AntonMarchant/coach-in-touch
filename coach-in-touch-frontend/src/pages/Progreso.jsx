import React, { useState, useEffect } from "react";
import axios from "axios";

function Progreso() {
  const [registros, setRegistros] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    titulo: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(true);

  //cargar el historial al iniciar
  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem("token");
      //llamam a la ruta sin id para obtener el historial personal
      const res = await axios.get(
        "http://localhost:5000/api/progreso/historial",
        {
          headers: { "x-auth-token": token },
        }
      );
      setRegistros(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar progreso:", error);
      setLoading(false);
    }
  };

  //guarda nuevo avance
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/progreso", nuevoRegistro, {
        headers: { "x-auth-token": token },
      });

      alert("¡Progreso registrado!");
      setNuevoRegistro({ titulo: "", descripcion: "" }); //limpia form
      fetchHistorial(); //recarga lista
    } catch (error) {
      alert(
        "Error al guardar: " +
          (error.response?.data?.msg || "Error desconocido")
      );
    }
  };

  if (loading) return <h1>Cargando tu historial...</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Progreso de Entrenamiento</h1>

      {/*formulario de nuevo registro*/}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>Registrar Nuevo Avance</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Título (ej: Entrenamiento de resistencia)"
            value={nuevoRegistro.titulo}
            onChange={(e) =>
              setNuevoRegistro({ ...nuevoRegistro, titulo: e.target.value })
            }
            required
            style={{ width: "100%" }}
          />
          <textarea
            placeholder="Detalles (ej: Logre correr 10 km con mi entrenamiento)"
            value={nuevoRegistro.descripcion}
            onChange={(e) =>
              setNuevoRegistro({
                ...nuevoRegistro,
                descripcion: e.target.value,
              })
            }
            required
            style={{ width: "100%", minHeight: "80px" }}
          />
          <button
            type="submit"
            style={{ backgroundColor: "#2a9d8f", width: "200px" }}
          >
            Guardar registro
          </button>
        </form>
      </div>

      {/*lista de historial*/}
      <h3>Historial de Progresos</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {registros.length > 0 ? (
          registros.map((reg) => (
            <div
              key={reg.id}
              style={{
                borderLeft: "5px solid #646cff",
                backgroundColor: "#333",
                padding: "15px",
                borderRadius: "4px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", color: "#fff" }}>
                {reg.titulo}
              </h4>
              <p style={{ margin: 0, color: "#ccc" }}>{reg.descripcion}</p>
              <small
                style={{ color: "#888", display: "block", marginTop: "10px" }}
              >
                Registrado el:{" "}
                {new Date(reg.fecha_creacion).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p>Aun no tienes registros, ¡comienza hoy!</p>
        )}
      </div>
    </div>
  );
}

export default Progreso;
