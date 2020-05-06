/**
 * Interfaces for the channel store.
 */

// Modules.
import { ActionType } from 'typesafe-actions';

// Actions.
import * as actions from './Actions';

// Interfaces.
import { ChannelDetails } from '../../routes/user/channel/Channel.interface';

/**
 * Redux channel action action type.
 */
export type ChannelAction = ActionType<typeof actions>;

/**
 * Channel store interface.
 */
export interface ChannelStore {
  active: ChannelDetails;
}
