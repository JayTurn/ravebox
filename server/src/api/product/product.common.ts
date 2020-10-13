/**
 * product.common.ts
 * Common functions performed with a product document.
 */

// Interfaces.
import { Category } from './product.interface';
import { 
  ProductDetails,
  ProductDetailsDocument
} from './product.interface';

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

  /**
   * Creates an array of product details from the provided list of products.
   *
   * @param { Array<ProductDetailsDocument> } productDocuments - products.
   *
   * @return Array<ProductDetails>
   */
  static RetrieveProductDetailsFromDocuments(
    productDocuments: Array<ProductDetails | ProductDetailsDocument>
  ): Array<ProductDetails> {

    if (productDocuments.length <= 0) {
      return [];
    }

    const products: Array<ProductDetails> = [];

    let i = 0;

    do {
      let current: ProductDetails;
      if (ProductCommon.isDocument(productDocuments[i])) {
        current = (productDocuments[i] as ProductDetailsDocument).details;
      } else {
        current = (productDocuments[i] as ProductDetails);
      }

      products.push({...current});

      i++;

    } while (i < productDocuments.length);

    return products;
  }

  /**
   * Checks if the product is a document or details.
   */
  static isDocument(
    product: ProductDetails | ProductDetailsDocument
  ): product is ProductDetailsDocument {
    if ((product as ProductDetailsDocument).details) {
      return true;
    } else {
      return false;
    }
  }
}
