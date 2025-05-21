export const arrayRange = <T>({
  page,
  limit,
  dataToDisplay,
}: {
  page: number;
  limit: number;
  dataToDisplay: T[];
}): T[] => {
  const start = page * limit;
  const end = start + limit;
  return dataToDisplay.slice(start, end);
};
