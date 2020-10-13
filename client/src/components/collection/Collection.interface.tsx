/**
 * Collection.interface.tsx
 * Interfaces for the collections.
 */

// Enumerators.
import { CollectionContext } from './Collection.enum';
import {
  RetrievalStatus
} from '../../utils/api/Api.enum';

// Interfaces.
import { APIResponse } from '../../utils/api/Api.interface';
import { PublicProfile } from '../user/User.interface';
import { Product } from '../product/Product.interface';
import { Review } from '../review/Review.interface';

/**
 * Collection interface.
 */
export interface Collection {
  _id: string;
  context: CollectionContext;
  owner: PublicProfile;
  products?: Array<Product>;
  reviews?: Array<Review>;
  title: string;
}

/**
 * Collection request body.
 */
export interface CollectionRequest {
  _id?: string;
  context: CollectionContext;
  products?: Array<string>;
  reviews?: Array<string>;
  title: string;
}

/**
 * Collection by id search hook params.
 */
export interface RetrieveCollectionByIdParams {
  id: string;
  context: CollectionContext;
  collectionType: 'product' | 'review';
  retrievalStatus?: RetrievalStatus;
}

/**
 * Response from the request to retrieve collections by id.
 */
export interface RetrieveCollectionByIdResponse extends APIResponse {
  collections: Array<Collection>;
}
