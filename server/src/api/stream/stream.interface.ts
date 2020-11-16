/**
 * stream.interface.ts
 *
 * Interfaces for the streams.
 */

// Enumerators.
import {
  StreamType
} from './stream.enum';

// Interfaces.
import {
  ReviewDetails
} from '../review/review.interface';

export interface StreamData {
  title: string;
  reviews: Array<ReviewDetails>;
  streamType: StreamType;
}

export type StreamGroup = Record<string, Array<ReviewDetails>>;

export interface StreamListItem {
  streamType: StreamType;
  brand?: string;
  product?: string;
  productType?: string;
  collectionContext?: string;
  category?: string;
  user?: string;
}

export interface StreamList {
  title: string;
  streamItems: Array<StreamData>;
  streamType: StreamType;
  url: string;
}

