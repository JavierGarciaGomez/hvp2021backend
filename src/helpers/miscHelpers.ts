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
