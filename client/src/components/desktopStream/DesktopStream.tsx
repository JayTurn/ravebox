/**
 * DesktopStream.tsx
 * DesktopStream route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
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
import DesktopRaveActions from './raveActions/DesktopRaveActions';
import DesktopSideStream from './side/DesktopSideStream';
import DesktopStreamTabs from './tabs/DesktopStreamTabs';
import DesktopVideoController from './videoController/DesktopVideoController';
import LoadingDesktopSide from '../placeholders/loadingDesktopSide/LoadingDesktopSide';
import LoadingDesktopTabs from '../placeholders/loadingDesktopTabs/LoadingDesktopTabs';
import LoadingDesktopVideo from '../placeholders/loadingDesktopVideo/LoadingDesktopVideo';
import LoadingProductTitle from '../placeholders/loadingProductTitle/LoadingProductTitle';
import StyledButton from '../elements/buttons/StyledButton';

// Enumerators.
import { LogoColor } from '../logo/Logo.enum';
import { RaveStreamType } from '../raveStream/RaveStream.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';
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
  DesktopStreamProps
} from './DesktopStream.interface';

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
    },
    titleContainer: {
      padding: theme.spacing(0, 2)
    },
    videoContainer: {
      borderRadius: 20,
      margin: theme.spacing(2, 0, 0, 2),
      overflow: 'hidden'
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
 * @param { DesktopStreamProps } props - the swipe stream properties.
 */
const frontloadProductStream = async (props: DesktopStreamProps) => {

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
const DesktopStream: React.FC<DesktopStreamProps> = (props: DesktopStreamProps) => {
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
    ignoreRavePath: false,
    setActiveRaveStream: props.updateActiveRaveStream,
    setActiveRave: props.updateActiveIndex,
    setActiveProduct: props.updateProduct,
    requested: props.match.params
  })

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const isMounted = useIsMounted();

  /**
   * Track the stream view.
   */
  React.useEffect(() => {

    if (props.review && props.review.url) {
      // We are always looking for the last path as it is always unique to the
      // rave. We check the newly requested url against the current rave url
      // to determine if we should load a new rave.
      if (props.match.params.fourthPath) {
        // If the fourth path doesn't match the review url, we need to
        // load the new one.
        if (props.review.url !== props.match.params.fourthPath) {
          // Updates the active index 
          loadRave(props.match.params.fourthPath)(props.match.params);
        }
        return;
      }

      // Check the third path when we don't have a third path.
      if (props.match.params.thirdPath) {
        // If the current rave path doesn't match the review url, we need to
        // load the new one.
        if (props.review.url !== props.match.params.thirdPath) {
          // Updates the active index 
          loadRave(props.match.params.thirdPath);
        }

        return;
      }
    }


    /*
    if (props.review && props.review.url && props.review.url !== ravePath) {
      loadRave(ravePath);
      const path: string = formatURL(props.match.params)(props.review.url);
      setRavePath(props.review.url);
      props.history.push(path);
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
    raveStreamStatus
  ]);

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={8}>
       <Grid container>
        <Grid item xs={12} className={clsx(classes.videoContainer)}>
          {raveStreamStatus === ViewState.WAITING ? (
            <LoadingDesktopVideo />
          ) : (
            <DesktopVideoController />
          )}
        </Grid>
        <Grid item xs={12} className={clsx(classes.titleContainer)}>
          {raveStreamStatus === ViewState.WAITING ? (
            <LoadingProductTitle />
          ) : (
            <DesktopRaveActions />
          )}
        </Grid>
        {props.product &&
          <Grid item xs={12}>
            {raveStreamStatus === ViewState.WAITING ? (
              <LoadingDesktopTabs />
            ) : (
              <DesktopStreamTabs product={props.product}/>
            )}
          </Grid>
        }
       </Grid>
      </Grid>
      <Grid item xs={4}>
        {props.product &&
          <React.Fragment>
            {raveStreamStatus === ViewState.WAITING ? (
              <LoadingDesktopSide />
            ) : (
              <DesktopSideStream product={props.product}/>
            )}
          </React.Fragment>
        }
      </Grid>
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
const mapStateToProps = (state: any, ownProps: DesktopStreamProps) => {
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
  })(DesktopStream)
));
