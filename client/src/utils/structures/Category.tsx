/**
 * Common structure patterns for categories.
 */

// Interfaces.
import { Category } from '../../components/category/Category.interface';

/**
 * Retrieves the category onbject based on the provided category key.
 *
 * @return Array<string>
 */
export const getCategory: (
  categoryKey: string
) => (
  list: Array<Category>
) => Category | null = (
  categoryKey: string
) => (
  list: Array<Category>
): Category | null => {
  let category: Category | null = null;

  // Loop through the list of categories and add the top level items to the
  // array.
  let i: number = 0;

  // Loop through the top level categories to retrieve the subcategories.
  do {
    const current: Category = list[i];

    if (current.key !== categoryKey || !current.children) {
      i++;
      continue;
    }

    category = {...current};
    break;

  } while (i < list.length);

  return category;
}

/**
 * Retrieves a list of sub-categories as an array of strings.
 *
 * @param { Category } category - the category object.
 *
 * @return Array<string>
 */
export const getSubCategoryQueries: (
  category: Category
) => Array<string> = (
  category: Category
): Array<string> => {
  const subCategories: Array<string> = [];

  if (!category || !category.children) {
    return subCategories;
  }

  let i: number = 0;

  do {
    const current: Category = category.children[i];
    subCategories.push(current.key);

    i++;

  } while (i < category.children.length);

  return subCategories;
}

/**
 * Retrieves the top level product categories.
 *
 * @return Array<string>
 */
export const getTopLevelCategories: (
  list: Array<Category>
) => Array<string> = (
  list: Array<Category>
): Array<string> => {
  const categories: Array<string> = [];

  // Loop through the list of categories and add the top level items to the
  // array.
  let i: number = 0;

  do {
    const current: Category = list[i];
    categories.push(current.key);
    i++;
  } while (i < list.length);

  return categories;
}
