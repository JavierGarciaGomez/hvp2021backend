const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const DailyCleanup = require("../models/DailyCleanup");
const { branches } = require("../types/types");
const { getDateWithoutTime } = require("../helpers/utilities");
var dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const checkCleanUpsAndGenerate = async (req, res = response) => {
  const date = dayjs().utc(true).startOf("day");
  console.log("date", date);

  for (branch of branches) {
    for (i = 0; i < 7; i++) {
      const newDate = date.subtract(i, "day");
      // console.log("branch", branch, i);

      let dailyCleanUp = await DailyCleanup.findOne({ date: newDate, branch });
      if (!dailyCleanUp) {
        dailyCleanUp = new DailyCleanup({
          date: newDate,
          branch,
        });
        const savedDailyCleanUp = await dailyCleanUp.save();
      }
    }
  }

  // console.log("hey", i);
  // }

  res.json({
    ok: true,
    msg: "generado",
    date,
  });
};

const editCleanUp = async (req, res = response) => {
  const { branch } = req.body;
  const id = req.params.dailyCleanUpId;
  const date = dayjs();
  console.log(branch, date);

  const utcDateStart = dayjs(date).utc(true).startOf("day");
  const utcDateEnd = utcDateStart.add(1, "day");

  let dailyCleanUp = await DailyCleanup.findOne({
    date: {
      $gte: new Date(utcDateStart),
      $lt: new Date(utcDateEnd),
    },
    branch,
  });

  res.json({ id, branch, date, dailyCleanUp });

  // const date = dayjs().utc(true).startOf("day");
  // console.log("date", date);

  // for (branch of branches) {
  //   for (i = 0; i < 7; i++) {
  //     const newDate = date.subtract(i, "day");
  //     // console.log("branch", branch, i);

  //     let dailyCleanUp = await DailyCleanup.findOne({ date: newDate, branch });
  //     if (!dailyCleanUp) {
  //       dailyCleanUp = new DailyCleanup({
  //         date: newDate,
  //         branch,
  //       });
  //       const savedDailyCleanUp = await dailyCleanUp.save();
  //     }
  //   }
  // }

  // console.log("hey", i);
  // }

  // res.json({
  //   ok: true,
  //   msg: "generado",
  //   date,
  // });
};

module.exports = { checkCleanUpsAndGenerate, editCleanUp };
