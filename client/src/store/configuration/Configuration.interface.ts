/**
 * Interfaces for the configuration store.
 */

// Dependent modules.
import { ActionType } from 'typesafe-actions';

// Dependent models.
import * as actions from './Actions';

// Dependent interfaces.
import { APIImageConfig } from '../../utils/api/Api.interface';

/**
 * Redux content action type.
 */
export type ConfigurationAction = ActionType<typeof actions>;

/**
 * Content store interface.
 */
export interface ConfigurationStore {
  images: APIImageConfig;
}

