/**
 * CardVideo.interface.tsx
 * Interface for videos that display in cards.
 */

// Modules.
//import { RouteComponentProps } from 'react-router';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * Card video properties.
 */
export interface CardVideoProps {
  active: boolean;
  review: Review;
}
