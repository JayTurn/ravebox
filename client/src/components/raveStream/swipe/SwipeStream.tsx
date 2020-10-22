/**
 * SwipeStream.tsx
 * SwipeStream route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
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
import { Helmet } from 'react-helmet';
import * as React from 'react';
import { Route } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  update,
  updateActive
} from '../../../store/raveStream/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';
import StreamProductDetails from '../productDetails/StreamProductDetails';
import StreamReviewDetails from '../reviewDetails/StreamReviewDetails';
import StreamVideoController from '../videoController/StreamVideoController';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import { SwipeView } from './SwipeStream.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import {
  useRetrieveRaveStreamByURL 
} from '../useRetrieveRaveStreamByURL.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import {
  SwipeStreamProps
} from './SwipeStream.interface';
import {
  RaveStream,
  RaveStreamResponse,
  RaveStreamURLParams
} from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

// Utilities.
import {
  buildRaveStreamPath
} from '../RaveStream.common';

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
    testContainer: {
      left: 0,
      position: 'absolute',
      top: '30%',
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

  if (params.firstPath) {
    path += `/${params.firstPath}`;
  }

  if (params.secondPath) {
    path += `/${params.secondPath}`;
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
    raveStream,
    product,
    raveStreamStatus
  } = useRetrieveRaveStreamByURL({
    existing: props.raveStream ? props.raveStream : undefined,
    setActiveRaveStream: props.updateActiveRaveStream,
    setActiveRave: props.updateActiveIndex,
    requested: props.match.params
  })

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [swipeView, setSwipeView] = React.useState<SwipeView>(SwipeView.VIDEO);

  const activeIndex: number = props.activeIndex || 0;

  const [ravePath, setRavePath] = React.useState<string>('');

  /**
   * Track the stream view.
   */
  React.useEffect(() => {

    if (props.review && props.review.url !== ravePath) {
      const path: string = formatURL(props.match.params)(props.review.url);
      setRavePath(props.review.url);
      props.history.push(path);
    }

    // Track the category list page view.
    if (!pageViewed && product._id) {

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
  }, [pageViewed, product, props.match.params, props.review, ravePath]);

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
    setSwipeView(view);
  }

  return (
    <Box className={clsx(classes.container)}>
      {props.raveStream && props.raveStream.reviews && props.raveStream.reviews.length > 0 &&
        <StreamVideoController
          showing={swipeView}
          displayChange={handleDisplayChange}
        />
      }
      <Box className={clsx(classes.detailsContainer)} style={{zIndex: swipeView === SwipeView.PRODUCT ? 2 : 1}}>
        <StreamProductDetails product={{...product}} />
      </Box>
      {props.raveStream && props.raveStream.reviews && props.raveStream.reviews.length > 0 &&
        <Box className={clsx(classes.detailsContainer)} style={{zIndex: swipeView === SwipeView.REVIEW ? 2 : 1}}>
          <Route path={`${props.match.path}/${props.raveStream.reviews[activeIndex].url}`}>
            <StreamReviewDetails review={{...props.raveStream.reviews[activeIndex]}} />
          </Route>
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
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: SwipeStreamProps) => {
  // Retrieve the product stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined;
  
  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  return {
    ...ownProps,
    activeIndex,
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