/**
 * StreamCard.interface.tsx
 * Interface for rave streams shows in a card.
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
export interface StreamCardProps {
  title: string;
  reviews: Array<Review>
  streamType: RaveStreamType;
  url: string;
}
