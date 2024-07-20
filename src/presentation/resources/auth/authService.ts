import { JwtAdapter } from "../../../infrastructure/adapters/jwt.adapter";

import { CollaboratorRole } from "../../../domain";

import { CollaboratorLoginDto } from "../../../domain/dtos/collaboratorAuth/collaboratorLoginDto";
import { CollaboratorRegisterDto } from "../../../domain/dtos/collaboratorAuth/collaboratorRegisterDto";
import { BaseError } from "../../../shared/errors/BaseError";
import { CollaboratorModel } from "../../../infrastructure";
import { EmailService } from "../../services/EmailService";

import { OldSuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { AuthActivitiesService } from "../authActivities/authActivitiesService";
import { bcryptAdapter } from "../../../infrastructure/adapters/bcrypt.adapter";
import { getEnvsByEnvironment } from "../../../shared/helpers";
import {
  AuthActivityType,
  CollaboratorAuth,
  SuccessAuthResponse,
  SuccessLogoutResponse,
} from "../../../shared";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async collaboratorLogin(dto: CollaboratorLoginDto) {
    const { email, password } = dto.data;
    const collaborator = await CollaboratorModel.findOne({
      email,
    });

    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found");
    }
    const passwordsMatch = await bcryptAdapter.compare(
      password,
      collaborator.password!
    );
    if (!passwordsMatch) {
      throw BaseError.unauthorized("Invalid password");
    }

    const collaboratorAuth: CollaboratorAuth = {
      uid: collaborator._id,
      col_code: collaborator.col_code,
      role: collaborator.role,
      imgUrl: collaborator.imgUrl,
    };

    const token = await JwtAdapter.generateToken({ ...collaboratorAuth });
    if (!token) {
      throw BaseError.internalServer("Error generating token");
    }

    await AuthActivitiesService.logActivity(
      collaborator._id,
      AuthActivityType.LOGIN
    );

    return OldSuccessResponseFormatter.formatGetOneResponse<SuccessAuthResponse>(
      {
        resource: "collaborator-auth",
        data: {
          token,
          user: collaboratorAuth,
        },
      }
    );
  }

  public async collaboratorSimplifiedLogin(collaboratorId: string) {
    const collaborator = await CollaboratorModel.findById(collaboratorId);

    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found");
    }

    const collaboratorAuth: CollaboratorAuth = {
      uid: collaborator._id,
      col_code: collaborator.col_code,
      role: CollaboratorRole.admin,
      imgUrl: collaborator.imgUrl,
    };

    const token = await JwtAdapter.generateToken({ ...collaboratorAuth });

    return OldSuccessResponseFormatter.formatGetOneResponse<SuccessAuthResponse>(
      {
        resource: "collaborator-auth",
        data: {
          token,
          user: collaboratorAuth,
        },
      }
    );
  }

  public async collaboratorRefreshToken(authUser: CollaboratorAuth) {
    try {
      const newToken = await JwtAdapter.generateToken({ ...authUser });
      if (!newToken) {
        throw BaseError.internalServer("Error generating token");
      }

      await AuthActivitiesService.logActivity(
        authUser.uid,
        AuthActivityType.REFRESH_TOKEN
      );

      return OldSuccessResponseFormatter.formatGetOneResponse<SuccessAuthResponse>(
        {
          resource: "collaborator-auth",
          data: {
            token: newToken,
            user: authUser,
          },
        }
      );
    } catch (error) {}
  }

  public async collaboratorLogout(authUser: CollaboratorAuth) {
    try {
      await AuthActivitiesService.logActivity(
        authUser.uid,
        AuthActivityType.LOGOUT
      );
      return OldSuccessResponseFormatter.formatGetOneResponse<SuccessLogoutResponse>(
        {
          resource: "collaborator-auth",
          data: {
            token: null,
            user: null,
          },
        }
      );
    } catch (error) {
      throw BaseError.internalServer("Error logging out");
    }
  }

  public async collaboratorForgotPassword(email: string, tempPassword: string) {
    const collaborator = await CollaboratorModel.findOne({
      email,
    });

    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found");
    }

    const link = `${getEnvsByEnvironment().CLIENT_URL}/#/auth`;
    const htmlBody = `
      <h1>Your new password</h1>
      <p>Your new password is: ${tempPassword}</p>
      <p>Click on the following <a href="${link}">link</a></p>      
    `;

    collaborator.password = await bcryptAdapter.hash(tempPassword);
    await collaborator.save();

    const emailOptions = {
      to: email,
      subject: "Forgot password",
      htmlBody,
    };

    await this.emailService.sendEmail(emailOptions);

    await AuthActivitiesService.logActivity(
      collaborator._id,
      AuthActivityType.FORGOT_PASSWORD
    );

    return OldSuccessResponseFormatter.formatGetOneResponse<SuccessLogoutResponse>(
      {
        resource: "collaborator-auth",
        data: {
          token: null,
          user: null,
        },
      }
    );
  }

  public async collaboratorChangePassword(
    uid: string,
    password: string,
    newPassword: string
  ) {
    const collaborator = await CollaboratorModel.findById(uid);

    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found");
    }

    if (!password || !newPassword) {
      throw BaseError.badRequest("Password and new password are required");
    }

    const passwordsMatch = bcryptAdapter.compare(
      password,
      collaborator.password!
    );
    if (!passwordsMatch) {
      throw BaseError.unauthorized("Invalid password");
    }

    collaborator.password = bcryptAdapter.hash(newPassword);
    await collaborator.save();

    await AuthActivitiesService.logActivity(
      collaborator._id,
      AuthActivityType.CHANGE_PASSWORD
    );

    return OldSuccessResponseFormatter.formatGetOneResponse<SuccessLogoutResponse>(
      {
        resource: "collaborator-auth",
        data: {
          token: null,
          user: null,
        },
      }
    );
  }

  public async collaboratorRegister(dto: CollaboratorRegisterDto) {
    try {
      const { email, password, col_code, access_code: access_code } = dto.data;
      const usedEmail = await CollaboratorModel.findOne({ email });
      if (usedEmail) {
        throw BaseError.badRequest("Email already in use");
      }
      const collaborator = await CollaboratorModel.findOne({ col_code });
      if (!collaborator) {
        throw BaseError.notFound("Collaborator not found");
      }
      if (collaborator.accessCode !== access_code) {
        throw BaseError.unauthorized("Invalid access code");
      }
      if (collaborator.isRegistered) {
        throw BaseError.badRequest("Collaborator already registered");
      }

      collaborator.password = bcryptAdapter.hash(password);
      collaborator.email = email;
      collaborator.isRegistered = true;

      const updatedCollaborator = await CollaboratorModel.findByIdAndUpdate(
        collaborator._id,
        collaborator,
        { new: true }
      );

      const token = await JwtAdapter.generateToken({
        uid: collaborator._id,
        col_code: collaborator.col_code,
        role: collaborator.role,
        imgUrl: collaborator.imgUrl,
      });

      await AuthActivitiesService.logActivity(
        collaborator._id,
        AuthActivityType.REGISTER
      );

      return OldSuccessResponseFormatter.formatGetOneResponse<SuccessAuthResponse>(
        {
          resource: "collaborator-auth",
          data: {
            token,
            user: {
              uid: updatedCollaborator!._id,
              col_code: updatedCollaborator!.col_code,
              role: updatedCollaborator!.role,
              imgUrl: updatedCollaborator!.imgUrl,
            },
          },
        }
      );
    } catch (error) {
      throw BaseError.internalServer("Error registering collaborator");
    }
  }

  public async collaboratorGoogleLogin(user: CollaboratorAuth) {
    const token = await JwtAdapter.generateToken(user);
    return OldSuccessResponseFormatter.formatGetOneResponse<SuccessAuthResponse>(
      {
        resource: "collaborator-auth",
        data: {
          token,
          user,
        },
      }
    );
  }
}
