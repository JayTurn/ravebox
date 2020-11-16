/**
 * SwipeCardHolder.interface.tsx
 * Interface for the component that holds and controls stream cards.
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
export interface SwipeCardHolderProps extends RouteComponentProps<RaveStreamURLParams> {
  title: string;
  reviews: Array<Review>
  hidePlayAll?: boolean;
  streamType: RaveStreamType;
  url?: string;
  overrideTitle?: boolean;
}
