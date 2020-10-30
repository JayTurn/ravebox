/**
 * StreamCardHolder.interface.tsx
 * Interface for the component that holds and controls stream cards.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import {
  RaveStreamURLParams
} from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Stream card properties.
 */
export interface StreamCardHolderProps extends RouteComponentProps<RaveStreamURLParams> {
  title: string;
  reviews: Array<Review>
  streamType: RaveStreamType;
  url?: string;
  overrideTitle?: boolean;
}
