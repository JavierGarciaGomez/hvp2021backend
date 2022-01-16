const roles = ["Administrador", "Gerente", "Colaborador", "User", "Invitado"];

const branches = ["Urban", "The Harbor", "Montejo"];

const dailyCleanUpActions = {
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
  "cleanedRefigerator",
  "everyAreaCleaned",
];

module.exports = {
  roles,
  branches,
  dailyCleanUpActions,
  deepCleanUpActivities,
};
