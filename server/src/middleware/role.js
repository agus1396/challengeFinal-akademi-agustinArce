module.exports = function checkRole(...allowedRoles) {
  return (req, res, next) => {
    //console.log(requiredRole)
    //console.log(req.user.role)

    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .send({ error: "Acceso denegado: no tienes permisos suficientes" });
    }
    next();
  };
};
