/**
 * DesktopCardHolder.interface.tsx
 * Interface for the component that holds and controls desktop cards.
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
export interface DesktopCardHolderProps extends RouteComponentProps<RaveStreamURLParams> {
  hideProductTitles?: boolean;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  overrideTitle?: boolean;
  reviews: Array<Review>
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  hideStreamTag?: boolean;
  streamType: RaveStreamType;
  title: string;
  url?: string;
  xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  linkContext?: string;
}
