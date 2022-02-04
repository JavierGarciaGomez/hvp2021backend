const uncatchedError = (error, res) => {
  console.log(error);
  res.status(500).json({
    ok: false,
    msg: "Hable con el administrador",
    error: error.msg,
  });
};

module.exports = {
  uncatchedError,
};
