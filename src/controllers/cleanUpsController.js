const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../data/models/CollaboratorModel");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const DailyCleanup = require("../models/DailyCleanUp");
const { cleanUpActions, deepCleanUpActivities } = require("../types/types");
const {
  checkIfElementExists,
  validateMaxDays,
} = require("../helpers/utilities");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { getCollaboratorById } = require("./collaboratorsController");
const DeepCleanUp = require("../models/DeepCleanUp");
const OperatingRoomCleanUp = require("../models/OperatingRoomCleanUp");
const { uncatchedError } = require("../helpers/const");
const {
  default: CollaboratorModel,
} = require("../data/models/CollaboratorModel");
dayjs.extend(utc);

const getAllCleanUpsFromLastMonth = async (req, res = response) => {
  try {
    // today date
    const date = dayjs().utc(true).startOf("day");

    const utcDateEnd = dayjs(date).utc(true).endOf("day");
    const utcDateStart = utcDateEnd.subtract(1, "month");

    let deepCleanUps = await DeepCleanUp.find({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
    })
      .populate("cleaners.cleaner", "imgUrl col_code")
      .populate("supervisors.supervisor", "imgUrl col_code");

    let dailyCleanUps = await DailyCleanup.find({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
    })
      .populate("cleaners.cleaner", "imgUrl col_code")
      .populate("supervisors.supervisor", "imgUrl col_code");

    let operatingRoomCleanUps = await OperatingRoomCleanUp.find({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
    })
      .populate("cleaners.cleaner", "imgUrl col_code")
      .populate("supervisors.supervisor", "imgUrl col_code");

    res.json({
      ok: true,
      msg: "generado",
      allCleanUps: {
        deepCleanUps,
        dailyCleanUps,
        operatingRoomCleanUps,
      },
    });
  } catch (error) {
    uncatchedError(error, res);
  }
};

