"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthActivityType = void 0;
var AuthActivityType;
(function (AuthActivityType) {
    AuthActivityType["LOGIN"] = "LOGIN";
    AuthActivityType["REFRESH_TOKEN"] = "REFRESH_TOKEN";
    AuthActivityType["LOGOUT"] = "LOGOUT";
    AuthActivityType["REGISTER"] = "REGISTER";
    AuthActivityType["CHANGE_PASSWORD"] = "CHANGE_PASSWORD";
    AuthActivityType["GOOGLE_LOGIN"] = "GOOGLE_LOGIN";
    AuthActivityType["FORGOT_PASSWORD"] = "FORGOT_PASSWORD";
})(AuthActivityType || (exports.AuthActivityType = AuthActivityType = {}));
