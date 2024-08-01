// Rutas de Usuarios / Auth
// host + /api/auth

const { Router } = require("express");
const { check } = require("express-validator");
const router = Router();

const { validarCampos } = require("../middlewares/validate-camps");
const {
  crearUsuario,
  login,
  autenticated,
} = require("../controllers/auth.controller");
const { validateJwt } = require("../middlewares/validate-jwt");

router.post(
  "/register",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/login",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  login
);

router.get("/autenticated", validateJwt, autenticated);

module.exports = router;
