import { CollaboratorRegisterDto } from "./../../../domain/dtos/collaboratorAuth/collaboratorRegisterDto";
import { NextFunction, Request, Response } from "express";
import { CollaboratorLoginDto } from "../../../domain/dtos/collaboratorAuth/collaboratorLoginDto";
import { AuthService } from "./authService";
import { BaseError } from "../../../domain/errors/BaseError";
import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";
import { EmailService } from "../../services/EmailService";
import { handleError } from "../../../helpers";
import { passport } from "../../..";
import { JwtAdapter } from "../../../config";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  public collaboratorLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = CollaboratorLoginDto.login(req.body);

      const response = await this.service.collaboratorLogin(dto!);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public collaboratorRefreshToken = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const response = await this.service.collaboratorRefreshToken(authUser!);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public collaboratorLogout = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const response = await this.service.collaboratorLogout(authUser!);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public registerCollaborator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = CollaboratorRegisterDto.register(req.body);

      const response = await this.service.collaboratorRegister(dto!);
      res.status(200).json(response);
    } catch (error) {
      handleError(error, res, next);
    }
  };

  public collaboratorForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { email } = req.body;
    console.log({ email });
    if (!email) {
      throw BaseError.badRequest("Email is required for password recovery.");
    }
    const tempPassword = Math.random().toString(36).slice(-8); // Generate a simple temporary password

    try {
      const response = await this.service.collaboratorForgotPassword(
        email,
        tempPassword
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      handleError(error, res, next);
    }
  };

  public collaboratorChangePassword = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const { password, newPassword } = req.body;
      const { uid } = authUser!;
      const response = await this.service.collaboratorChangePassword(
        uid,
        password,
        newPassword
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      handleError(error, res, next);
    }
  };

  public collaboratorGoogleLogin = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  };

  public collaboratorGoogleCallback = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate("google", async (err: Error | null, user: any) => {
      console.log("Error:", err); // Log any errors
      console.log("User:", user); // Log the user object
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
      try {
        const token = await JwtAdapter.generateToken({
          uid: user._id,
          col_code: user.col_code,
          role: user.role,
          imgUrl: user.imgUrl,
        });
        // const response = await this.service.collaboratorGoogleLogin(user);
        // res.status(200).json(response);
        res.redirect(
          // `${process.env.CLIENT_URL}#/auth?token=${response.token || ""}`
          `${process.env.CLIENT_URL}#/auth?token=${token}`
        );
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
}
