/**
 * Actions.ts
 * Loading actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { LoadingVerb } from './Actions.enum';

/**
 * Updates the current loading state in the redux store.
 *
 * @param { boolean }  - the loading state to be set.
 */
export const update = (loading: boolean) => action(
  LoadingVerb.UPDATE, loading);
