/**
 * product.common.ts
 * Common functions performed with a product document.
 */

// Interfaces.
import { Category } from './product.interface';

/**
 * ProductCommon class.
 */
export default class ProductCommon {
  /**
   * Creates an array of strings from the categories array.
   *
   * @param { Array<Category> } list - the list of categories.
   *
   * @return Array<string>
   */
  static GetListOfCategoryStrings(list: Array<Category>): Array<string> {
    const categories: Array<string> = [];

    if (!list || list.length <= 0) {
      return categories;
    }

    let i = 0;

    // Loop through the categories and create a list of strings from the
    // label vaues.
    do {
      const current: Category = list[i];

      categories.push(current.label);

      i++;
    } while (i < list.length);

    return categories;
  }
}
