/**
 * Tag.interface.tsx
 * Interfaces for tags.
 */

// Enumerators.
import { TagAssociation } from './Tag.enum';

/**
 * Tag item interface.
 */
export interface Tag {
  _id: string;
  name: string;
  labels: Array<string>;
  association: TagAssociation;
  context: string;
  children?: Array<Tag>;
}
