/**
 * Actions.ts
 * Channel actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { ChannelVerb } from './Actions.enum';

// Dependent interfaces.
import { ChannelDetails } from '../../routes/user/channel/Channel.interface';

/**
 * Sets an active channel in the redux store.
 *
 * @param { ChannelDetails } details - the channel to be set as active.
 */
export const updateActive = (details: ChannelDetails) => action(
  ChannelVerb.UPDATE_ACTIVE, details);
