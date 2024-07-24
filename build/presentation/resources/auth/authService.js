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
exports.AuthService = void 0;
const jwt_adapter_1 = require("../../../infrastructure/adapters/jwt.adapter");
const domain_1 = require("../../../domain");
const BaseError_1 = require("../../../shared/errors/BaseError");
const infrastructure_1 = require("../../../infrastructure");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const authActivitiesService_1 = require("../authActivities/authActivitiesService");
const bcrypt_adapter_1 = require("../../../infrastructure/adapters/bcrypt.adapter");
const helpers_1 = require("../../../shared/helpers");
const shared_1 = require("../../../shared");
class AuthService {
    constructor(emailService) {
        this.emailService = emailService;
    }
    collaboratorLogin(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = dto.data;
            const collaborator = yield infrastructure_1.CollaboratorModel.findOne({
                email,
            });
            if (!collaborator) {
                throw BaseError_1.BaseError.notFound("Collaborator not found");
            }
            const passwordsMatch = yield bcrypt_adapter_1.bcryptAdapter.compare(password, collaborator.password);
            if (!passwordsMatch) {
                throw BaseError_1.BaseError.unauthorized("Invalid password");
            }
            const collaboratorAuth = {
                uid: collaborator._id,
                col_code: collaborator.col_code,
                role: collaborator.role,
                imgUrl: collaborator.imgUrl,
            };
            const token = yield jwt_adapter_1.JwtAdapter.generateToken(Object.assign({}, collaboratorAuth));
            if (!token) {
                throw BaseError_1.BaseError.internalServer("Error generating token");
            }
            yield authActivitiesService_1.AuthActivitiesService.logActivity(collaborator._id, shared_1.AuthActivityType.LOGIN);
            return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                resource: "collaborator-auth",
                data: {
                    token,
                    user: collaboratorAuth,
                },
            });
        });
    }
    collaboratorSimplifiedLogin(collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const collaborator = yield infrastructure_1.CollaboratorModel.findById(collaboratorId);
            if (!collaborator) {
                throw BaseError_1.BaseError.notFound("Collaborator not found");
            }
            const collaboratorAuth = {
                uid: collaborator._id,
                col_code: collaborator.col_code,
                role: domain_1.CollaboratorRole.admin,
                imgUrl: collaborator.imgUrl,
            };
            const token = yield jwt_adapter_1.JwtAdapter.generateToken(Object.assign({}, collaboratorAuth));
            return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                resource: "collaborator-auth",
                data: {
                    token,
                    user: collaboratorAuth,
                },
            });
        });
    }
    collaboratorRefreshToken(authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newToken = yield jwt_adapter_1.JwtAdapter.generateToken(Object.assign({}, authUser));
                if (!newToken) {
                    throw BaseError_1.BaseError.internalServer("Error generating token");
                }
                yield authActivitiesService_1.AuthActivitiesService.logActivity(authUser.uid, shared_1.AuthActivityType.REFRESH_TOKEN);
                return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                    resource: "collaborator-auth",
                    data: {
                        token: newToken,
                        user: authUser,
                    },
                });
            }
            catch (error) { }
        });
    }
    collaboratorLogout(authUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield authActivitiesService_1.AuthActivitiesService.logActivity(authUser.uid, shared_1.AuthActivityType.LOGOUT);
                return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                    resource: "collaborator-auth",
                    data: {
                        token: null,
                        user: null,
                    },
                });
            }
            catch (error) {
                throw BaseError_1.BaseError.internalServer("Error logging out");
            }
        });
    }
    collaboratorForgotPassword(email, tempPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const collaborator = yield infrastructure_1.CollaboratorModel.findOne({
                email,
            });
            if (!collaborator) {
                throw BaseError_1.BaseError.notFound("Collaborator not found");
            }
            const link = `${(0, helpers_1.getEnvsByEnvironment)().CLIENT_URL}/#/auth`;
            const htmlBody = `
      <h1>Your new password</h1>
      <p>Your new password is: ${tempPassword}</p>
      <p>Click on the following <a href="${link}">link</a></p>      
    `;
            collaborator.password = yield bcrypt_adapter_1.bcryptAdapter.hash(tempPassword);
            yield collaborator.save();
            const emailOptions = {
                to: email,
                subject: "Forgot password",
                htmlBody,
            };
            yield this.emailService.sendEmail(emailOptions);
            yield authActivitiesService_1.AuthActivitiesService.logActivity(collaborator._id, shared_1.AuthActivityType.FORGOT_PASSWORD);
            return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                resource: "collaborator-auth",
                data: {
                    token: null,
                    user: null,
                },
            });
        });
    }
    collaboratorChangePassword(uid, password, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const collaborator = yield infrastructure_1.CollaboratorModel.findById(uid);
            if (!collaborator) {
                throw BaseError_1.BaseError.notFound("Collaborator not found");
            }
            if (!password || !newPassword) {
                throw BaseError_1.BaseError.badRequest("Password and new password are required");
            }
            const passwordsMatch = bcrypt_adapter_1.bcryptAdapter.compare(password, collaborator.password);
            if (!passwordsMatch) {
                throw BaseError_1.BaseError.unauthorized("Invalid password");
            }
            collaborator.password = bcrypt_adapter_1.bcryptAdapter.hash(newPassword);
            yield collaborator.save();
            yield authActivitiesService_1.AuthActivitiesService.logActivity(collaborator._id, shared_1.AuthActivityType.CHANGE_PASSWORD);
            return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                resource: "collaborator-auth",
                data: {
                    token: null,
                    user: null,
                },
            });
        });
    }
    collaboratorRegister(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, col_code, access_code: access_code } = dto.data;
                const usedEmail = yield infrastructure_1.CollaboratorModel.findOne({ email });
                if (usedEmail) {
                    throw BaseError_1.BaseError.badRequest("Email already in use");
                }
                const collaborator = yield infrastructure_1.CollaboratorModel.findOne({ col_code });
                if (!collaborator) {
                    throw BaseError_1.BaseError.notFound("Collaborator not found");
                }
                if (collaborator.accessCode !== access_code) {
                    throw BaseError_1.BaseError.unauthorized("Invalid access code");
                }
                if (collaborator.isRegistered) {
                    throw BaseError_1.BaseError.badRequest("Collaborator already registered");
                }
                collaborator.password = bcrypt_adapter_1.bcryptAdapter.hash(password);
                collaborator.email = email;
                collaborator.isRegistered = true;
                const updatedCollaborator = yield infrastructure_1.CollaboratorModel.findByIdAndUpdate(collaborator._id, collaborator, { new: true });
                const token = yield jwt_adapter_1.JwtAdapter.generateToken({
                    uid: collaborator._id,
                    col_code: collaborator.col_code,
                    role: collaborator.role,
                    imgUrl: collaborator.imgUrl,
                });
                yield authActivitiesService_1.AuthActivitiesService.logActivity(collaborator._id, shared_1.AuthActivityType.REGISTER);
                return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                    resource: "collaborator-auth",
                    data: {
                        token,
                        user: {
                            uid: updatedCollaborator._id,
                            col_code: updatedCollaborator.col_code,
                            role: updatedCollaborator.role,
                            imgUrl: updatedCollaborator.imgUrl,
                        },
                    },
                });
            }
            catch (error) {
                throw BaseError_1.BaseError.internalServer("Error registering collaborator");
            }
        });
    }
    collaboratorGoogleLogin(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield jwt_adapter_1.JwtAdapter.generateToken(user);
            return SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                resource: "collaborator-auth",
                data: {
                    token,
                    user,
                },
            });
        });
    }
}
exports.AuthService = AuthService;
