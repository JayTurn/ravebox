/**
 * product.interface.ts
 * Interface for the product details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import { TagDetails } from '../tag/tag.interface';

/**
 * Brand interface.
 */
export interface BrandDetailsDocument extends Mongoose.Document {
  _id: string;
  created?: Date;
  description: string;
  details: BrandDetails;
  logo: string;
  name: string;
  namePartials?: Array<string>;
  admins: Array<string>;
  url: string;
}

export interface BrandDetails {
  _id?: string;
  description: string;
  logo: string;
  name: string;
  namePartials?: Array<string>;
  url: string;
}
