/**
 * collection.interface.ts
 * Interface for the collections.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { CollectionContext } from './collection.enum';

// Interface.
import { PublicUserDetails } from '../user/user.interface';
import {
  ProductDetails,
  ProductDocument
} from '../product/product.interface';
import { ReviewDetails } from '../review/review.interface';

/**
 * Collection mongoose document interface.
 */
export interface CollectionDetailsDocument extends Mongoose.Document {
  _id: Mongoose.Types.ObjectId;
  context: CollectionContext;
  created: Date;
  details: CollectionDetails;
  owner: Mongoose.Types.ObjectId;
  products: Array<Mongoose.Types.ObjectId>;
  reviews: Array<Mongoose.Types.ObjectId>;
  title: string;
}

/**
 * Collection details interface.
 */
export interface CollectionDetails {
  _id: Mongoose.Types.ObjectId;
  context: CollectionContext;
  owner: PublicUserDetails;
  products: Array<ProductDetails | ProductDocument>;
  reviews: Array<ReviewDetails>;
  title: string;
}
