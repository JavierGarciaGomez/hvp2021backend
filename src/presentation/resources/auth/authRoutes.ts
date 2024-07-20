import { Router } from "express";
import { AuthService } from "./authService";
import { AuthController } from "./authController";
import { EmailService } from "../../services/EmailService";
import { envsPlugin } from "../../../infrastructure/adapters";
import { AuthMiddleware } from "../../middlewares";

const baseRoutes = {
  collaborator: "/collaborator",
  user: "/user",
};

export const routes = {
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

export class AuthRoutes {
  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService(
      envsPlugin.MAILER_SERVICE,
      envsPlugin.MAILER_EMAIL,
      envsPlugin.MAILER_SECRET_KEY
    );
    const service = new AuthService(emailService);
    const controller = new AuthController(service);

    // Collaborator routes
    router.post(routes.collaborator.login, controller.collaboratorLogin);
    router.post(
      routes.collaborator.simplifiedLogin,
      controller.collaboratorSimplifiedLogin
    );
    router.post(
      routes.collaborator.logout,
      AuthMiddleware.validateJWT,
      controller.collaboratorLogout
    );
    router.post(
      routes.collaborator.refresh,
      AuthMiddleware.validateJWT,
      controller.collaboratorRefreshToken
    );
    router.post(
      routes.collaborator.forgotPassword,
      controller.collaboratorForgotPassword
    );

    router.patch(
      routes.collaborator.changePassword,
      AuthMiddleware.validateJWT,
      controller.collaboratorChangePassword
    );
    router.post(routes.collaborator.register, controller.registerCollaborator);

    router.get(
      routes.collaborator.googleLogin,
      controller.collaboratorGoogleLogin
    );
    router.get(
      routes.collaborator.googleCallback,
      controller.collaboratorGoogleCallback
    );

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
