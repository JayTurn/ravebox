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
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { Route } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
import StyledButton from '../elements/buttons/StyledButton';
import StreamProductDetails from '../raveStream/productDetails/StreamProductDetails';
import StreamReviewDetails from '../raveStream/reviewDetails/StreamReviewDetails';
import SwipeVideoController from './videoController/SwipeVideoController';
import LoadingRavebox from '../placeholders/loadingRavebox/LoadingRavebox';

// Enumerators.
import { LogoColor } from '../logo/Logo.enum';
import { RaveStreamType } from '../raveStream/RaveStream.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';
import { SwipeView } from './SwipeStream.enum';
import { ViewState } from '../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../analytics/Analytics.provider';
import {
  useRetrieveRaveStreamByURL 
} from '../raveStream/useRetrieveRaveStreamByURL.hook';
import { useIsMounted } from '../../utils/safety/useIsMounted.hook';

// Interfaces.
import { AnalyticsContextProps } from '../analytics/Analytics.interface';
import { Product } from '../product/Product.interface';
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
  buildRaveStreamPath
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
 * Formats the url.
 */
const formatURL: (
  params: RaveStreamURLParams
) => (
  ravePath: string
) => string = (
  params: RaveStreamURLParams
) => (
  ravePath: string
): string => {
  let path: string = `/stream/${params.streamType}`;

  switch (params.streamType) {
    case RaveStreamType.COLLECTON:
      if (params.firstPath) {
        path += `/${params.firstPath}`;
      }
      if (params.secondPath) {
        path += `/${params.secondPath}`;
      }
      if (params.thirdPath) {
        path += `/${params.thirdPath}`;
      }
      break;
    case RaveStreamType.PRODUCT:
      if (params.firstPath) {
        path += `/${params.firstPath}`;
      }

      if (params.secondPath) {
        path += `/${params.secondPath}`;
      }
      break;
    case RaveStreamType.PRODUCT_TYPE:
      if (params.firstPath) {
        path += `/${params.firstPath}`;
      }
      break;
    default:
  }

  if (ravePath) {
    path += `/${ravePath}`;
  }

  return path;
}

/**
 * Loads the rave stream from the api before rendering.
 * 
 * @param { SwipeStreamProps } props - the swipe stream properties.
 */
const frontloadProductStream = async (props: SwipeStreamProps) => {

  /*
  // Format the api request path.
  const params: RaveStreamURLParams = {...props.match.params};

  // Set the path to be requested via the api and append the review title
  // if it has been provided in the URL.
  let path: string = buildRaveStreamPath(params);

  await API.requestAPI<RaveStreamResponse>(`stream/${path}`, {
    method: RequestType.GET
  })
  .then((response: RaveStreamResponse) => {
    if (props.updateActiveRaveStream) {
      props.updateActiveRaveStream({...response.raveStream});
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
  */

};

/**
 * Route to retrieve a rave stream and present the swipeable components.
 */
const SwipeStream: React.FC<SwipeStreamProps> = (props: SwipeStreamProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    loadRave,
    raveStream,
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

  const isMounted = useIsMounted();

  const [upperOverlay, setUpperOverlay] = React.useState<SwipeView>(SwipeView.PRODUCT);


  /**
   * Track the stream view.
   */
  React.useEffect(() => {

    if (props.review && props.review.url && ravePath !== props.location.pathname) {
      // Get the new path and update it in the browser.
      let path: string = `/stream/${props.match.params.streamType}/${props.match.params.firstPath}`;

      if (props.match.params.secondPath) {
        path += `/${props.match.params.secondPath}`;
      }

      let reviewUrl: string = '';

      if (props.match.params.thirdPath) {
        reviewUrl = props.match.params.thirdPath;
      }
      if (props.match.params.fourthPath) {
        reviewUrl = props.match.params.fourthPath;
        path += `/${props.match.params.thirdPath}`;
      }

      loadRave(reviewUrl)(props.match.params);
      handleDisplayChange(SwipeView.VIDEO);
      setRavePath(props.location.pathname);

      props.history.push(path);
    }

    /*
    if (props.review && props.review.url) {
      // We are always looking for the last path as it is always unique to the
      // rave. We check the newly requested url against the current rave url
      // to determine if we should load a new rave.
      if (props.match.params.fourthPath) {
        // If the fourth path doesn't match the review url, we need to
        // load the new one.
        if (props.review.url !== ravePath) {
          // Updates the active index 
          loadRave(props.review.url)(props.activeIndex);
          handleDisplayChange(SwipeView.VIDEO);
          setRavePath(props.match.params.fourthPath);
        }
        return;
      }

      // Check the third path when we don't have a third path.
      if (props.match.params.thirdPath) {
        // If the current rave path doesn't match the review url, we need to
        // load the new one.
        if (props.review.url !== ravePath) {
          // Updates the active index 
          loadRave(props.review.url)(props.activeIndex);
          handleDisplayChange(SwipeView.VIDEO);
          setRavePath(props.match.params.thirdPath);
        }

        return;
      }
    }
    */

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
      <LoadingRavebox title={`Loading stream`} />
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
