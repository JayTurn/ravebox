/**
 * Actions.ts
 * Navigation actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { NavigationVerb } from './Actions.enum';

/**
 * Toggles the display of the side navigation.
 *
 * @param { boolean } display - the display state of the side navigation.
 */
export const toggleSide = (display: boolean) => action(
  NavigationVerb.TOGGLE_SIDE, display);
