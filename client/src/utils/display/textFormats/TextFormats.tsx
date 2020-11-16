/**
 * TextFormats.tsx
 * Provides different helpers for formatting text.
 */

/**
 * Pluralises text based on the last letter.
 *
 * @param { string } value - the value to be pluralized.
 *
 * @return string
 */
export const Pluralize: (
  value: string
) => string = (
  value: string
): string => {
  let updatedText: string = value,
      lastLetter: string = value.slice(-1);

  if (lastLetter !== 's') {
    updatedText += 's';
  }

  return updatedText;
}
