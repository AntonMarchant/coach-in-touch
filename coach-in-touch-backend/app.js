//backend actualizado ahora usando socket.io para el chat
const express = require("express");
const cors = require("cors");
const http = require("http"); //importa el modulo hhtp nativo de node
const { Server } = require("socket.io"); //importa el servidor de socket.io
require("dotenv").config(); //carga las variables desde .env

//IMPORTANTEE importa el Chat
const Chat = require("./models/Chat");

const app = express();

//config de middlewares
app.use(cors());
app.use(express.json()); //permite a express entender JSON

//definiccion de rutas tipo REST
app.get("/", (req, res) => {
  res.send("¡API de Coach In Touch funcionando!");
});

//usa las rutas de autenticacion
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/perfil", require("./routes/perfilRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/solicitudes", require("./routes/solicitudRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/progreso", require("./routes/progresoRoutes"));
app.use("/api/foro", require("./routes/postRoutes"));

//congif del servidor a real time con socket.io

//crea el servidor http manual usando express
const server = http.createServer(app);

//inicia socket.io sobre ese servidor
const io = new Server(server, {
  cors: {
    //IMPORTANTISIMO esto permite que el frontend se conecte bien
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//hace io accesible para toda la app
app.set("socketio", io);

//logica detras del chat
io.on("connection", (socket) => {
  console.log(`Usuario conectado al socket: ${socket.id}`);

  //permite unirse a un chat especifico
  socket.on("join_chat", (conversacionId) => {
    socket.join(conversacionId); //crea chat con el id de la conversacion
    console.log(`Usuario ${socket.id} se unió a la sala: ${conversacionId}`);
  });

  //envia  mensaje
  socket.on("send_message", async (data) => {
    const { conversacionId, emisorId, contenido } = data;

    try {
      //guarda el mensaje en la bbdd
      const mensajeGuardado = await Chat.guardarMensaje(
        conversacionId,
        emisorId,
        contenido
      );

      //envia el mensaje a todos los que esten en el chat incluyendo al que lo envio esto hace
      //que aparezca en tiempo real en ambas pantallas (epico)
      io.to(conversacionId).emit("receive_message", mensajeGuardado);
    } catch (error) {
      console.error("Error al procesar mensaje en socket:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

//inicia el servidor
const PORT = process.env.PORT || 5000;
//ahora con el cambio se usa server.listen en vez de app.listen
server.listen(PORT, () => {
  console.log(`Servidor con WebSockets corriendo en http://localhost:${PORT}`);
});
