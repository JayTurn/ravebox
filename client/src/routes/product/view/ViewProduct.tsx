/**
 * ViewProduct.tsx
 * ViewProduct route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import { frontloadConnect } from 'react-frontload';
import { connect } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/product/Actions';

// Components.
import ProductTitle from '../../../components/product/title/ProductTitle';
import ProductTabs from '../../../components/product/tabs/ProductTabs';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import {
  useRetrieveProductByURL
} from '../../../components/product/useRetrieveProductByURL.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  ProductResponse,
  ProductView
} from '../../../components/product/Product.interface';
import { ViewProductProps } from './ViewProduct.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.paper
    },
    containerSwipe: {
      backgroundColor: `rgba(100,106,240, .1)`
    },
    productTitleContainer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2)
    },
  })
);

/**
 * Loads the product and related reviews from the api before rendering.
 * 
 * @param { ViewProductProps } props - the product details properties.
 */
const frontloadViewProduct = async (props: ViewProductProps) => {

  // Format the api request path.
  const {
    brand,
    productName
  } = {...props.match.params};

  // If we don't have a product name, redirect.
  const path: string = `${brand}/${productName}`;

  await API.requestAPI<ProductResponse>(`product/view/${path}`, {
    method: RequestType.GET
  })
  .then((response: ProductResponse) => {
    if (props.updateActive) {
      props.updateActive({
        ...response
      });
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });

};

/**
 * Route to retrieve a product and present the display components.
 */
const ViewProduct: React.FC<ViewProductProps> = (props: ViewProductProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    product,
    productStatus,
    raveStream
  } = useRetrieveProductByURL({
    existing: props.productView ? props.productView : undefined,
    setProductView: props.updateActive,
    requested: props.match.params
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Track the product page view.
   */
  React.useEffect(() => {

    // Track the category list page view.
    if (!pageViewed && product._id) {

      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: `${product.brand} ${product.name} reviews`
        },
        data: {
          'brand id': product.brand._id,
          'brand name': product.brand.name,
          'product id': product._id,
          'product name': product.name,
          'product type id': product.productType._id,
          'product type name': product.productType.name
        },
        amplitude: {
          label: 'view product'
        }
      });

      setPageViewed(true);

    }
  }, [pageViewed, product]);

  return (
    <Grid
      alignItems='flex-start'
      container
      className={clsx(
        classes.container, {
          [classes.containerSwipe]: !largeScreen
        }
      )}
    >
      {productStatus === ViewState.FOUND && product._id &&
        <React.Fragment>
          <Helmet>
            <title>What users are saying about the {product.brand.name} {product.name} on Ravebox</title>
            <meta name='description' content={`Watch ${product.brand.name} ${product.name} raves shared by users on Ravebox.`} />
            <link rel='canonical' href={`https://ravebox.io${props.history.location.pathname}`} />
            <title>What users are saying about the {product.brand.name} {product.name} on Ravebox</title>
            <meta name='description' content={`Watch ${product.brand.name} ${product.name} raves shared by users on Ravebox.`} />
            <link rel='canonical' href={`https://ravebox.io${props.history.location.pathname}`} />
            <meta name='og:site_name' content={`Ravebox`} />
            <meta name='og:title' content={`Everything you need to know about the ${product.brand.name} ${product.name} shared by users on Ravebox.`} />
            <meta name='og:description' content={`Watch ${product.brand.name} ${product.name} video reviews shared by users on Ravebox.`} />
            <meta name='og:image' content={product.images && product.images.length > 0 ? `${product.images[0].url}` : ''} />
            <meta name='twitter:image' content={product.images && product.images.length > 0 ? `${product.images[0].url}` : ''} />
            <meta name='og:url' content={`https://ravebox.io${props.history.location.pathname}`} />
            <meta name='twitter:title' content={`Everything you need to know about the ${product.brand.name} ${product.name} shared by users on Ravebox.`} />
            <meta name='twitter:description' content={`Watch ${product.brand.name} ${product.name} video reviews shared by users on Ravebox.`} />
            <meta name='twitter:image:alt' content={`Preview image for the ${product.brand.name} ${product.name} shared on Ravebox`} />
            <meta name='twitter:card' content={`summary_large_image`} />
          </Helmet>
          <Grid item xs={12} className={clsx(classes.productTitleContainer)}>
            <ProductTitle
              product={{...product}} 
              variant='h1'
            />
          </Grid>
          <Grid item xs={12}>
            <ProductTabs
              product={{...product}}
              raveStream={raveStream}
            />
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the product.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateActive: updateActive
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ViewProductProps) => {
  // Retrieve the review from the active properties.
  const productView: ProductView = state.product ? state.product.active : undefined;

  return {
    ...ownProps,
    productView
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadViewProduct,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(ViewProduct)
));
