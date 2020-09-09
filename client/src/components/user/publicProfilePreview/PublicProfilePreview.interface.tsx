/**
 * PublicProfilePreview.interface.tsx
 * Interfaces for the user's public profile preview.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { PublicProfile } from '../User.interface';

/**
 * Properties for the public profile preview component.
 */
export interface PublicProfilePreviewProps extends RouteComponentProps, PublicProfile {
  ravesCount?: string;
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
    followers: number;
  };
}

/**
 * Public profile statistics.
 */
export interface PublicProfileStatistics {
  ravesCount: string;
  followers: string;
}
