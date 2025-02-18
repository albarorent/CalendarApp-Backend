const { response } = require("express");
const Event = require("../models/event.schema");

const getEventos = async (req, res = response) => {
  const eventos = await Event.find().populate("user", "name");

  res.json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res = response) => {
  const evento = new Event(req.body);

  try {
    if (!req.user.uid) {
      return res.status(400).json({
        ok: false,
        msg: "El UID del usuario es requerido",
      });
    }

    evento.user = req.user.uid;

    const eventDB = await evento.save();

    res.json({
      ok: true,
      event: eventDB,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error al crear un evento",
    });
  }
};

const actualizarEvento = async (req, res = response) => {
  const eventoId = req.params.id;
  
  
  try {
    const evento = await Event.findById(eventoId);
    
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado por id",
      });
    }
    
    if (evento.user.toString() !== req.user.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de editar este evento",
      });
    }

    const newEvent = {
      ...req.body,
      user: req.uid,
    };

    const eventUpdated = await Event.findByIdAndUpdate(eventoId, newEvent, {
      new: true,
    });

    res.json({
      ok: true,
      evento: eventUpdated,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error al actualizar un evento",
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  const eventoId = req.params.id;

  try {
    const evento = await Event.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado por id",
      });
    }

    if (evento.user.toString() !== req.user.uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegio de eliminar este evento",
      });
    }

    await Event.findByIdAndDelete(eventoId);

    res.json({
      ok: true,
      msg: "Evento eliminado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error al eliminar un evento",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
