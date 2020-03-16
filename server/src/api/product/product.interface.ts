/**
 * product.interface.ts
 * Interface for the product details.
 */

// Interfaces.
import * as Mongoose from 'mongoose';

/**
 * Product interface.
 */
export interface ProductDetailsDocument extends Mongoose.Document {
  _id: string;
  brand: string;
  categories: Array<string>;
  created: Date;
  color?: string;
  dimensions?: string;
  name: string;
  rating?: number;
  reviews?: number;
  url: string;
}
