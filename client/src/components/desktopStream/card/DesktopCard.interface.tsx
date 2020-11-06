/**
 * DesktopCard.interface.tsx
 * Interface for rave streams shows in a card.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { RaveStreamType } from '../../raveStream/RaveStream.enum';

// Interfaces.
import {
  RaveStreamURLParams
} from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Stream card properties.
 */
export interface DesktopCardProps extends RouteComponentProps<RaveStreamURLParams> {
  review: Review
  streamType: RaveStreamType;
}
