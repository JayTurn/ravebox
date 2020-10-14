/**
 * Tag.interface.tsx
 * Interfaces for tags.
 */

// Enumerators.
import { TagAssociation } from './Tag.enum';

// Interfaces.
import { APIResponse } from '../../utils/api/Api.interface';

/**
 * Tag item interface.
 */
export interface Tag {
  _id: string;
  name: string;
  labels: Array<string>;
  association: TagAssociation;
  context: string;
  linkFrom?: Array<Tag>;
  linkTo?: Array<Tag>;
}

/**
 * Resonse for creating new tags.
 */
export interface AddTagFormResponse extends APIResponse {
  tag: Tag;
}
