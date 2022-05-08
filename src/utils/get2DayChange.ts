/**
 * gets the amount difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
export default (
  valueNow: string,
  value24HoursAgo: string,
  value48HoursAgo: string,
): [number, number] => {
  // get volume info for both 24 hour periods
  const currentChange = Math.abs(
    parseFloat(valueNow) - parseFloat(value24HoursAgo),
  );
  const previousChange = Math.abs(
    parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo),
  );
  const adjustedPercentChange =
    ((currentChange - previousChange) / previousChange) * 100;
  if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
    return [currentChange, 0];
  }
  return [currentChange, adjustedPercentChange];
};
