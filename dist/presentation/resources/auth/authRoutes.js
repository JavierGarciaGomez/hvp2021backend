"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = exports.routes = void 0;
const express_1 = require("express");
const authService_1 = require("./authService");
const authController_1 = require("./authController");
const EmailService_1 = require("../../services/EmailService");
const adapters_1 = require("../../../infrastructure/adapters");
const middlewares_1 = require("../../middlewares");
const baseRoutes = {
    collaborator: "/collaborator",
    user: "/user",
};
exports.routes = {
    collaborator: {
        base: baseRoutes.collaborator,
        login: `${baseRoutes.collaborator}/login`,
        simplifiedLogin: `${baseRoutes.collaborator}/simplified-login`,
        logout: `${baseRoutes.collaborator}/logout`,
        refresh: `${baseRoutes.collaborator}/refresh`,
        forgotPassword: `${baseRoutes.collaborator}/forgot-password`,
        changePassword: `${baseRoutes.collaborator}/change-password`,
        register: `${baseRoutes.collaborator}/register`,
        googleLogin: `${baseRoutes.collaborator}/google-login`,
        googleLoginFailed: `${baseRoutes.collaborator}/google-login/failed`,
        google: `${baseRoutes.collaborator}/google`,
        googleCallback: `${baseRoutes.collaborator}/google-callback`,
    },
    user: {
        base: baseRoutes.user,
        login: `${baseRoutes.user}/login`,
        logout: `${baseRoutes.user}/logout`,
        refresh: `${baseRoutes.user}/refresh`,
        googleLogin: `${baseRoutes.user}/google-login`,
        googleLoginFailed: `${baseRoutes.user}/google-login/failed`,
        google: `${baseRoutes.user}/google`,
        googleCallback: `${baseRoutes.user}/google/callback`,
    },
};
class AuthRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const emailService = new EmailService_1.EmailService(adapters_1.envsPlugin.MAILER_SERVICE, adapters_1.envsPlugin.MAILER_EMAIL, adapters_1.envsPlugin.MAILER_SECRET_KEY);
        const service = new authService_1.AuthService(emailService);
        const controller = new authController_1.AuthController(service);
        // Collaborator routes
        router.post(exports.routes.collaborator.login, controller.collaboratorLogin);
        router.post(exports.routes.collaborator.simplifiedLogin, controller.collaboratorSimplifiedLogin);
        router.post(exports.routes.collaborator.logout, middlewares_1.AuthMiddleware.validateJWT, controller.collaboratorLogout);
        router.post(exports.routes.collaborator.refresh, middlewares_1.AuthMiddleware.validateJWT, controller.collaboratorRefreshToken);
        router.post(exports.routes.collaborator.forgotPassword, controller.collaboratorForgotPassword);
        router.patch(exports.routes.collaborator.changePassword, middlewares_1.AuthMiddleware.validateJWT, controller.collaboratorChangePassword);
        router.post(exports.routes.collaborator.register, controller.registerCollaborator);
        router.get(exports.routes.collaborator.googleLogin, controller.collaboratorGoogleLogin);
        router.get(exports.routes.collaborator.googleCallback, controller.collaboratorGoogleCallback);
        // router.get(routes.collaborator.google, controller.collaboratorGoogleLogin);
        // router.get(routes.collaborator.googleCallback, controller.collaboratorGoogleCallback);
        // router.get(routes.collaborator.googleLoginFailed, controller.collaboratorGoogleLoginFailed);
        // router.post(routes.collaborator.logout, controller.collaboratorLogout);
        // router.post(
        //   routes.collaborator.refresh,
        //   controller.collaboratorRefreshToken
        // );
        // router.get(routes.collaborator.google, controller.collaboratorGoogleLogin);
        // router.get(
        //   routes.collaborator.googleCallback,
        //   controller.collaboratorGoogleCallback
        // );
        // router.get(
        //   routes.collaborator.googleLoginFailed,
        //   controller.collaboratorGoogleLoginFailed
        // );
        // User routes
        // router.post(routes.user.login, controller.userLogin);
        // router.post(routes.user.logout, controller.userLogout);
        // router.post(routes.user.refresh, controller.userRefreshToken);
        // router.get(routes.user.google, controller.userGoogleLogin);
        // router.get(routes.user.googleCallback, controller.userGoogleCallback);
        // router.get(routes.user.googleLoginFailed, controller.userGoogleLoginFailed);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
