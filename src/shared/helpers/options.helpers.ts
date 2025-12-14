import { IOption } from "../interfaces";

export const getOptionFromEnum = (enumType: {
  [key: string]: string;
}): IOption[] => {
  return Object.keys(enumType).map((key) => ({
    label: key,
    value: enumType[key],
  }));
};
