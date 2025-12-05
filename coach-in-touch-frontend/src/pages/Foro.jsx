import React, { useState, useEffect } from "react";
import axios from "axios";

function Foro() {
  const [posts, setPosts] = useState([]);
  const [nuevoPost, setNuevoPost] = useState({ titulo: "", contenido: "" });
  const [loading, setLoading] = useState(true);

  //carga posts al inicio
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/foro", {
        headers: { "x-auth-token": token },
      });
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/foro", nuevoPost, {
        headers: { "x-auth-token": token },
      });
      alert("¡Publicación creada!");
      setNuevoPost({ titulo: "", contenido: "" });
      fetchPosts(); //recarga lista
    } catch (error) {
      alert("Error al publicar");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Foro de eventos y anuncios deportivos</h1>

      {/*formulario de publicacion*/}
      <div
        style={{
          backgroundColor: "#2a2a2a",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>Publicar un evento o anuncio</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Título del evento o tema"
            value={nuevoPost.titulo}
            onChange={(e) =>
              setNuevoPost({ ...nuevoPost, titulo: e.target.value })
            }
            required
            style={{ width: "100%" }}
          />
          <textarea
            placeholder="Describe los detalles"
            value={nuevoPost.contenido}
            onChange={(e) =>
              setNuevoPost({ ...nuevoPost, contenido: e.target.value })
            }
            required
            style={{ width: "100%", minHeight: "80px" }}
          />
          <button
            type="submit"
            style={{ backgroundColor: "#646cff", width: "200px" }}
          >
            Publicar
          </button>
        </form>
      </div>

      {/*lista de publicaciones*/}
      {loading ? (
        <h2>Cargando foro</h2>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  border: "1px solid #444",
                  padding: "15px",
                  borderRadius: "8px",
                  backgroundColor: "#222",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ margin: "0 0 10px 0", color: "#e9c46a" }}>
                    {post.titulo}
                  </h3>
                  <small style={{ color: "#888" }}>
                    {new Date(post.fecha_creacion).toLocaleDateString()}
                  </small>
                </div>
                <p style={{ whiteSpace: "pre-wrap", color: "#ddd" }}>
                  {post.contenido}
                </p>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "0.9rem",
                    color: "#aaa",
                    borderTop: "1px solid #333",
                    paddingTop: "5px",
                  }}
                >
                  Publicado por: <strong>{post.autor_nombre}</strong> (
                  {post.autor_rol})
                </div>
              </div>
            ))
          ) : (
            <p>No hay publicaciones aún.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Foro;
