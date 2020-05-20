/**
 * Actions.ts
 * Review actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { DiscoverVerb } from './Actions.enum';

// Dependent interfaces.
import {
  DiscoverGroup
} from '../../components/discover/Discover.interface';

/**
 * Updates the list of discover groups in the redux store.
 *
 * @param { Array<DiscoverGroup> } list - the list of groups to be made active.
 */
export const updateGroups = (groups: Array<DiscoverGroup>) => action(
  DiscoverVerb.UPDATE_GROUPS, groups);
