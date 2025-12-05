import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPanel() {
  const [pendientes, setPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  //carga lista de entrenadores pendientes
  useEffect(() => {
    fetchPendientes();
  }, []);

  const fetchPendientes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/api/admin/pendientes",
        {
          headers: { "x-auth-token": token },
        }
      );
      setPendientes(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  //funcion para validar un entrenador
  const handleValidar = async (entrenadorId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/validar/${entrenadorId}`,
        {},
        { headers: { "x-auth-token": token } }
      );

      alert("¡Entrenador validado con éxito!");
      //vuelve a cargar lista para que entrenador desaparezca de solicitudes pendientes
      fetchPendientes();
    } catch (error) {
      alert("Error: " + error.response.data.msg);
    }
  };

  if (loading) return <h1>Cargando</h1>;

  return (
    <div>
      <h1>Panel de Administración</h1>
      <h2>Entrenadores Pendientes</h2>
      {pendientes.length > 0 ? (
        pendientes.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #666",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "8px",
            }}
          >
            <h3>{p.nombre}</h3>
            <p>{p.correo}</p>

            <div style={{ marginTop: "10px", color: "#ddd" }}>
              <p>
                <strong>Deporte:</strong> {p.deporte || "No especificado"}
              </p>
              <p>
                <strong>Biografía:</strong> {p.biografia || "Sin información"}
              </p>
              <p>
                <strong>Experiencia:</strong>{" "}
                {p.experiencia || "Sin información"}
              </p>
              <p>
                <strong>Certificaciones:</strong>{" "}
                {p.certificaciones || "Sin información"}
              </p>
            </div>

            <button
              onClick={() => handleValidar(p.id)}
              style={{ backgroundColor: "#2a9d8f" }}
            >
              Validar entrenador ✅
            </button>
          </div>
        ))
      ) : (
        <p>No hay entrenadores pendientes de validación.</p>
      )}
    </div>
  );
}

export default AdminPanel;
