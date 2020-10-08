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
  association: TagAssociation;
  full: TagDetails;
  name: string;
  labels: Array<string>;
  light: TagDetailsLight;
  partials: Array<string>;
  context: string;
  childen: Array<TagDetailsDocument>;
}

/**
 * Tag details.
 */
export interface TagDetails extends Mongoose.Document {
  _id: string;
  association: TagAssociation;
  name: string;
  label: string;
  context: string;
  childen?: Array<TagDetailsDocument>;
}

/**
 * Tag details.
 */
export interface TagDetailsLight extends Mongoose.Document {
  _id: string;
  association: TagAssociation;
  name: string;
  context: string;
}
