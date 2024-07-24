"use strict";
const uncatchedError = (error, res) => {
    console.log("este es el error", error);
    res.status(500).json({
        ok: false,
        msg: "Hable con el administrador",
        error: error.message,
    });
};
module.exports = {
    uncatchedError,
};
