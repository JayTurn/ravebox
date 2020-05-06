/**
 * RootReducer.ts
 * Combines root reducers with application specific ones.
 */

// Dependent modules.
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import * as H from 'history';

// Dependent models.
import ChannelReducer from './channel/Reducer';
import NavigationReducer from './navigation/Reducer';
import ReviewReducer from './review/Reducer';
import UserReducer from './user/Reducer';
import XsrfReducer from './xsrf/Reducer';

// Combine the router reducer with the application reducers to create a single
// root reducer.
const RootReducer = (history: H.History) =>
  combineReducers({
    router: connectRouter(history),
    channel: ChannelReducer,
    navigation: NavigationReducer,
    review: ReviewReducer,
    user: UserReducer,
    xsrf: XsrfReducer
  });

export default RootReducer;
