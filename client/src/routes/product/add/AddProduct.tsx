/**
 * AddProduct.tsx
 * AddProduct route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.
import PageTitle from '../../../components/elements/pageTitle/PageTitle';
import ProductForm from '../../../components/product/form/ProductForm';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AddProductProps } from './AddProduct.interface';
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';

/**
 * AddProduct component.
 */
const AddProduct: React.FC<AddProductProps> = (props: AddProductProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: 'Add a new product'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed]);

  return (
    <Grid
      container
      direction='column'
      style={{marginBottom: '3rem'}}
    >
      <Helmet>
        <title>Add a new product - Ravebox</title>
        <link rel='canonical' href='https://ravebox.io/product/add' />
      </Helmet>
      <PageTitle title='Post a rave' />
      <ProductForm />
    </Grid>
  );
}

/**
 * Map the redux state to the add product properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AddProductProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(AddProduct));
