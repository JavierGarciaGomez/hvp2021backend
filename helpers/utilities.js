const dayjs = require("dayjs");
const { roleTypes } = require("../types/types");

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

module.exports = {
  getDateWithoutTime,
  convertDateToUTC,
  checkIfElementExists,
  validateMaxDays,
  isAuthorizedByRole,
  checkIfOwner,
  isAuthorizeByRoleOrOwnership,
};
