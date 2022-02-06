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

const roleTypes = {
  admin: "Administrador",
  manager: "Gerente",
  collaborator: "Colaborador",
  user: "User",
  guest: "Invitado",
};

module.exports = {
  roles,
  roleTypes,
  branches,
  cleanUpActions,
  deepCleanUpActivities,
};