const getDailyCleanUpsAndGenerate = async (req, res = response) => {
  try {
    const { branch } = req.params;
    const date = dayjs().utc(true).startOf("day");

    // create registers for the last seven days if they doesn't exist
    for (let i = 0; i < 7; i++) {
      const newDate = date.subtract(i, "day");
      // console.log("branch", branch, i);

      let dailyCleanUp = await DailyCleanup.findOne({ date: newDate, branch });
      if (!dailyCleanUp) {
        dailyCleanUp = new DailyCleanup({
          date: newDate,
          branch,
        });
        await dailyCleanUp.save();
      }
    }

    // start and endi dates that will be retrieved
    const utcDateEnd = dayjs(date).utc(true).endOf("day");
    const utcDateStart = utcDateEnd.subtract(7, "day");

    let dailyCleanUps = await DailyCleanup.find({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
      branch,
    })
      .populate("cleaners.cleaner", "imgUrl col_code")
      .populate("supervisors.supervisor", "imgUrl col_code")
      .populate("comments.comment", "imgUrl col_code");

    res.json({
      ok: true,
      msg: "generado",
      dailyCleanUps,
    });
  } catch (error) {
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const updateDailyCleanUp = async (req, res = response) => {
  try {
    const { dailyCleanUpId } = req.params;
    const { action, comment } = req.body;
    const { uid } = req;

    let dailyCleanUp = await DailyCleanup.findById(dailyCleanUpId);

    if (!dailyCleanUp) {
      return res.status(404).json({
        ok: false,
        msg: "No existe control de limpieza diario con ese ese id",
      });
    }

    const currentDate = dayjs();
    if (!validateMaxDays(dailyCleanUp.date, currentDate, 4)) {
      return res.status(404).json({
        ok: false,
        msg: "No puedes actualizar un registro antiguo",
      });
    }

    const collaborator = await CollaboratorModel.findById(uid);
    console.log({ dailyCleanUp });

    switch (action) {
      case cleanUpActions.addCleaner:
        for (const element of dailyCleanUp.cleaners) {
          if (element.cleaner._id.toString() === uid) {
            return res.status(404).json({
              ok: false,
              msg: "Este colaborador ha sido ya registrado",
            });
          }
        }
        // add the cleaner
        dailyCleanUp.cleaners.push({ cleaner: collaborator, time: dayjs() });
        break;

      case cleanUpActions.addSupervisor:
        for (const element of dailyCleanUp.supervisors) {
          if (element.supervisor._id.toString() === uid) {
            return res.status(404).json({
              ok: false,
              msg: "Este colaborador ha sido ya registrado",
            });
          }
        }
        // add the supervisor
        dailyCleanUp.supervisors.push({
          supervisor: collaborator,
          time: dayjs(),
        });
        break;

      case cleanUpActions.addComment:
        dailyCleanUp.comments.push({ comment, creator: collaborator });
        break;

      default:
        break;
    }

    dailyCleanUp.hasBeenUsed = true;
    // update it
    const updatedDailyCleanUp = await DailyCleanup.findByIdAndUpdate(
      dailyCleanUpId,
      dailyCleanUp,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      message: "great",
      updatedDailyCleanUp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

const createDeepCleanUp = async (req, res = response) => {
  try {
    const date = dayjs();
    const {
      branch,
      activities = [],
      comment,
      iscleaner,
      issupervisor,
    } = req.body;

    const { uid } = req;

    const utcDateStart = dayjs(date).utc(true).startOf("day");
    const utcDateEnd = dayjs(utcDateStart).add(1, "day");

    // TODO
    let deepCleanUp = await DeepCleanUp.findOne({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
      branch,
    });

    if (deepCleanUp) {
      return res.status(404).json({
        ok: false,
        msg: `No se pueden registrar dos limpiezas profundas en la misma sucursal (${branch}) el mismo día`,
      });
    }

    deepCleanUp = new DeepCleanUp();
    const collaborator = await CollaboratorModel.findById(uid);
    activities.map((activity) => {
      if (deepCleanUpActivities.includes(activity)) {
        deepCleanUp.activities[activity] = true;
      } else {
        return res.status(400).json({
          ok: false,
          msg: `Esta actividad no existe`,
        });
      }
    });

    if (iscleaner)
      deepCleanUp.cleaners.push({ cleaner: collaborator, time: dayjs() });
    if (issupervisor) {
      console.log("si es supervisor");
      deepCleanUp.supervisors.push({ supervisor: collaborator, time: dayjs() });
    }

    deepCleanUp.date = date;
    deepCleanUp.branch = branch;
    if (comment) deepCleanUp.comments.push({ comment, creator: collaborator });

    await deepCleanUp.save();

    res.status(201).json({
      ok: true,
      message: "great",
      date,
      branch,
      deepCleanUp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const updateDeepCleanUp = async (req, res = response) => {
  try {
    const { deepCleanUpId } = req.params;
    const { activities = [], comment, iscleaner, issupervisor } = req.body;
    const { uid } = req;

    let deepCleanUp = await DeepCleanUp.findById(deepCleanUpId);

    if (!deepCleanUp) {
      return res.status(400).json({
        ok: false,
        msg: "No existe limpieza profunda con ese ese id",
      });
    }

    const date = deepCleanUp.date;
    const currentDate = dayjs();
    if (!validateMaxDays(date, currentDate, 5)) {
      return res.status(404).json({
        ok: false,
        msg: "No puedes actualizar un registro antiguo",
      });
    }

    const collaborator = await CollaboratorModel.findById(uid);

    let newActivities = {};
    deepCleanUpActivities.forEach((activity) => {
      if (activities.includes(activity)) {
        newActivities[activity] = true;
      } else {
        newActivities[activity] = false;
      }
    });

    deepCleanUp.activities = newActivities;

    // add cleaner, supervisor or comment
    if (
      iscleaner &&
      !checkIfElementExists(deepCleanUp.cleaners, "cleaner", uid)
    ) {
      deepCleanUp.cleaners.push({ cleaner: collaborator, time: dayjs() });
    }

    if (
      issupervisor &&
      !checkIfElementExists(deepCleanUp.supervisors, "supervisor", uid)
    ) {
      deepCleanUp.supervisors.push({ supervisor: collaborator, time: dayjs() });
    }

    if (comment) deepCleanUp.comments.push({ comment, creator: collaborator });

    const updatedDeepCleanUp = await DeepCleanUp.findByIdAndUpdate(
      deepCleanUpId,
      { ...deepCleanUp },
      { new: true }
    );

    res.status(201).json({
      ok: true,
      message: "great",
      updatedDeepCleanUp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const getDeepCleanUps = async (req, res = response) => {
  try {
    const { branch } = req.params;
    const date = dayjs().utc(true).startOf("day");

    const utcDateEnd = dayjs(date).utc(true).endOf("day");
    const utcDateStart = utcDateEnd.subtract(1, "month");
    let deepCleanUps = await DeepCleanUp.find({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
      branch,
    })
      .populate("cleaners.cleaner", "imgUrl col_code")
      .populate("supervisors.supervisor", "imgUrl col_code")
      .populate("comments.comment", "imgUrl col_code");

    res.json({
      ok: true,
      msg: "generado",
      deepCleanUps,
    });
  } catch (error) {
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const getDeepCleanUp = async (req, res = response) => {
  try {
    const { deepCleanUpId } = req.params;

    let deepCleanUp = await DeepCleanUp.findById(deepCleanUpId);
    res.json({
      ok: true,
      msg: "deepCleanUp devuelto",
      deepCleanUp,
    });
  } catch (error) {
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const createOperatingRoomCleanUp = async (req, res = response) => {
  try {
    const { branch } = req.params;
    const { uid } = req;
    const date = dayjs();

    let operatingRoomCleanUp = new OperatingRoomCleanUp();
    const collaborator = await CollaboratorModel.findById(uid);
    operatingRoomCleanUp.cleaners.push({
      cleaner: collaborator,
      time: dayjs(),
    });

    operatingRoomCleanUp.date = date;
    operatingRoomCleanUp.branch = branch;

    await operatingRoomCleanUp.save();

    res.status(201).json({
      ok: true,
      message: "great",
      date,
      branch,
      operatingRoomCleanUp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const getOperatingRoomCleanUps = async (req, res = response) => {
  try {
    const { branch } = req.params;
    const date = dayjs().utc(true).startOf("day");

    const utcDateEnd = dayjs(date).utc(true).endOf("day");
    const utcDateStart = utcDateEnd.subtract(2, "week");
    let operatingRoomCleanUps = await OperatingRoomCleanUp.find({
      date: {
        $gte: new Date(utcDateStart),
        $lt: new Date(utcDateEnd),
      },
      branch,
    })
      .populate("cleaners.cleaner", "imgUrl col_code")
      .populate("supervisors.supervisor", "imgUrl col_code")
      .populate("comments.comment", "imgUrl col_code");

    res.json({
      ok: true,
      operatingRoomCleanUps,
    });
  } catch (error) {
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error: error.message,
    });
  }
};

const updateOperatingRoomCleanUp = async (req, res = response) => {
  try {
    const { operatingRoomCleanUpId } = req.params;
    const { action, comment } = req.body;
    const { uid } = req;

    let operatingRoomCleanUp = await OperatingRoomCleanUp.findById(
      operatingRoomCleanUpId
    );

    if (!operatingRoomCleanUp) {
      return res.status(404).json({
        ok: false,
        msg: "No existe control de limpieza diario con ese ese id",
      });
    }

    const date = operatingRoomCleanUp.date;
    const currentDate = dayjs();
    if (!validateMaxDays(date, currentDate, 2)) {
      return res.status(404).json({
        ok: false,
        msg: "No puedes actualizar un registro antiguo",
      });
    }

    const collaborator = await CollaboratorModel.findById(uid);

    switch (action) {
      case cleanUpActions.addCleaner:
        for (element of operatingRoomCleanUp.cleaners) {
          if (element.cleaner._id.toString() === uid) {
            return res.status(404).json({
              ok: false,
              msg: "Este colaborador ha sido ya registrado",
            });
          }
        }
        // add the cleaner
        operatingRoomCleanUp.cleaners.push({
          cleaner: collaborator,
          time: dayjs(),
        });
        break;

      case cleanUpActions.addSupervisor:
        for (element of operatingRoomCleanUp.supervisors) {
          if (element.supervisor._id.toString() === uid) {
            return res.status(404).json({
              ok: false,
              msg: "Este colaborador ha sido ya registrado",
            });
          }
        }
        // add the supervisor
        operatingRoomCleanUp.supervisors.push({
          supervisor: collaborator,
          time: dayjs(),
        });
        break;

      case cleanUpActions.addComment:
        operatingRoomCleanUp.comments.push({ comment, creator: collaborator });
        break;

      default:
        break;
    }

    operatingRoomCleanUp.hasBeenUsed = true;
    // update it
    const updatedOperatingRoomCleanUp =
      await OperatingRoomCleanUp.findByIdAndUpdate(
        operatingRoomCleanUpId,
        operatingRoomCleanUp,
        { new: true }
      );

    res.status(201).json({
      ok: true,
      message: "great",
      updatedOperatingRoomCleanUp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: "false",
      msg: "Por favor, hable con el administrador",
      error,
    });
  }
};

module.exports = {
  getDailyCleanUpsAndGenerate,
  updateDailyCleanUp,
  createDeepCleanUp,
  getDeepCleanUps,
  getDeepCleanUp,
  updateDeepCleanUp,
  getOperatingRoomCleanUps,
  updateOperatingRoomCleanUp,
  createOperatingRoomCleanUp,
  getAllCleanUpsFromLastMonth,
};
