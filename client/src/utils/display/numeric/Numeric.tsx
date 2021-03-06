/**
 * Numeric.tsx
 * Formats numbers with a numeric suffix for ease of display.
 */

// Interfaces.
import { SystemOfUnits } from './Numeric.interface';

/**
 * NumericSuffix formatter.
 *
 * @param { number } value - the value to be formatted.
 * @param { number } digits - the number of decimals to be displayed.
 *
 * @return string
 */
export const NumericSuffix: (
  value: number
) => (
  digits: number
) => string = (
  value: number
) => (
  digits: number
): string => {
  const si: Array<SystemOfUnits> = [
    { value: 1, suffix: "" },
    { value: 1E3, suffix: "k" },
    { value: 1E6, suffix: "M" },
    { value: 1E9, suffix: "G" },
    { value: 1E12, suffix: "T" },
    { value: 1E15, suffix: "P" },
    { value: 1E18, suffix: "E" }
  ];

  // Regular expression to trim trailing zeros.
  const rx: RegExp = /\.0+$|(\.[0-9]*[1-9])0+$/;

  let i: number;

  // Find the index of the system of units we wish to employ.
  for (i = si.length - 1; i > 0; i--) {
    if (value >= si[i].value) {
      break;
    }
  }

  // Format the value to a fixed number of digits, replace trailing zeros and
  // append the suffix string.
  return (value / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].suffix;
}

/**
 * Comma separated number formatter.
 *
 * @param { number } value - the value to be formatted.
 *
 * @return string
 */
export const CommaSeparatedNumber: (
  value: number
) => string = (
  value: number
): string => {
  // Regular expression separating every third lookback number with a comma.
  return value.toLocaleString('en');
}

/**
 * Returns a value and identifier based on the count.
 *
 * @param { number } value - the number provided.
 * @param { string } identifier - the count identifier.
 *
 * @return string
 */
export const CountIdentifier: (
  value: number
) => (
  identifier: string
) => string = (
  value: number
) => (
  identifier: string
): string => {
  let countIdentifier: string = '';

  if (value === 0) {
    return countIdentifier;;
  }

  if (value < 2) {
    countIdentifier = `${value} ${identifier}`;
  }

  if (value >= 2) {
    countIdentifier = `${value} ${identifier}s`;
  }

  return countIdentifier;
}

