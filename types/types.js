const roles = ["Administrador", "Gerente", "Colaborador", "User", "Invitado"];

const branches = ["Urban", "The Harbor", "Montejo"];

const cleanUpActions = {
  addCleaner: "addCleaner",
  addSupervisor: "addSupervisor",
  addComment: "addComment",
};

const deepCleanUpActivities = [
  "correctOrder",
  "wasteDisposal",
  "cleanedEquipment",
  "cleanedCages",
  "cleanedDrawers",
  "cleanedRefrigerator",
  "everyAreaCleaned",
];

module.exports = {
  roles,
  branches,
  cleanUpActions,
  deepCleanUpActivities,
};
