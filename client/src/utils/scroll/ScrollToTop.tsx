/**
 * ScrollToTop.tsx
 * Scrolls to the top of the screen when location changes are registered.
 */

// Import the dependent modules.
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';

/**
 * ScrollToTop component class.
 * @class ScrollToTop
 */
class ScrollToTop extends React.Component<RouteComponentProps> {
  /**
   * Scroll the browser window to the top of the screen when screens have
   * changed.
   *
   * @method componentDidUpdate
   */
  componentDidUpdate(prevProps: Readonly<RouteComponentProps<any>>) {
    // Retrieve the current location path and compare it to the previous
    // location. If we have a new path, scroll the browser window to the top
    // of the screen.
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Render the component.
   * @method render
   */
  render() {
    return <React.Fragment />;
  }
}

export default withRouter(ScrollToTop);
