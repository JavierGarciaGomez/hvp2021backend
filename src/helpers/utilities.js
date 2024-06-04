const dayjs = require("dayjs");

const CollaboratorLog = require("../models/CollaboratorLog");
const User = require("../models/User");
const UserLog = require("../models/UserLog");
const { roleTypes } = require("../types/types");
const {
  default: CollaboratorModel,
} = require("../data/models/CollaboratorModel");

const getDateWithoutTime = (date = new Date()) => {
  return convertDateToUTC(
    new Date(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

const checkIfElementExists = (collection, objectToCheck, id) => {
  for (element of collection) {
    if (element[objectToCheck]._id.toString() === id) {
      return true;
    }
  }
  return false;
};

const validateMaxDays = (registerDate, updateDate, maxDays) => {
  return maxDays > dayjs(updateDate).diff(dayjs(registerDate), "day");
};

const convertDateToUTC = (date) =>
  new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

const isAuthorizeByRoleOrOwnership = (
  userRole,
  requiredRole,
  userId,
  reqUserId
) => {
  const hasRoleAuth = isAuthorizedByRole(userRole, requiredRole);
  const isSameUser = checkIfOwner(userId, reqUserId);

  if (hasRoleAuth || isSameUser) {
    return true;
  }
  return false;
};

const isAuthorizedByRole = (
  role = roleTypes.guest,
  requiredAuthorization = roleTypes.admin
) => {
  roleTypes;
  if (requiredAuthorization === roleTypes.admin) {
    if (role === roleTypes.admin) return true;
  }
  if (requiredAuthorization === roleTypes.manager) {
    if (role === roleTypes.admin || role === roleTypes.manager) return true;
  }
  if (requiredAuthorization === roleTypes.collaborator) {
    if (
      role === roleTypes.admin ||
      role === roleTypes.manager ||
      role === roleTypes.collaborator
    )
      return true;
  }
  if (requiredAuthorization === roleTypes.user) {
    if (
      role === roleTypes.admin ||
      role === roleTypes.manager ||
      role === roleTypes.collaborator ||
      role === roleTypes.user
    )
      return true;
  }
  return false;
};

const checkIfOwner = (userId, userFoundId) => {
  return userId === userFoundId;
};

// method to generate a new log
const registerLog = async (userType, user, action) => {
  // asign the lastLogin to user
  const date = new Date();
  user.lastLogin = date;

  // create the authlog
  let authLog;
  // collaborator: save the authlog
  if (userType === "collaborator") {
    authLog = new CollaboratorLog({
      date,
      collaborator: user,
      action,
    });

    // update the collaborator with the last login

    await CollaboratorModel.findByIdAndUpdate(user.id, {
      ...user,
    });
  }
  if (userType === "user") {
    authLog = new UserLog({
      date,
      user,
      action,
    });

    await User.findByIdAndUpdate(user.id, {
      ...user,
    });
  }

  await authLog.save();
};

const convertMongooseObjectIdToString = (ObjectId) => {
  return ObjectId.toString();
};

const printSmth = () => {
  console.log("LLEGUE AL PRINT");
};

module.exports = {
  getDateWithoutTime,
  convertDateToUTC,
  checkIfElementExists,
  validateMaxDays,
  isAuthorizedByRole,
  checkIfOwner,
  isAuthorizeByRoleOrOwnership,
  registerLog,
  convertMongooseObjectIdToString,
  printSmth,
};
