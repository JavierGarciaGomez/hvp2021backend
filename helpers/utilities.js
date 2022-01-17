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

const convertDateToUTC = (date) =>
  new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

module.exports = { getDateWithoutTime, convertDateToUTC, checkIfElementExists };
