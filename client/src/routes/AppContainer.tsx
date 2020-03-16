/**
 * AppContainer.tsx
 * App container to manage props and state for the base application.
 */
'use strict';
// Import the dependent modules.
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Import the dependent components.
import App from './App';

// Import the dependent interfaces.
import { AppProps } from './App.interface';

// Import the material design sass.
import '../index.css';

/**
 * Maps the redux connect state to the App properties.
 * Add region from redux state
 *
 */
function mapStatetoProps(state: any, ownProps: AppProps) {
  return {
    ...ownProps
  };
}

export default withRouter(
  connect(
    mapStatetoProps
  )(App)
);
