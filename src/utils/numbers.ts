import numbro from 'numbro';

/**
 *
 * @param num number to format
 * @param digits number of digits to display
 * @param round whether using round number
 * @returns the formatted number in Dollar($)
 * with abbreviations million - M, billion B, ...
 */
export const formatDollarAmount = (
  num: number | undefined,
  digits = 2,
  round = true,
) => {
  if (num === 0) return '$0.00';
  if (!num) return '-';
  if (num < 0.001 && digits <= 3) {
    return '<$0.001';
  }

  return numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'm',
      billion: 'b',
    },
  });
};

/**
 *
 * @param num number to format
 * @param digits number of digits to display
 * @returns the formatted number with
 * abbreviations million - M, billion B, ...
 */
export const formatAmount = (num: number | undefined, digits = 2) => {
  if (num === 0) return '0';
  if (!num) return '-';
  if (num < 0.001) {
    return '<0.001';
  }
  return numbro(num).format({
    average: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: 'M',
      billion: 'B',
    },
  });
};
