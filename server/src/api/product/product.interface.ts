/**
 * product.interface.ts
 * Interface for the product details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Interfaces.
import { TagDetails } from '../tag/tag.interface';

/**
 * Product interface.
 */
export interface ProductDetailsDocument extends Mongoose.Document {
  _id: string;
  added?: Date;
  brand: string;
  brandPartials?: Array<string>;
  category: string;
  categories: Array<Category>;
  categoriesPartials?: Array<string>;
  competitors: Array<string>;
  complentary: Array<string>;
  creator: string;
  description: string;
  details: ProductDetails;
  images: Array<ProductImage>;
  name: string;
  namePartials?: Array<string>;
  productType: string;
  reviews?: Array<ProductReview>;
  synchronize: Function;
  tags: Array<string>;
  url: string;
  website: string;
}

export interface ProductDetails {
  _id?: string;
  brand: string;
  category: string;
  competitors: Array<string>;
  complementary: Array<string>;
  description: string;
  images: Array<ProductImage>;
  name: string;
  namePartials?: Array<string>;
  productType: TagDetails;
  tags: Array<TagDetails>;
  url: string;
  website: string;
}

export interface ProductReview {
  user: string;
  score: string;
}

export interface Category {
  key: string;
  label: string;
}

export interface ProductUpdates {
  brand?: Mongoose.Types.ObjectId;
  category?: Mongoose.Types.ObjectId;
  description?: string;
  images?: Array<ProductImage>;
  name?: string;
  namePartials?: Array<string>;
  productType?: Mongoose.Types.ObjectId;
  tags?: Array<Mongoose.Types.ObjectId>;
}

export interface ProductImage {
  title: string;
  url: string;
  creditText: string;
  creditUrl: string;
  user?: Mongoose.Types.ObjectId;
}
