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
