/**
 * SwipeStream.tsx
 * SwipeStream route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators, Dispatch
} from 'redux';
import API from '../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import { frontloadConnect } from 'react-frontload';
import { Helmet } from 'react-helmet';
import { helmetJsonLdProp } from 'react-schemaorg';
import * as React from 'react';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  update,
  updateActive,
  updateProduct
} from '../../store/raveStream/Actions';
import {
  update as updateLoading
} from '../../store/loading/Actions';

// Components.
import StreamProductDetails from '../raveStream/productDetails/StreamProductDetails';
import StreamReviewDetails from '../raveStream/reviewDetails/StreamReviewDetails';
import SwipeVideoController from './videoController/SwipeVideoController';
import LoadingRavebox from '../placeholders/loadingRavebox/LoadingRavebox';

// Enumerators.
// import { RaveStreamType } from '../raveStream/RaveStream.enum';
import {
  RequestType
} from '../../utils/api/Api.enum';
import { SwipeView } from './SwipeStream.enum';

// Hooks.
// import { useAnalytics } from '../analytics/Analytics.provider';
import {
  useRetrieveRaveStreamByURL 
} from '../raveStream/useRetrieveRaveStreamByURL.hook';

// Interfaces.
// import { AnalyticsContextProps } from '../analytics/Analytics.interface';
import { Product } from '../product/Product.interface';
import {
  Review as ReviewSchema,
  VideoObject as VideoSchema
} from 'schema-dts';
import {
  RaveStream,
  RaveStreamResponse,
  RaveStreamURLParams
} from '../raveStream/RaveStream.interface';
import { Review } from '../review/Review.interface';
import {
  SwipeStreamProps
} from './SwipeStream.interface';

// Utilities.
import {
  // buildContextPath,
  buildRaveStreamPath,
  buildReviewSchema,
  buildVideoSchema,
  getStreamPageDescription,
  getStreamPageTitle,
  retrieveRaveURL
} from '../raveStream/RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100%',
      //minHeight: 'calc(100vh); min-height: -webkit-fill-available;',
      //maxHeight: 'calc(100vh); max-height: -webkit-fill-available;',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      width: 'calc(100vw)',
      zIndex: 1
    },
    detailsContainer: {
      height: '100vh',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100vw'
    },
    loading: {
      height: '100%',
    },
    loadingContainerHidden: {
      zIndex: 0
    },
    loadingContainerEntering: {
      opacity: 1,
    },
    loadingContainerEntered: {
      opacity: 1,
    },
    loadingContainerExiting: {
      opacity: 1,
    },
    loadingContainerExited: {
      opacity: 0,
    },
    loadingContainer: {
      backgroundColor: theme.palette.background.default,
      height: '100%',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      transition: `opacity 100ms ease-in-out`,
      width: 'calc(100vw)',
      zIndex: 5
    }
  })
);

/**
 * Loads the rave stream from the api before rendering.
 * 
 * @param { SwipeStreamProps } props - the swipe stream properties.
 */
