/**
 * UserRaves.interface.tsx
 * Interfaces for the user's raves.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { Review } from '../../../components/review/Review.interface';

/**
 * UserRaves properties.
 */
export interface UserRavesProps extends RouteComponentProps<UserRavesParams> {
  setRaves: (reviews: Array<Review>) => void;
  raves: Array<Review>;
}

/**
 * Raves route parameters.
 */
export interface UserRavesParams {
  username: string;
}
