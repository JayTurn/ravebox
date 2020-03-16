/**
 * PageNotFound.tsx
 * Page not found component route.
 */

// Import the dependent modules.
import * as React from 'react';
import { Helmet } from 'react-helmet';

// Import the dependent containers.
//import ContentHeader from '../../containers/content/contentHeader/ContentHeader';

// Import the dependent styles.
//import './PageNotFound.css';

class PageNotFound extends React.Component {
  /**
   * Render the membership wizard jsx.
   */
  public render() {
    return (
      <div className="block--page-not-found-container">
        <Helmet title="Oops this page doesn't exist" />
        <div className="row">
          <div className="col s12">
            <p>
              Sorry, we can't seem to find the page you're looking for. Please get
              in touch if the problem persists.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default PageNotFound;