const frontloadProductStream = async (props: SwipeStreamProps) => {

  // Format the api request path.
  const params: RaveStreamURLParams = {...props.match.params};

  // Set the path to be requested via the api and append the review title
  // if it has been provided in the URL.
  let path: string = buildRaveStreamPath(params)(false),
      contextPath: string = buildRaveStreamPath(params)(true);

  await API.requestAPI<RaveStreamResponse>(`stream/${path}`, {
    method: RequestType.GET
  })
  .then((response: RaveStreamResponse) => {
    if (props.updateActiveRaveStream) {
      props.updateActiveRaveStream({
        ...response.raveStream,
        path: contextPath
      });
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};

/**
 * Route to retrieve a rave stream and present the swipeable components.
 */
const SwipeStream: React.FC<SwipeStreamProps> = (props: SwipeStreamProps) => {
  // Define the analytics context and a tracking event.
  // const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles();
        // theme = useTheme();

  const {
    isMounted,
    loadRave,
    // raveStream,
    raveStreamStatus
  } = useRetrieveRaveStreamByURL({
    existing: props.raveStream ? props.raveStream : undefined,
    ignoreRavePath: true,
    setActiveRaveStream: props.updateActiveRaveStream,
    setActiveRave: props.updateActiveIndex,
    setActiveProduct: props.updateProduct,
    swipeControlled: true,
    requested: props.match.params,
    updateLoading: props.updateLoading
  })

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [swipeView, setSwipeView] = React.useState<SwipeView>(SwipeView.VIDEO);

  const [ravePath, setRavePath] = React.useState<string>('');

  const [upperOverlay, setUpperOverlay] = React.useState<SwipeView>(SwipeView.PRODUCT);

  const schemas = [
    helmetJsonLdProp<ReviewSchema>(
      buildReviewSchema(props.product)(props.review)
    ),
    helmetJsonLdProp<VideoSchema>(
      buildVideoSchema(props.review)
    )
  ];

 /**
 * Intercept the back button to take us back to the stored back path.
 */
  React.useEffect(() => props.history.listen(() => {
    if (props.history.action === 'POP') {
      if (props.backPath) {
        props.history.push(props.backPath);
      }
    }
  }), [props.history, props.backPath]);

  /**
   * Track the stream view.
   */
  React.useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (props.review && props.review.url) {

      const raveURL: string = retrieveRaveURL(props.match.params);

      if (ravePath !== props.location.pathname) {
        loadRave(raveURL)(props.match.params);

        // const contextPath: string = buildContextPath(props.match.params.streamType)(props.match.params);

        if (ravePath) {
          props.history.push(props.location.pathname);
        }

        setRavePath(props.location.pathname);

        handleDisplayChange(SwipeView.VIDEO);
      }

    }

    // Track the category list page view.
    if (!pageViewed && props.product && props.product._id) {

      /*
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

      */
      setPageViewed(true);

    }


  }, [
    isMounted,
    pageViewed,
    props.loading,
    props.product,
    props.match.params,
    props.review,
    ravePath,
    raveStreamStatus
  ]);

  /**
   * Sets the video view position.
   *
   * @param { SwipeView } view - the view to be displayed.
   */
  const handleDisplayChange: (
    view: SwipeView
  ) => void = (
    view: SwipeView
  ): void => {
    if (isMounted) {

      if (view === SwipeView.VIDEO) {
        setUpperOverlay(swipeView);
      } else {
        setUpperOverlay(view);
      }

      setSwipeView(view);
    }
  }

  return (
    <Box className={clsx(classes.container)}>
      {props.raveStream && props.review && props.review.user && props.review.product &&
        <Helmet
          script={schemas}
        >
          <title>{getStreamPageTitle(props.raveStream)}</title>
          <meta name='description' content={getStreamPageDescription(props.raveStream)} />
          <link rel='canonical' href={`https://ravebox.io${props.history.location.pathname}`} />
          <meta name='og:site_name' content={`Ravebox`} />
          <meta name='og:title' content={`Watch the ${props.review.product.brand.name} ${props.review.product.name} rave created by ${props.review.user.handle} - Ravebox`} />
          <meta name='og:description' content={`${props.review.user.handle} talks about their experience with the ${props.review.product.brand.name} ${props.review.product.name} on Ravebox.`} />
          <meta name='og:image' content={`${props.review.thumbnail}`} />
          <meta name='og:url' content={`https://ravebox.io${props.review.url}`} />
          <meta name='twitter:title' content={`Watch the ${props.review.product.brand.name} ${props.review.product.name} rave created by ${props.review.user.handle} - Ravebox`} />
          <meta name='twitter:description' content={`${props.review.user.handle} talks about their experience with the ${props.review.product.brand.name} ${props.review.product.name} on Ravebox.`} />
          <meta name='twitter:image' content={`${props.review.thumbnail}`} />
          <meta name='twitter:image:alt' content={`Preview image for ${props.review.user.handle}'s rave of the ${props.review.product.brand.name} ${props.review.product.name}`} />
          <meta name='twitter:card' content={`summary_large_image`} />
        </Helmet>
      }
      <LoadingRavebox title={`Loading rave`} />
      {props.raveStream && props.raveStream.reviews && props.raveStream.reviews.length > 0 &&
        <SwipeVideoController
          showing={swipeView}
          displayChange={handleDisplayChange}
        />
      }
      <Box className={clsx(classes.detailsContainer)} style={{zIndex: upperOverlay === SwipeView.PRODUCT ? 2 : 1}}>
        {props.product &&
          <StreamProductDetails product={{...props.product}} />
        }
      </Box>
      {props.raveStream && props.raveStream.reviews && props.raveStream.reviews.length > 0 &&
        <Box className={clsx(classes.detailsContainer)} style={{zIndex: upperOverlay === SwipeView.REVIEW ? 2 : 1}}>
          {props.review &&
            <StreamReviewDetails review={{...props.review}} />
          }
        </Box>
      }
    </Box>
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
      updateActiveRaveStream: update,
      updateActiveIndex: updateActive,
      updateLoading: updateLoading,
      updateProduct: updateProduct
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: SwipeStreamProps) => {
  // Retrieve the product stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        backPath: string = state.raveStream ? state.raveStream.backPath : '',
        loading: boolean = state.loading ? state.loading.loading : true,
        product: Product = state.raveStream ? state.raveStream.product : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined;
  
  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  return {
    ...ownProps,
    activeIndex,
    backPath,
    loading,
    product,
    raveStream,
    review
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadProductStream,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(SwipeStream)
));
