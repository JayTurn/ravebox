/**
 * Link.common.tsx
 * Common functions for links.
 */

// Interfaces.
import { EventObject } from '../../analytics/Analytics.interface';
import { LinkTrackingData } from './Link.interface';

/**
 * Formats link data for tracking an event.
 *
 * @param { LinkTrackingData } linkData - the link tracking data provided.
 *
 * @return EventObject
 */
export const formatLinkForTracking: (
  linkData: LinkTrackingData
) => EventObject = (
  linkData: LinkTrackingData
): EventObject => {
  const data: EventObject = {
    'context': linkData.context,
    'target screen': linkData.targetScreen
  }

  return data;
}
