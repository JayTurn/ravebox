/**
 * tag.common.ts
 * Common functions performed with a tag document.
 */

// Intefaces.
import {
  TagDetailsDocument,
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
    tagDocuments: Array<TagDetails | TagDetailsDocument> | undefined
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
        currentTag = (tagDocuments[i] as TagDetailsDocument).details;
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
   * Checks if the Tag is a document or details.
   */
  static isDocument(
    tag: TagDetails | TagDetailsDocument
  ): tag is TagDetailsDocument {
    if ((tag as TagDetailsDocument).details) {
      return true;
    } else {
      return false;
    }
  }

}
