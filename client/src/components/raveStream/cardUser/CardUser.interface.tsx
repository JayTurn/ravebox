/**
 * CardUser.interface.tsx
 * Interface for user information displayed in cards.
 */

// Modules.
//import { RouteComponentProps } from 'react-router';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';

/**
 * Card user properties.
 */
export interface CardUserProps {
  //active: boolean;
  review: Review;
}
