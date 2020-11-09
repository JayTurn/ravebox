/**
 * SideCard.interface.tsx
 * Interface for a rave stream side card.
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
export interface SideCardProps extends RouteComponentProps<RaveStreamURLParams> {
  contextPath: string;
  next: boolean;
  review: Review
  streamType: RaveStreamType;
}
