export const isBoolean = (value: any): boolean => {
  return typeof value === "boolean";
};

export const isValidEnum = (
  enumType: { [key: string]: string },
  value: any
): boolean => {
  return Object.values(enumType).includes(value);
};

export const isAlphabetical = (value: string): boolean => {
  return /^[a-zA-Z]+$/.test(value);
};

export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): void => {
  const errors = requiredFields
    .filter((field) => !data[field])
    .map(
      (field) => `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    );

  if (errors.length) {
    throw new Error(errors.join(", "));
  }
};
