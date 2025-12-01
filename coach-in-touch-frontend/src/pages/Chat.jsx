import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

//conecta el backend
const socket = io("http://localhost:5000");

function Chat() {
  const [conversaciones, setConversaciones] = useState([]);
  const [chatActivo, setChatActivo] = useState(null); //chat seleccionado
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [miPerfil, setMiPerfil] = useState(null); //para saber cual es el id de usuario

  //cargar los datos del usuario actual y sus conversaciones al inicio
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      const token = localStorage.getItem("token");

      //obtiene su id
      const resPerfil = await axios.get("http://localhost:5000/api/perfil/me", {
        headers: { "x-auth-token": token },
      });
      setMiPerfil(resPerfil.data);

      //obtiene su inbox
      const resChat = await axios.get("http://localhost:5000/api/chat", {
        headers: { "x-auth-token": token },
      });
      setConversaciones(resChat.data);
    };
    cargarDatosIniciales();
  }, []);

  //recibe mensajes en tiempo real (super epico)
  useEffect(() => {
    //cuando del servidor manda un mensaje
    socket.on("receive_message", (mensaje) => {
      //solo se agrega si pertenece al chat que este viendo en el momento
      if (chatActivo && mensaje.conversacion_id === chatActivo.id) {
        setMensajes((prev) => [...prev, mensaje]);
      }
    });

    //limpia al salir
    return () => socket.off("receive_message");
  }, [chatActivo]);

  //selecciona un chat
  const seleccionarChat = async (conversacion) => {
    setChatActivo(conversacion);

    //une al chat del socket espeficico
    socket.emit("join_chat", conversacion.id);

    //craga el historial de mensajes
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/chat/${conversacion.id}`,
      {
        headers: { "x-auth-token": token },
      }
    );
    setMensajes(res.data);
  };

  //envia el mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const datosMensaje = {
      conversacionId: chatActivo.id,
      emisorId: miPerfil.usuario_id, //es importante usar el id correcto del perfil/usuario
      contenido: nuevoMensaje,
    };

    //manda evento al servidor y socket.io hace lo demas
    await socket.emit("send_message", datosMensaje);

    setNuevoMensaje(""); //limpia el input
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        height: "80vh",
        marginTop: "20px",
      }}
    >
      {/*lista de chats a la izq*/}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #444",
          paddingRight: "10px",
        }}
      >
        <h3>Mis Chats</h3>
        {conversaciones.map((conv) => (
          <div
            key={conv.id}
            onClick={() => seleccionarChat(conv)}
            style={{
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                chatActivo?.id === conv.id ? "#333" : "transparent",
              borderBottom: "1px solid #555",
            }}
          >
            <strong>{conv.otro_usuario_nombre}</strong>
          </div>
        ))}
      </div>

      {/*chat activo a la derecha*/}
      <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
        {chatActivo ? (
          <>
            <h3>Chat con {chatActivo.otro_usuario_nombre}</h3>

            {/*zona de mensajes*/}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                border: "1px solid #555",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              {mensajes.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    textAlign:
                      msg.emisor_id === miPerfil.usuario_id ? "right" : "left",
                    margin: "5px 0",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        msg.emisor_id === miPerfil.usuario_id
                          ? "#2a9d8f"
                          : "#555",
                      padding: "5px 10px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  >
                    {msg.contenido}
                  </span>
                </div>
              ))}
            </div>

            {/*el input para enviar el msj*/}
            <form
              onSubmit={enviarMensaje}
              style={{ display: "flex", marginTop: "10px" }}
            >
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{ flex: 1 }}
              />
              <button type="submit">Enviar</button>
            </form>
          </>
        ) : (
          <p>Selecciona una conversacion para comenzar a chatear.</p>
        )}
      </div>
    </div>
  );
}

export default Chat;
