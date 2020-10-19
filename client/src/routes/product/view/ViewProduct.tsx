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
import {
  updateListByCategory,
} from '../../../store/review/Actions';

// Components.
import PageTitle from '../../../components/elements/pageTitle/PageTitle';
import ReviewList from '../../../components/review/list/ReviewList';
import ListByQuery from '../../../components/review/listByQuery/ListByQuery';
import ListTitle from '../../../components/elements/listTitle/ListTitle';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import {
  PresentationType,
  ReviewListType
} from '../../../components/review/listByQuery/ListByQuery.enum';
import { ScreenContext } from '../../../components/review/Review.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import {
  useRetrieveProductByURL
} from '../../../components/product/useRetrieveProductByURL.hook';
import {
  useRetrieveListByQuery
} from '../../../components/review/listByQuery/useRetrieveListsByQuery.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  Category
} from '../../../components/category/Category.interface';
import {
  ProductResponse,
  ProductView
} from '../../../components/product/Product.interface';
import {
  Review,
  ReviewGroup
} from '../../../components/review/Review.interface';
import { ViewProductProps } from './ViewProduct.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
    },
    listContainer: {
      padding: 0
    },
    listContainerLarge: {
      padding: theme.spacing(0, 2)
    }
  })
);

/**
 * Formulates a list of categories based on the selected product.
 *
 * @param { Array<Category> } categories - the list of categories.
 *
 * @return Array<string>
 */
const setCategoryQueries: (
  categories: Array<Category>
) => Array<string> = (
  categories: Array<Category>
): Array<string> => {
  const queries: Array<string> = [];

  if (!categories || categories.length <= 0) {
    return queries;
  }

  let i: number = 0;

  do {
    const current: Category = categories[i];
      queries.push(current.key);
    i++;
  } while (i < categories.length);

  return queries;
}

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
        product: response.product
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
    reviews
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
      className={clsx(classes.container)}
      container
    >
      {productStatus === ViewState.FOUND &&
        <Grid item xs={12}>
          {product._id &&
            <React.Fragment>
              <PageTitle title={`${product.brand.name} ${product.name}`} />
              <Helmet>
                <title>{product.brand.name} {product.name} - Ravebox</title>
                <meta name='description' content={`Discover reviews for the ${product.brand.name} ${product.name} created and shared by users on Ravebox.`} />
                <link rel='canonical' href={`https://ravebox.io/product/${product.url}`} />
              </Helmet>
            </React.Fragment>
          }
        </Grid>
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
      updateActive: updateActive,
      updateListByCategory
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ViewProductProps) => {
  // Retrieve the active category groups.
  const categoryGroup: ReviewGroup | undefined = state.review ? state.review.listByCategory : undefined;
  // Retrieve the review from the active properties.
  const productView: ProductView = state.product ? state.product.active : undefined;

  return {
    ...ownProps,
    categoryGroup,
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
