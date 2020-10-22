/**
 * product.common.ts
 * Common functions performed with a product document.
 */

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';

// Interfaces.
import { Category } from './product.interface';
import { 
  ProductDetails,
  ProductDocument
} from './product.interface';

// Models.
import Product from './product.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';

// Utilities.
import Formatting from '../../shared/formatting/formatting.model';

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
    productDocuments: Array<ProductDetails | ProductDocument>
  ): Array<ProductDetails> {

    if (productDocuments.length <= 0) {
      return [];
    }

    const products: Array<ProductDetails> = [];

    let i = 0;

    do {
      const current: ProductDetails = ProductCommon
        .RetrieveDetailsFromDocument(productDocuments[i]);

      products.push({...current});

      i++;

    } while (i < productDocuments.length);

    return products;
  }

  /**
   * Retrieve the product details from a document.
   *
   * @param { ProductDocument | ProductDetails } product - the product object.
   *
   * @return ProductDetails
   */
  static RetrieveDetailsFromDocument(
    productDocument: ProductDetails | ProductDocument
  ): ProductDetails {
    if (!ProductCommon.isDocument(productDocument)) {
      return productDocument as ProductDetails;
    }

    return (productDocument as ProductDocument).details;
  }

  /**
   * Checks if the product is a document or details.
   */
  static isDocument(
    product: ProductDetails | ProductDocument
  ): product is ProductDocument {
    if ((product as ProductDocument).details) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Handles the updating of urls on updates.
   *
   * @param { ProductDocument } product - the product we're updating.
   *
   * @return Promise<ProductDocument>
   */
  static async UpdateDocumentURL(
    product: ProductDocument
  ): Promise<ProductDocument> {

    // Create a raw name to be used for creating a URL formatted product.
    // This will be stored in the model so we can append a numeric value in the
    // URL for products that have matching names.
    const nameRaw = Formatting.URLString(product.name);

    // Check if a product already exists with this url and append an
    // incremented count if it does.
    await Product.count({
      nameRaw: nameRaw
    })
    .then((count: number) => {

      // Set the url.
      if (count <= 0) {
        product.url = nameRaw;
      } else {
        product.url = `${nameRaw}_${count++}`;
      }

      // Set the raw name.
      product.nameRaw = nameRaw;
    })
    .catch((error: Error) => {

      // Return an error indicating the products couldn't be queried.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: `PRODUCT_URL_UPDATE_FAILED_COUNT`,
          message: 'There was a problem counting the products with matching urls'
        },
        error: error
      }, 401, 'There was a problem counting the products with matching urls');

      Logging.Send(LogLevel.ERROR, responseObject);

    });

    return product;
  }
}
