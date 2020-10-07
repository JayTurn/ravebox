/**
 * tag.interface.ts
 * Interface for the tag details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { TagAssociation } from './tag.enum';

/**
 * Mongoose Tag document.
 */
export interface TagDetailsDocument extends Mongoose.Document {
  _id: string;
  name: string;
  labels: Array<string>;
  partials: Array<string>;
  association: TagAssociation;
  context: string;
  childen: Array<TagDetailsDocument>;
}

/**
 * Tag details.
 */
export interface TagDetails extends Mongoose.Document {
  _id: string;
  name: string;
  label: string;
  association: TagAssociation;
  context: string;
  childen?: Array<TagDetailsDocument>;
}
