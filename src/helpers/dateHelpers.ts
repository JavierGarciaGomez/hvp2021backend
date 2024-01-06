export const getEarliestDate = (dates: Date[]) => {
  const earliestDate = new Date(
    Math.min(...dates.map((date) => date.getTime()))
  );
  return earliestDate;
};

export const formatDateWithoutTime = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
