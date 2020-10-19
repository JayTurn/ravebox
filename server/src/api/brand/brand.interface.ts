/**
 * product.interface.ts
 * Interface for the product details.
 */

// Modules.
import * as Mongoose from 'mongoose';

/**
 * Brand interface.
 */
export interface BrandDocument extends Mongoose.Document {
  _id: string;
  created?: Date;
  description: string;
  details: BrandDetails;
  logo: string;
  name: string;
  namePartials?: Array<string>;
  nameRaw: string;
  admins: Array<string>;
  url: string;
}

export interface BrandDetails {
  _id?: string;
  description: string;
  details: BrandDetails;
  logo: string;
  name: string;
  namePartials?: Array<string>;
  url: string;
}
