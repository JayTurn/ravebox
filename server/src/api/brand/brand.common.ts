/**
 * brand.common.ts
 * Common functions performed with a brand document.
 */

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';

// Interfaces.
import {
  BrandDetails,
  BrandDocument
} from './brand.interface';

// Models.
import Brand from './brand.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';

// Utilities.
import Formatting from '../../shared/formatting/formatting.model';

/**
 * BrandCommon class.
 */
export default class BrandCommon {

  /**
   * Retrieves the brand details from a document.
   *
   * @param { BrandDocument | BrandDetails } brand - products.
   *
   * @return BrandDetails
   */
  static RetrieveDetailsFromDocuments(
    brandDocument: BrandDetails | BrandDocument
  ): BrandDetails {
    if (!BrandCommon.isDocument(brandDocument)) {
      return brandDocument as BrandDetails;
    }

    return (brandDocument as BrandDocument).details;
  }

  /**
   * Checks if the product is a document or details.
   */
  static isDocument(
    brand: BrandDetails | BrandDocument
  ): brand is BrandDocument {
    if ((brand as BrandDocument).details) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Handles the updating of urls on updates.
   *
   * @param { BrandDocument } brand - the brand we're updating.
   *
   * @return Promise<BrandDocument>
   */
  static async UpdateDocumentURL(
    brand: BrandDocument
  ): Promise<BrandDocument> {

    // Create a raw name to be used for creating a URL formatted title.
    // This will be stored in the model so we can append a numeric value in the
    // URL for brands that have similar names.
    const nameRaw = Formatting.URLString(brand.name);

    // Check if a brand already exists with this url and append an
    // incremented count if it does.
    await Brand.count({
      nameRaw: nameRaw
    })
    .then((count: number) => {

      // Set the url.
      if (count <= 0) {
        brand.url = nameRaw;
      } else {
        brand.url = `${nameRaw}_${count++}`;
      }

      // Set the raw name.
      brand.nameRaw = nameRaw;
    })
    .catch((error: Error) => {

      // Return an error indicating the reviews couldn't be queried.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: `BRAND_URL_UPDATE_FAILED_COUNT`,
          message: 'There was a problem counting the brands with matching urls'
        },
        error: error
      }, 401, 'There was a problem counting the brands with matching urls');

      Logging.Send(LogLevel.ERROR, responseObject);

    });

    return brand;
  }
}
