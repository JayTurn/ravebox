/**
 * index.tsx
 * Manages the client side rendering of the react application.
 */

// Import the dependent modules.
import { ConnectedRouter } from 'connected-react-router';
import { Frontload } from 'react-frontload';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import React from 'react';

// Import the dependent components.
import AppContainer from '../routes/AppContainer';

// Import the dependent models.
import { store, history } from '../store/Store';

// Render the application using hyrdate to maintain the server-rendered markup
// and simlpy attach event handlers.
hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Frontload noServerRender={true}>
        <AppContainer />
      </Frontload>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If hot module replacement is present, trigger reloads from the app 
// container.
if (module.hot) {
  module.hot.accept('../routes/AppContainer', () => {
    // Render the application using hyrdate to maintain the server-rendered markup
    // and simlpy attach event handlers.
    hydrate(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Frontload noServerRender={true}>
            <AppContainer />
          </Frontload>
        </ConnectedRouter>
      </Provider>,
      document.getElementById('root')
    );
  });
}
