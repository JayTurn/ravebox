/**
 * StreamCard.interface.tsx
 * Interface for rave streams shows in a card.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { CardPosition } from '../card/StreamCard.enum';
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import {
  RaveStreamURLParams
} from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Stream card properties.
 */
export interface StreamCardProps extends RouteComponentProps<RaveStreamURLParams> {
  active: boolean;
  positioning: CardPosition; 
  review: Review
  streamType: RaveStreamType;
}
