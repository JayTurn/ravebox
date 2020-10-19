/**
 * tag.common.ts
 * Common functions performed with a tag document.
 */

// Intefaces.
import {
  TagDocument,
  TagDetails
} from './tag.interface';

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

}
