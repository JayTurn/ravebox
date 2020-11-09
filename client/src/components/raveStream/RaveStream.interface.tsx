/**
 * RaveStream.interface.tsx
 * Interfaces for the rave stream components.
 */

// Enumerators.
import { RaveStreamType } from './RaveStream.enum';

// Interfaces.
import { Product } from '../product/Product.interface';
import {
  Review
} from '../review/Review.interface';

/**
 * Rave stream interface.
 */
export interface RaveStream {
  title: string;
  reviews: Array<Review>;
  streamType: RaveStreamType;
}

/**
 * Product stream URL parameters.
 */
export interface RaveStreamURLParams {
  streamType: RaveStreamType;
  firstPath?: string;
  secondPath?: string;
  thirdPath?: string;
  fourthPath?: string;
}

/**
 * Rave stream response.
 */
export interface RaveStreamResponse {
  raveStream: RaveStream;
}

/**
 * Retrive the product stream by URL parameters.
 */
export interface RetrieveStreamByURLParams {
  existing?: RaveStream;
  ignoreRavePath: boolean;
  requested: RaveStreamURLParams;
  setActiveRaveStream?: (raveStream: RaveStream) => void;
  setActiveRave?: (index: number) => void;
  setActiveProduct?: (product: Product) => void;
  swipeControlled?: boolean;
  updateLoading?: (loading: boolean) => void;
}

/**
 * Retrive the product stream by URL parameters.
 */
export interface RetrieveStreamByListParams {
  queries: Array<RaveStreamListItem>;
  name: string;
  updateList?: (raveStreams: RaveStreamList) => void;
}

/**
 * Retrive the rave stream by product parameters.
 */
export interface RetrieveStreamByProductParams {
  product?: Product;
}

/**
 * Rave stream list item parameters.
 */
export interface RaveStreamListItem {
  streamType: RaveStreamType;
  brand?: string;
  collectionContext?: string;
  product?: string;
  productType?: string;
}

/**
 * Rave stream list params.
 */
export interface RaveStreamListParams {
  list: Array<RaveStreamListItem>;
}

/**
 * Rave stream list response.
 */
export interface RaveStreamListResponse {
  raveStreams: Array<RaveStream>;
  title: string;
}

/**
 * Rave stream list.
 */
export interface RaveStreamList {
  title: string;
  raveStreams: Array<RaveStream>;
}
