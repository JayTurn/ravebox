/**
 * keywords.model.ts
 * Model for handling keyword storage.
 */

/**
 * Keywords class.
 */
export default class Keywords {
  /**
   * Creates an array of partial matches for a keyword.
   *
   * @param { string } word - the word to be used.
   *
   * @return Array<string>
   */
  static CreatePartialMatches(word: string): Array<string> {
    const partials: Array<string> = [];

    let tmp: string,
        hasPartial: boolean;

    for (let i = 0; i < word.length - 2; i++) {
      tmp = word.substr(i).toUpperCase();
      hasPartial = false;

      for (let j = 0; j < partials.length; j++) {
        if (partials[j].indexOf(tmp) === 0) {
          hasPartial = true;
          break;
        }
      }

      if (!hasPartial) {
        partials.push(tmp);
      }
    }

    return partials;
  }

  /**
   * Creates an array of partial matches for a list of keywords.
   *
   * @param { Array<string> } words - the list of words to be used.
   *
   * @return Array<string>
   */
  static CreatePartialMatchesFromList(words: Array<string>): Array<string> {
    let list: Array<string> = [];

    let i = 0;

    // Sort the order of words in reverse so we operate left to right with
    // keyword matching.
    words.sort().reverse();

    // Loop through each word in the array and create partials.
    do {
      const current: string = words[i];

      const partials: Array<string> = Keywords.CreatePartialMatches(current);

      list = list.concat(partials);

      i++;

    } while (i < words.length);

    return list;
  }
}
