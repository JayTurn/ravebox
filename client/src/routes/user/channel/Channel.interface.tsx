/**
 * Channel.interface.tsx
 * Interfaces for the user's profile screen.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PublicProfile } from '../../../components/user/User.interface';
import { RaveStream } from '../../../components/raveStream/RaveStream.interface';

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
  profile?: PublicProfile;
  raveStreams?: Array<RaveStream>;
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
  profile?: PublicProfile;
  raveStream?: Array<RaveStream>;
}
