const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const DailyCleanup = require("../models/DailyCleanUp");
const {
  branches,
  dailyCleanUpActions,
  deepCleanUpActivities,
} = require("../types/types");
const {
  getDateWithoutTime,
  checkIfElementExists,
} = require("../helpers/utilities");
var dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { getCollaboratorById } = require("./collaboratorsController");
const DeepCleanUp = require("../models/DeepCleanUp");
dayjs.extend(utc);

const getDailyCleanUpsAndGenerate = async (req, res = response) => {
  try {
    const { branch } = req.params;
    const date = dayjs().utc(true).startOf("day");

    // create registers for the last seven days if they doesn't exist
    for (i = 0; i < 7; i++) {
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

    const collaborator = await Collaborator.findById(uid);

    switch (action) {
      case dailyCleanUpActions.addCleaner:
        for (element of dailyCleanUp.cleaners) {
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

      case dailyCleanUpActions.addSupervisor:
        for (element of dailyCleanUp.supervisors) {
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

      case dailyCleanUpActions.addComment:
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
      ok: "false",
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

    console.log("es body", req.body);

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
    console.log("activities", activities);
    const collaborator = await Collaborator.findById(uid);
    activities.map((activity) => {
      if (deepCleanUpActivities.includes(activity)) {
        console.log("activities2", activities);
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

    console.log(deepCleanUp);
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

    const collaborator = await Collaborator.findById(uid);

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
    // todo
    // .populate("activities.correctOrder.cleaner", "imgUrl col_code")
    // .populate("activities.cleanedCages.cleaner", "imgUrl col_code")
    // .populate("activities.wasteDisposal.cleaner", "imgUrl col_code")
    // .populate("activities.cleanedEquipment.cleaner", "imgUrl col_code")
    // .populate("activities.cleanedCages.cleaner", "imgUrl col_code")
    // .populate("activities.cleanedDrawers.cleaner", "imgUrl col_code")
    // .populate("activities.cleanedRefrigerator.cleaner", "imgUrl col_code")
    // .populate("activities.everyAreaCleaned.cleaner", "imgUrl col_code");

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

module.exports = {
  getDailyCleanUpsAndGenerate,
  updateDailyCleanUp,
  createDeepCleanUp,
  getDeepCleanUps,
  getDeepCleanUp,
  updateDeepCleanUp,
};
