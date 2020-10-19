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
