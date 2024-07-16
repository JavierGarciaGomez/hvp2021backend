import { BaseError } from "../domain/errors/BaseError";

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
