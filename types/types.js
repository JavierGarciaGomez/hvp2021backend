const roles = ["Administrador", "Gerente", "Colaborador", "User", "Invitado"];
const authEnum = ["Login", "Logout", "Register"];

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

const authTypes = {
  login: "Login",
  logout: "Logout",
  register: "Register",
};

module.exports = {
  roles,
  roleTypes,
  authTypes,
  authEnum,
  branches,
  cleanUpActions,
  deepCleanUpActivities,
};
