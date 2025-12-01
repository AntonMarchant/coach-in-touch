import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; //lee el id de la url

function ProgresoDeportista() {
  const { deportistaId } = useParams(); //obtiene id del deportista
  const [registros, setRegistros] = useState([]);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    titulo: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(true);

  //carga historial del deportista
  useEffect(() => {
    fetchHistorial();
  }, [deportistaId]);

  const fetchHistorial = async () => {
    try {
      const token = localStorage.getItem("token");
      //llama la ruta con id para ver el historial del deportista
      const res = await axios.get(
        `http://localhost:5000/api/progreso/historial/${deportistaId}`,
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

  //el entrenador agrega una observacion nueva
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/progreso",
        { ...nuevoRegistro, deportistaId }, //incluye el id del deportista
        { headers: { "x-auth-token": token } }
      );

      alert("¡Observacion agregada!");
      setNuevoRegistro({ titulo: "", descripcion: "" });
      fetchHistorial();
    } catch (error) {
      alert(
        "Error al guardar: " +
          (error.response?.data?.msg || "Error desconocido")
      );
    }
  };

  if (loading) return <h1>Cargando historial del deportista</h1>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Historial del Deportista</h1>

      {/*form para entrenador*/}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>Agregar Observación / Nota</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Título (ej: Evaluacion mensual/semanal)"
            value={nuevoRegistro.titulo}
            onChange={(e) =>
              setNuevoRegistro({ ...nuevoRegistro, titulo: e.target.value })
            }
            required
            style={{ width: "100%" }}
          />
          <textarea
            placeholder="Escribe tus observaciones para el deportista"
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
            style={{ backgroundColor: "#e76f51", width: "200px" }}
          >
            Agregar Nota
          </button>
        </form>
      </div>

      {/*lista de registro*/}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {registros.length > 0 ? (
          registros.map((reg) => (
            <div
              key={reg.id}
              style={{
                borderLeft:
                  reg.autor_rol === "entrenador"
                    ? "5px solid #e76f51"
                    : "5px solid #646cff",
                backgroundColor: "#333",
                padding: "15px",
                borderRadius: "4px",
              }}
            >
              <h4 style={{ margin: "0 0 5px 0", color: "#fff" }}>
                {reg.titulo}
              </h4>
              <small
                style={{
                  color: "#aaa",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                Escrito por:{" "}
                <strong>
                  {reg.autor_nombre} ({reg.autor_rol})
                </strong>{" "}
                - {new Date(reg.fecha_creacion).toLocaleDateString()}
              </small>
              <p style={{ margin: 0, color: "#ccc" }}>{reg.descripcion}</p>
            </div>
          ))
        ) : (
          <p>Este deportista aun no tiene registros.</p>
        )}
      </div>
    </div>
  );
}

export default ProgresoDeportista;
