/**
 * Actions.ts
 * Xsrf actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { XsrfVerb } from './Actions.enum';

/**
 * Adds an xsrf token to the redux store.
 *
 * @param { string } token - the xsrf token to be added.
 */
export const add = (token: string) => action(
  XsrfVerb.ADD, token);

/**
 * Removes an xsrf token from the redux store.
 *
 * @param { string } token - the xsrf token to be removed.
 */
export const remove = (token: string) => action(
  XsrfVerb.REMOVE, '');
