const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const validateJwt = (req = request, res = response, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  
  if (!token)
    return res
      .status(401)
      .json({ ok: false, msg: "No token, autorización denegada" });

  try {
    jwt.verify(token, process.env.SECRET_JWT_SEED, (err, user) => {
      if (err) return res.status(403).json({ ok: false, msg: "Token no valido" });

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json({ ok: false, msg: "Token no valido" });
  }
};

module.exports = { validateJwt };
