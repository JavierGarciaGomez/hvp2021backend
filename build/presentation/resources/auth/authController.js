"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const collaboratorRegisterDto_1 = require("./../../../domain/dtos/collaboratorAuth/collaboratorRegisterDto");
const collaboratorLoginDto_1 = require("../../../domain/dtos/collaboratorAuth/collaboratorLoginDto");
const BaseError_1 = require("../../../shared/errors/BaseError");
const helpers_1 = require("../../../shared/helpers");
const passport_adapter_1 = require("../../../infrastructure/adapters/passport.adapter");
const adapters_1 = require("../../../infrastructure/adapters");
class AuthController {
    constructor(service) {
        this.service = service;
        this.collaboratorLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = collaboratorLoginDto_1.CollaboratorLoginDto.login(req.body);
                const response = yield this.service.collaboratorLogin(dto);
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.collaboratorSimplifiedLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { collaboratorId } = req.body;
                const response = yield this.service.collaboratorSimplifiedLogin(collaboratorId);
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.collaboratorRefreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const response = yield this.service.collaboratorRefreshToken(authUser);
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.collaboratorLogout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const response = yield this.service.collaboratorLogout(authUser);
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.registerCollaborator = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const dto = collaboratorRegisterDto_1.CollaboratorRegisterDto.register(req.body);
                const response = yield this.service.collaboratorRegister(dto);
                res.status(200).json(response);
            }
            catch (error) {
                (0, helpers_1.handleError)(error, res, next);
            }
        });
        this.collaboratorForgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            console.log({ email });
            if (!email) {
                throw BaseError_1.BaseError.badRequest("Email is required for password recovery.");
            }
            const tempPassword = Math.random().toString(36).slice(-8); // Generate a simple temporary password
            try {
                const response = yield this.service.collaboratorForgotPassword(email, tempPassword);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                (0, helpers_1.handleError)(error, res, next);
            }
        });
        this.collaboratorChangePassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const { password, newPassword } = req.body;
                const { uid } = authUser;
                const response = yield this.service.collaboratorChangePassword(uid, password, newPassword);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                (0, helpers_1.handleError)(error, res, next);
            }
        });
        this.collaboratorGoogleLogin = (req, res, next) => {
            passport_adapter_1.passportAdapter.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
        };
        this.collaboratorGoogleCallback = (req, res, next) => {
            passport_adapter_1.passportAdapter.authenticate("google", (err, user) => __awaiter(this, void 0, void 0, function* () {
                console.log("Error:", err); // Log any errors
                console.log("User:", user); // Log the user object
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.redirect("/login");
                }
                try {
                    const token = yield adapters_1.JwtAdapter.generateToken({
                        uid: user._id,
                        col_code: user.col_code,
                        role: user.role,
                        imgUrl: user.imgUrl,
                    });
                    // const response = await this.service.collaboratorGoogleLogin(user);
                    // res.status(200).json(response);
                    res.redirect(
                    // `${process.env.CLIENT_URL}#/auth?token=${response.token || ""}`
                    `${process.env.CLIENT_URL}#/auth?token=${token}`);
                }
                catch (error) {
                    next(error);
                }
            }))(req, res, next);
        };
    }
}
exports.AuthController = AuthController;
