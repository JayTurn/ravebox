/**
 * collection.common.ts
 * Common functions performed with a collection document.
 */

// Intefaces.
import {
  CollectionDetails,
  CollectionDocument
} from './collection.interface';

// Models.
//import Collection from './collection.model';

/**
 * CollectionCommon class.
 */
export default class CollectionCommon {
  /**
   * Retrieve the collection details from a document.
   *
   * @param { CollectionDocument | CollectionDetails } brand - the collection object.
   *
   * @return CollectionDetails
   */
  static RetrieveDetailsFromDocuments(
    collectionDocument: CollectionDetails | CollectionDocument
  ): CollectionDetails {
    if (!CollectionCommon.isDocument(collectionDocument)) {
      return collectionDocument as CollectionDetails;
    }

    return (collectionDocument as CollectionDocument).details;
  }

  /**
   * Checks if the Collection is a document or details.
   */
  static isDocument(
    collection: CollectionDetails | CollectionDocument
  ): collection is CollectionDocument {
    if ((collection as CollectionDocument).details) {
      return true;
    } else {
      return false;
    }
  }
}
