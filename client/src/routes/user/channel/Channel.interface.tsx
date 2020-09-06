/**
 * Channel.interface.tsx
 * Interfaces for the user's profile screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PublicProfile } from '../../../components/user/User.interface';
import { Review } from '../../../components/review/Review.interface';

/**
 * Channel properties.
 */
export interface ChannelProps extends RouteComponentProps<ChannelParams> {
  channel?: ChannelDetails;
  updateActive?: (details: ChannelDetails) => void;
}

/**
 * Interface for the channel details.
 */
export interface ChannelDetails {
  profile?: {
    _id: string;
    avatar?: string;
    handle: string;
    ravesCount: string;
  };
  reviews?: Array<Review>;
}

/**
 * Url parameters for the route.
 */
export interface ChannelParams {
  handle: string;
}

/**
 * The channel profile interface.
 */
export interface ChannelProfile extends PublicProfile {
  ravesCount?: string;
}

/**
 * Parameters used for retrieving a user's channel.
 */
export interface RetrieveChannelParams {
  handle: string;
  channel?: ChannelDetails;
  updateActive?: (details: ChannelDetails) => void;
}


/**
 * Response interface for a channel request.
 */
export interface ChannelResponse extends APIResponse {
  channel: ChannelDetails;
}
