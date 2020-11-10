/**
 * tag.common.ts
 * Common functions performed with a tag document.
 */

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { TagAssociation } from './tag.enum';

// Intefaces.
import { ResponseObject } from '../../models/database/connect.interface';
import {
  TagDocument,
  TagDetails
} from './tag.interface';

// Models.
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import Tag from './tag.model';

// Utilities.
import Formatting from '../../shared/formatting/formatting.model';

/**
 * TagCommon class.
 */
export default class TagCommon {
  /**
   * Loads nested links if they exist.
   */
  static LoadLinks(
    tagDocuments: Array<TagDetails | TagDocument> | undefined
  ): Array<TagDetails> | undefined {

    if (!tagDocuments) {
      return;
    }

    // Loop through the tags and load the child tags if present.
    let i = 0;
    const tags: Array<TagDetails> = [];

    do {
      let currentTag: TagDetails;

      if (TagCommon.isDocument(tagDocuments[i])) {
        currentTag = (tagDocuments[i] as TagDocument).details;
      } else {

        // If we don't have a name for the tag, avoid adding it to the array.
        if (!tagDocuments[i].name) {
          i++;
          continue;
        }

        currentTag = tagDocuments[i];
      }

      if (currentTag.linkFrom && currentTag.linkFrom.length > 0) {
        currentTag.linkFrom = TagCommon.LoadLinks(currentTag.linkFrom);
      }

      tags.push(currentTag);

      i++;
    } while (i < tagDocuments.length);
    
    // Loop through the 
    return tags;
  }

  /**
   * Retrieve the tag details from a document.
   *
   * @param { TagDocument | TagDetails } brand - the tag object.
   *
   * @return TagDetails
   */
  static RetrieveDetailsFromDocuments(
    tagDocument: TagDetails | TagDocument
  ): TagDetails {
    if (!TagCommon.isDocument(tagDocument)) {
      return tagDocument as TagDetails;
    }

    return (tagDocument as TagDocument).details;
  }

  /**
   * Checks if the Tag is a document or details.
   */
  static isDocument(
    tag: TagDetails | TagDocument
  ): tag is TagDocument {
    if ((tag as TagDocument).details) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Handles the updating of urls on updates.
   *
   * @param { TagDocument } tag - the tag we're updating.
   *
   * @return Promise<ProductDocument>
   */
  static async UpdateDocumentURL(
    tag: TagDocument
  ): Promise<TagDocument> {

    // Create a raw name to be used for creating a URL formatted tag.
    // This will be stored in the model so we can append a numeric value in the
    // URL for tags that have matching names.
    const nameRaw = Formatting.URLString(tag.name);

    // Check if a tag already exists with this url and append an
    // incremented count if it does.
    await Tag.count({
      nameRaw: nameRaw
    })
    .then((count: number) => {

      // Set the url.
      if (count <= 0) {
        tag.url = nameRaw;
      } else {
        tag.url = `${nameRaw}_${count++}`;
      }

      // Set the raw name.
      tag.nameRaw = nameRaw;
    })
    .catch((error: Error) => {

      // Return an error indicating the tag couldn't be queried.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: `TAG_URL_UPDATE_FAILED_COUNT`,
          message: 'There was a problem counting the products with matching urls'
        },
        error: error
      }, 401, 'There was a problem counting the products with matching urls');

      Logging.Send(LogLevel.ERROR, responseObject);

    });

    return tag;
  }

  /**
   * Returns a list of tags by recursively linking.
   *
   * @param { string } url - the url of the top level tag.
   * @param { TagAssociation } association - the target association.
   */
  static RecursiveSearchTags(id: string, association: TagAssociation): Promise<Array<TagDetails>> {

    const tags: Array<TagDetails> = []; 

    return Tag.find({
      linkFrom: id
    })
    .lean()
    .then((tagDetails: Array<TagDetails>) => {
      if (!tagDetails || tagDetails.length <= 0) {
        return tags;
      }

      let i = 0;

      const nextList: Array<string> = [];

      do {
        const current: TagDetails = tagDetails[i];
        
        if (current.association === association) {
          tags.push({...current});
        } else {
          nextList.push(current._id);
        }

        i++;
      } while (i < tagDetails.length);

      if (nextList.length > 0) {
        return Tag.find({
          linkFrom: nextList,
          association: association
        })
        .lean();
      } else {
        return nextList;
      }
    })
    .then((tagDetails: Array<TagDetails>) => {
      if (!tagDetails || tagDetails.length <= 0) {
        return tags;
      }

      let i = 0;

      do {
        tags.push({...tagDetails[i]});
        i++;
      } while (i < tagDetails.length);

      return tags;
    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `RECURSIVE_TAG_SEARCH_FAILED`,
          message: `There was a problem searching for tags.`
        },
        error
      }, 404, `There was a problem recursively searching for tags.`);

      Logging.Send(LogLevel.ERROR, responseObject);

      return tags;
    });

  }
}
