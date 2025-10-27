//este middleware asume que authMiddlewar se ejecuto bien y que req.usuario esta disp
module.exports = function (req, res, next) {
  if (req.usuario.rol !== "administrador") {
    return res
      .status(403)
      .json({ msg: "Acceso denegado. Se requiere rol de administrador." });
  }

  //si es admin da el ok
  next();
};
