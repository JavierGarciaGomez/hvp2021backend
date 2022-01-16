const { response } = require("express");
const bcrypt = require("bcryptjs");
const Collaborator = require("../models/Collaborator");
// const Usuario = require("../models/Usuario");
const { generateJWT } = require("../helpers/jwt");
const { body } = require("express-validator");
const DailyCleanup = require("../models/DailyCleanup");
const { branches, dailyCleanUpActions } = require("../types/types");
const { getDateWithoutTime } = require("../helpers/utilities");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { getCollaboratorById } = require("./collaboratorsController");
dayjs.extend(utc);

// const checkCleanUpsAndGenerate = async (req, res = response) => {
//   const date = dayjs().utc(true).startOf("day");
//   console.log("date", date);

//   for (branch of branches) {
//     for (i = 0; i < 7; i++) {
//       const newDate = date.subtract(i, "day");
//       // console.log("branch", branch, i);

//       let dailyCleanUp = await DailyCleanup.findOne({ date: newDate, branch });
//       if (!dailyCleanUp) {
//         dailyCleanUp = new DailyCleanup({
//           date: newDate,
//           branch,
//         });
//         const savedDailyCleanUp = await dailyCleanUp.save();
//       }
//     }
//   }

//   // TODO:
//   // return dailycleanups from the last 10 days

//   const utcDateEnd = dayjs(date).utc(true).endOf("day");
//   const utcDateStart = utcDateEnd.subtract(10, "day");

//   let dailyCleanUps = await DailyCleanup.find({
//     date: {
//       $gte: new Date(utcDateStart),
//       $lt: new Date(utcDateEnd),
//     },
//   })
//     .populate("cleaners.cleaner", "imgUrl col_code")
//     .populate("supervisors.supervisor", "imgUrl col_code")
//     .populate("comments.comment", "imgUrl col_code");

//   res.json({
//     ok: true,
//     msg: "generado",
//     dailyCleanUps,
//   });
// };

// const editCleanUp = async (req, res = response) => {
//   console.log("here");
//   const { action, comment, cleanUpId } = req.body;

//   const { uid, col_code, role } = req;

//   try {
//     let dailyCleanUp = await DailyCleanup.findById(cleanUpId);

//     if (!dailyCleanUp) {
//       return res.status(404).json({
//         ok: false,
//         msg: "No existe control de limpieza diario con ese ese id",
//       });
//     }

//     // get collaborator
//     const collaborator = await Collaborator.findById(uid);

//     let updatedDailyCleanUp;

//     switch (action) {
//       case dailyCleanUpActions.addCleaner:
//         for (element of dailyCleanUp.cleaners) {
//           if (element.cleaner._id.toString() === uid) {
//             return res.status(404).json({
//               ok: false,
//               msg: "Este colaborador ha sido ya registrado",
//             });
//           }
//         }
//         // add the cleaner
//         dailyCleanUp.cleaners.push({ cleaner: collaborator, time: dayjs() });
//         break;

//       case dailyCleanUpActions.addSupervisor:
//         for (element of dailyCleanUp.supervisors) {
//           if (element.supervisor._id.toString() === uid) {
//             return res.status(404).json({
//               ok: false,
//               msg: "Este colaborador ha sido ya registrado",
//             });
//           }
//         }
//         // add the supervisor
//         dailyCleanUp.supervisors.push({
//           supervisor: collaborator,
//           time: dayjs(),
//         });

//         console.log("aca maria");
//         break;

//       case dailyCleanUpActions.addComment:
//         dailyCleanUp.comments.push({ comment, creator: collaborator });
//         break;

//       default:
//         break;
//     }
//     if (action === dailyCleanUpActions.addCleaner) {
//     }

//     dailyCleanUp.hasBeenUsed = true;

//     console.log("esto se atualizara", dailyCleanUp);
//     // update it
//     updatedDailyCleanUp = await DailyCleanup.findByIdAndUpdate(
//       cleanUpId,
//       dailyCleanUp,
//       { new: true }
//     );

//     console.log(updatedDailyCleanUp);

//     res.status(201).json({
//       ok: true,
//       message: "great",
//       updatedDailyCleanUp,
//       uid,
//       col_code,
//       role,
//     });
//   } catch (error) {
//     res.status(500).json({
//       ok: "false",
//       msg: "Por favor, hable con el administrador",
//       error,
//     });
//   }
// };

// module.exports = { checkCleanUpsAndGenerate, editCleanUp };
