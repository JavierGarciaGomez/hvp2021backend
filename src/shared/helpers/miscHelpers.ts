import { BaseError } from "../errors/BaseError";

export const buildRelativePath = (
  firstPart: string,
  secondPart: string,
  resourceId?: string
) => {
  let path = `${firstPart}/${secondPart}`;
  if (resourceId) {
    path = path.replace(":id", resourceId);
  }
  return path;
};

export const handleUnknownError = (error: unknown) => {
  if (error instanceof Error) {
    throw BaseError.internalServer(error.message);
  }
  throw BaseError.internalServer("Unknown error");
};

export const generateRandomPassword = (): string => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
};
