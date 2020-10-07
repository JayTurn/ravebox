/**
 * Tag.common.tsx
 * Common functions for tags.
 */

// Enumerators.
import { TagAssociation } from './Tag.enum';

// Interface.
import { Tag } from './Tag.interface';

/**
 * Creates an empty Tag object for use in object definitions.
 *
 * @return EventObject
 */
export const emptyTag: (
) => Tag = (
): Tag => {
  return {
    _id: '',
    name: '',
    labels: [],
    association: TagAssociation.PRODUCT,
    context: ''
  };
}
