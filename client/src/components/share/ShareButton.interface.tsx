/**
 * ShareButton.interface.tsx
 * Interfaces for the share button.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Enumerators.
import {
  ShareStyle,
  ShareType
} from './ShareButton.enum';

// Interfaces.
import { EventObject } from '../analytics/Analytics.interface';
import { Review } from '../review/Review.interface';

/**
 * Share component properties interface.
 */
export interface ShareButtonProps extends RouteComponentProps {
  description?: string;
  eventData: EventObject;
  image?: string;
  sharePath?: string;
  shareStyle: ShareStyle;
  shareType: ShareType;
  title: string;
}
