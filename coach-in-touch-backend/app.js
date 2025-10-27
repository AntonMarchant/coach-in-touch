const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config(); //carga las variables desde .env

//middlewares
app.use(cors());
app.use(express.json()); //permite a express entender JSON

//definir las Rutas
app.get("/", (req, res) => {
  res.send("¡API de Coach In Touch funcionando!");
});

//usa las rutas de autenticacion
app.use("/api/auth", require("./routes/authRoutes"));

//usa las rutas de perfil
app.use("/api/perfil", require("./routes/perfilRoutes"));

//usa las rutas de usuarios publicos
app.use("/api/usuarios", require("./routes/usuarioRoutes"));

//usa las rutas de las solicitudes
app.use("/api/solicitudes", require("./routes/solicitudRoutes"));

//usa las rutas de admin
app.use("/api/admin", require("./routes/adminRoutes"));

//usa las rutas de feedback
app.use("/api/feedback", require("./routes/feedbackRoutes"));

//iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
