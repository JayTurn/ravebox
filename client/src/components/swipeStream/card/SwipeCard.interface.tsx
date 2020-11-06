/**
 * SwipeCard.interface.tsx
 * Interface for rave streams shows in a card.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { CardPosition } from '../card/SwipeCard.enum';
import { RaveStreamType } from '../../raveStream/RaveStream.enum';

// Interfaces.
import {
  RaveStreamURLParams
} from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Stream card properties.
 */
export interface SwipeCardProps extends RouteComponentProps<RaveStreamURLParams> {
  active: boolean;
  positioning: CardPosition; 
  review: Review
  streamType: RaveStreamType;
}
