/**
 * Reducer.ts
 * Reducer for the configuration store.
 */

// Depentent modules.
import { combineReducers } from 'redux';

// Dependent enumerators.
import { ConfigurationVerb } from './Actions.enum';

// Dependent interfaces.
import { APIImageConfig } from '../../utils/api/Api.interface';
import {
  ConfigurationStore,
  ConfigurationAction
} from './Configuration.interface';

// The api configuration used as the default for the api reducer.
const imageConfig: APIImageConfig = {
  images: {
    base_url: '',
    secure_base_url: '',
    backdrop_sizes: [],
    logo_sizes: [],
    poster_sizes: [],
    profile_sizes: [],
    still_sizes: []
  },
  change_keys: []
}

/**
 * Combines the content reducers to be loaded with the store.
 */
export default combineReducers<ConfigurationStore, ConfigurationAction>({

  /**
   * Define the api image configuration redux reducer.
   *
   * @param { APIImageConfig } state - the .
   * @param { FiltersAction } action - the filters action.
   *
   * @return APIImageConfig
   */
  images: (state: APIImageConfig = imageConfig, action: ConfigurationAction) => {
    // Update the configuration based on the redux action triggered.
    switch (action.type) {
      case ConfigurationVerb.UPDATE_API_IMAGE_CONFIG:
        return action.payload as APIImageConfig;
      default:
        return state;
    }
  }
});
