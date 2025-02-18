const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate")
const { validarCampos } = require("../middlewares/validate-camps");
const router = Router();
const { validateJwt } = require("../middlewares/validate-jwt");
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/event.controller");

//Todas tienen que pasar por la validación del JWT
router.use(validateJwt);

//Obtener eventos
router.get("/", getEventos);

// Crear un nuevo evento

router.post(
  "/",
  [
    check("title", "El titulo es obligatorio").not().isEmpty(),
    check("start", "Fecha de inicio es obligatoria").custom(isDate),
    check("end", "Fecha finalización es obligatoria").custom(isDate),
    validarCampos,
  ],
  crearEvento
);

//Actualizar evento

router.put("/:id", actualizarEvento);

//Borrar evento

router.delete("/:id", eliminarEvento);

module.exports = router;
