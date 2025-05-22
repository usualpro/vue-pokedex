export const arrayRange = <T>({
  page,
  limit,
  dataToDisplay,
}: {
  page: number;
  limit: number;
  dataToDisplay: T[];
}): T[] => {
  const sortedItems = [...dataToDisplay];
  const start = page * limit;
  const end = start + limit;
  return sortedItems.slice(start, end);
};
