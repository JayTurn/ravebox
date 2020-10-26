/**
 * StreamCardHolder.interface.tsx
 * Interface for the component that holds and controls stream cards.
 */

// Modules.
//import { RouteComponentProps } from 'react-router';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * Stream card properties.
 */
export interface StreamCardHolderProps {
  title: string;
  reviews: Array<Review>
  streamType: RaveStreamType;
  url?: string;
}
