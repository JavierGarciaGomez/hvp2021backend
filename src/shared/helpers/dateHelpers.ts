import dayjs from "dayjs";

export const getEarliestDate = (dates: Date[]) => {
  const earliestDate = new Date(
    Math.min(...dates.map((date) => date.getTime()))
  );
  return earliestDate;
};

export const formatDateWithoutTime = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const isValidDateString = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
  // Ensure the date string matches the ISO format to avoid invalid months or days
  return date.toISOString().slice(0, 10) === dateString;
};

export const getCurrentMexicanDate = () => {
  const options = {
    year: "numeric" as const,
    month: "2-digit" as const,
    day: "2-digit" as const,
  };
  const date = new Date().toLocaleDateString("es-MX", options);
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const validateDateDay = (date: string | Date, day: string): boolean => {
  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd").toLowerCase();
  return dayOfWeek === day.toLowerCase();
};

export const checkIsMonday = (date: string | Date): boolean =>
  validateDateDay(date, "Monday");

export const checkIsSunday = (date: string | Date): boolean =>
  validateDateDay(date, "Sunday");
