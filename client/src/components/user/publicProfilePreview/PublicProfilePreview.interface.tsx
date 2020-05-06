/**
 * PublicProfilePreview.interface.tsx
 * Interfaces for the user's public profile preview.
 */

// Interfaces.
import { PublicProfile } from '../User.interface';

/**
 * Properties for the public profile preview component.
 */
export interface PublicProfilePreviewProps extends PublicProfile {
}

/**
 * Paramters used when retrieving a public profile from the api.
 */
export interface RetrievePublicProfileStatisticsParams {
  id: string;
}

/**
 * Response from the api when a public profile.
 */
export interface PublicProfileStatisticsResponse {
  statistics: {
    ravesCount: number;
    subscriberCount: number;
  };
}

/**
 * Public profile statistics.
 */
export interface PublicProfileStatistics {
  ravesCount: string;
  subscriberCount: string;
}
