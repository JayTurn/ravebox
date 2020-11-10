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
export interface TagDocument extends Mongoose.Document {
  _id: string;
  association: TagAssociation;
  context: string;
  details: TagDetails;
  name: string;
  labels: Array<string>;
  light: TagDetailsLight;
  linkFrom: Array<TagDocument>;
  linkTo: Array<TagDocument>;
  namePartials: Array<string>;
  nameRaw: string;
  url: string;
}

/**
 * Tag details.
 */
export interface TagDetails {
  _id: string;
  association: TagAssociation;
  name: string;
  labels: Array<string>;
  context: string;
  linkFrom?: Array<TagDetails>;
  url: string;
}

/**
 * Tag details.
 */
export interface TagDetailsLight {
  _id: string;
  association: TagAssociation;
  name: string;
  context: string;
}

/**
 * Tag updates.
 */
export interface TagUpdates {
  name?: string;
  labels?: Array<string>;
  context?: string;
  linkFrom?: Array<Mongoose.Types.ObjectId>;
}
