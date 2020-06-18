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
      flexWrap: 'nowrap'
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
    category,
    productName,
    subCategory
  } = {...props.match.params};

  // If we don't have a product name, redirect.
  const path: string = `${category}/${subCategory}/${brand}/${productName}`;

  await API.requestAPI<ProductResponse>(`product/view/${path}`, {
    method: RequestType.GET
  })
  .then((response: ProductResponse) => {
    if (props.updateActive) {
      props.updateActive({
        product: response.product,
        reviews: response.reviews
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

  const {
    queries,
    listStatus 
  } = useRetrieveListByQuery({
    ignoreProductIds: product ? [product._id] : undefined,
    listType: ReviewListType.CATEGORY,
    queries: setCategoryQueries(product.categories),
    update: props.updateListByCategory
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Track the product page view.
   */
  React.useEffect(() => {

    // Track the category list page view.
    if (!pageViewed && product._id) {

      const category: string = product.categories.length > 0
              ? product.categories[0].key
              : '',
            subCategory: string = product.categories.length > 1
              ? product.categories[1].key
              : '';

      analytics.trackPageView({
        properties: {
          path: props.location.pathname,
          title: `${product.brand} ${product.name} reviews`
        },
        data: {
          'product brand': product.brand,
          'product category': category,
          'product sub-category': subCategory,
          'product id': product._id,
          'product name': product.name
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
      direction='column'
    >
      {product._id &&
        <React.Fragment>
          <PageTitle title={`${product.brand} ${product.name} reviews`} />
          <Helmet>
            <title>{product.brand} {product.name} reviews - Ravebox</title>
            <link rel='canonical' href={`https://ravebox.io/product/${product.url}`} />
          </Helmet>
        </React.Fragment>
      }
      {reviews && reviews.length > 0 &&
        <Grid item xs={12} className={clsx(
            classes.listContainer,
            {
              [classes.listContainerLarge]: largeScreen
            }
          )}
        >
          <ReviewList
            context={ScreenContext.PRODUCT}
            reviews={reviews}
            retrievalStatus={RetrievalStatus.SUCCESS} 
          />
        </Grid>
      }
      {props.categoryGroup && product.categories &&
        <Grid item xs={12}>
          {product.categories[0] && props.categoryGroup[product.categories[0].key] &&
            <ListByQuery
              context={ScreenContext.PRODUCT_CATEGORY_LIST}
              listType={ReviewListType.CATEGORY}
              presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
              reviews={props.categoryGroup[product.categories[0].key]}
              title={
                <ListTitle
                  presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
                  title={`More ${product.categories[0].label} raves`}
                  url={`/categories/${product.categories[0].key}`}
                />
              }
            />
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
