/**
 * Store.ts
 * Redux store.
 */

// Dependent modules.
import {
  applyMiddleware,
  compose,
  createStore,
  Store
} from 'redux';
import { routerMiddleware } from 'connected-react-router';
import * as H from 'history';

// Dependent models.
import RootReducer from './RootReducer';

// Create a history object to be passed to the store with the root reducer.
let h: H.History = H.createMemoryHistory();

// If the window object exists, create browser history.
if (process.env.BUILD_TARGET === 'client') {
  h = H.createBrowserHistory();
}

// Export the history object to be passed to the store with the root reducer.
export const history: H.History = h;

/**
 * Setup the store configuration.
 */
function configureStore(h: H.History = history, initialState?: object): Store {
  // Create the store, passing in the route history and root reducers. 
  const store = createStore(
    RootReducer(h),
    initialState,
    compose(
      applyMiddleware(
        routerMiddleware(h)
      )
    )
  );

  // If hot module replacement is available.
  if (module.hot) {

    // Enable webpack hot module replacement.
    module.hot.accept('./RootReducer', () => {

      // Update the root reducers.
      const nextRootReducer = require('./RootReducer').default;

      // Replace the existing root reducers with the updated ones.
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
} 

// Define the store.
export const store: Store = configureStore();
