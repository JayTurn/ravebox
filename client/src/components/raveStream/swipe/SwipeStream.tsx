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
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import { frontloadConnect } from 'react-frontload';
import { connect } from 'react-redux';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/raveStream/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';
import StreamProductDetails from '../productDetails/StreamProductDetails';
import StreamReviewDetails from '../reviewDetails/StreamReviewDetails';
import StreamVideoWrapper from '../videoController/StreamVideoController';

// Enumerators.
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
      height: 'calc(100vh)',
      position: 'relative',
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
    activeIndex,
    raveStream,
    product,
    raveStreamStatus
  } = useRetrieveRaveStreamByURL({
    existing: props.raveStream ? props.raveStream : undefined,
    setActiveRaveStream: props.updateActiveRaveStream,
    requested: props.match.params
  })

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [swipeView, setSwipeView] = React.useState<SwipeView>(SwipeView.VIDEO);

  /**
   * Track the stream view.
   */
  React.useEffect(() => {

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
  }, [pageViewed, product]);

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
      <Box className={clsx(classes.testContainer)}>
        <Box>
          <StyledButton
            title='Show product'
            clickAction={() => handleDisplayChange(SwipeView.PRODUCT)}
            variant='outlined'
          />
        </Box>
        <Box>
          <StyledButton
            title='Show Video'
            clickAction={() => handleDisplayChange(SwipeView.VIDEO)}
            variant='outlined'
          />
        </Box>
        <Box>
          <StyledButton
            title='Show review'
            clickAction={() => handleDisplayChange(SwipeView.REVIEW)}
            variant='outlined'
          />
        </Box>
      </Box>
      {props.raveStream && props.raveStream.reviews && props.raveStream.reviews.length > 0 &&
        <StreamVideoWrapper
          startingIndex={activeIndex}
          reviews={[...props.raveStream.reviews]}
          showing={swipeView}
        />
      }
      <Box className={clsx(classes.detailsContainer)} style={{zIndex: swipeView === SwipeView.PRODUCT ? 2 : 1}}>
        <StreamProductDetails product={{...product}} />
      </Box>
      {props.raveStream && props.raveStream.reviews && props.raveStream.reviews.length > 0 &&
        <Box className={clsx(classes.detailsContainer)} style={{zIndex: swipeView === SwipeView.REVIEW ? 2 : 1}}>
          <StreamReviewDetails review={{...props.raveStream.reviews[activeIndex]}} />
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
      updateActiveRaveStream: updateActive,
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: SwipeStreamProps) => {
  // Retrieve the product stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.active : undefined;

  return {
    ...ownProps,
    raveStream
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
