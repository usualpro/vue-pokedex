export const arrayRange = <T extends { name: string; url: string }>({
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
