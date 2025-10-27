const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //obtener token del header
  const token = req.header("x-auth-token");

  //verificar si no hay token
  if (!token) {
    return res.status(401).json({ msg: "no hay token, permiso no valido." });
  }

  //validar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded.usuario; //guarda los datos del usuario id y rol
    next(); //token valido, pasa la peticion
  } catch (error) {
    res.status(401).json({ msg: "token no es valido." });
  }
};
