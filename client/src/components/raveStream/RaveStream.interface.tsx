/**
 * RaveStream.interface.tsx
 * Interfaces for the rave stream components.
 */

// Enumerators.
import { RaveStreamType } from './RaveStream.enum';

// Interfaces.
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
  requested: RaveStreamURLParams;
  setActiveRaveStream?: (raveStream: RaveStream) => void;
  setActiveRave?: (index: number) => void;
}
