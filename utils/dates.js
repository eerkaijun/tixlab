export const getDateObject = (dateStr) => {
  const date = new Date(dateStr);
  return date;
};
export const getFormattedDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toUTCString();
};
