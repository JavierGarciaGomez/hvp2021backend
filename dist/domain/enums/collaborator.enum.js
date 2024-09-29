"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.Degree = exports.WebAppRole = void 0;
var WebAppRole;
(function (WebAppRole) {
    WebAppRole["admin"] = "Administrador";
    WebAppRole["manager"] = "Gerente";
    WebAppRole["collaborator"] = "Colaborador";
    WebAppRole["user"] = "User";
    WebAppRole["guest"] = "Invitado";
})(WebAppRole || (exports.WebAppRole = WebAppRole = {}));
var Degree;
(function (Degree) {
    Degree["HighSchool"] = "Bachillerato";
    Degree["UniversityStudent"] = "Estudiante universitario";
    Degree["BachelorComplete"] = "Licenciatura completa";
    Degree["Graduated"] = "Titulado";
    Degree["Masters"] = "Maestr\u00EDa";
    Degree["Doctorate"] = "Doctorado";
    Degree["Other"] = "Otros";
})(Degree || (exports.Degree = Degree = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "Masculino";
    Gender["Female"] = "Femenino";
    Gender["Other"] = "Otro";
})(Gender || (exports.Gender = Gender = {}));
