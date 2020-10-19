/**
 * formatting.model.ts
 * Model for handling common formatting functions.
 */

/**
 * Formatting class.
 */
export default class Formatting {
  /**
   * Formats a url friendly string from the provided value.
   *
   * @param { string } value - the string to be formatted.
   */
  static URLString(value: string, uniqueId?: string): string {

    let result: string = value.split(' ').join('_')
            .split('&').join('and').toLowerCase();

    result = result.replace(/[^\w\s]/gi, '')

    if (uniqueId) {
      if (uniqueId.length > 5) {
        result += `${result}_${uniqueId.substring(uniqueId.length - 5, uniqueId.length - 1)}`;
      } else {
        result += `${result}_${uniqueId}`;
      }
    }

    return result;
  }
}
