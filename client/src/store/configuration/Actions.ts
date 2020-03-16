/**
 * Actions.ts
 * Configuration actions.
 */

// Dependent modules.
import { action } from 'typesafe-actions';

// Dependent enumerators.
import { ConfigurationVerb } from './Actions.enum';

// Dependent interfaces.
import { APIImageConfig } from '../../utils/api/Api.interface';

/**
 * Define the change action to update image configuration.
 *
 * @param { APIImageConfig } configuration - the image configuration data.
 */
export const updateAPIImageConfig = (configuration: APIImageConfig) => action(
  ConfigurationVerb.UPDATE_API_IMAGE_CONFIG, configuration);
