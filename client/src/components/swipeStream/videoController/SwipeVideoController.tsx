/**
 * SwipeVideoController.tsx
 * Video for the stream component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
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
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { TransitionGroup } from 'react-transition-group';
import * as React from 'react';

// Actions.
import {
  updateActive,
  updateProduct
} from '../../../store/raveStream/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';
import SwipeVideo from '../video/SwipeVideo';
import SwipeVideoOverlay from '../videoOverlay/SwipeVideoOverlay';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';
import {
  SwipeView,
  VideoPosition
} from '../SwipeStream.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useIsMounted } from '../../../utils/safety/useIsMounted.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';
import {
  SwipeVideoControllerProps
} from './SwipeVideoController.interface';

// Utilities.
import { emptyProduct } from '../../product/Product.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: '#1D1D1D',
      boxShadow: `0 0 25px 0 rgba(0,0,0,1)`,
      height: '100%',
      left: 0,
      position: 'fixed',
      overflow: 'hidden',
      transition: 'transform 300ms ease-in-out',
      zIndex: 3
    },
    defaultColor: {
      color: theme.palette.common.white
    },
    item: {
      height: '100%',
      position: 'fixed'
    },
    shifted: {
      borderRadius: 20
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600
    },
    testContainer: {
      left: 0,
      position: 'absolute',
      bottom: '10%',
      zIndex: 5
    }
  })
);

/**
 * Returns a string or number based on the swipe view.
 *
 * @param { SwipeView } showing
 *
 * @return string
 */
const setSwipePosition: (
  showing: SwipeView
) => string = (
  showing: SwipeView
): string => {
  switch (showing) {
    case SwipeView.PRODUCT:
      return 'translate3d(0, calc(100% - 80px), 0)';
    case SwipeView.REVIEW:
      return 'translate3d(0, calc(-100% + 80px), 0)';
    default:
      return 'translate3d(0, 0, 0)';
  }
};

/**
 * Handles changing the position of the rave video based on the active index.
 *
 * @param { number } activeIndex - the active index.
 * @param { number } index - the index of this item.
 *
 * @return VideoPosition
 */
const setVideoPosition: (
  activeIndex: number
) => (
  index: number
) => VideoPosition = (
  activeIndex: number
) => (
  index: number
): VideoPosition => {
  if (index < activeIndex) {
    return VideoPosition.PREVIOUS;
  }
  if (index > activeIndex) {
    return VideoPosition.NEXT;
  }

  return VideoPosition.SHOWING
}

/**
 * Renders the controller which holds the videos in the stream.
 */
const SwipeVideoController: React.FC<SwipeVideoControllerProps> = (props: SwipeVideoControllerProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [showOverlay, setShowOverlay] = React.useState<boolean>(true);

  const [playing, setPlaying] = React.useState<boolean>(false);

  const [overlayTimeout, setOverlayTimeout] = React.useState<ReturnType<typeof setTimeout> | void | null>(null);

  /**
   * Handles moving to the next video.
   */
  const handleNext: (
  ) => void = (
  ): void => {
    if (props.updateActiveIndex && props.updateProduct && typeof props.activeIndex === 'number') {
      if (props.raveStream && props.raveStream.reviews.length > 0) {
        if ((props.activeIndex + 1) < props.raveStream.reviews.length) {
          props.updateProduct(
            props.raveStream.reviews[props.activeIndex + 1].product || emptyProduct()
          );
          props.updateActiveIndex(props.activeIndex + 1);
          setShowOverlay(false);
          handleOverlayDisplay();
        }
      }
    }
  }

  const handlePrevious: (
  ) => void = (
  ): void => {
    if (props.updateActiveIndex && props.updateProduct && typeof props.activeIndex === 'number') {
      if (props.raveStream && props.raveStream.reviews.length > 0) {
        if ((props.activeIndex - 1) >= 0) {
          props.updateProduct(
            props.raveStream.reviews[props.activeIndex - 1].product || emptyProduct()
          );
          props.updateActiveIndex(props.activeIndex - 1);
          setShowOverlay(false);
          handleOverlayDisplay();
        }
      }
    }
  }

  const handleShowOverlay: (
  ) => void = (
  ): void => {
    if (overlayTimeout) {
      setOverlayTimeout(() => {
        if (isMounted.current) {
          clearTimeout(overlayTimeout);
        }
      });
    }
    setShowOverlay(true);
  }

  const handleHideOverlay: (
  ) => void = (
  ): void => {
    if (!isMounted.current) {
      return;
    }

    if (overlayTimeout) {
      setOverlayTimeout(() => {
        if (isMounted.current) {
          clearTimeout(overlayTimeout);
        }
      });
    }

    setOverlayTimeout(setTimeout(() => {
      if (isMounted.current) {
        setShowOverlay(false);
      }

      if (overlayTimeout) {
        setOverlayTimeout(clearTimeout(overlayTimeout));
      }
    }, 3000));
  }

  const handleOverlayDisplay: (
  ) => void = (
  ): void => {
    if (!isMounted.current) {
      return;
    }

    setTimeout(() => {
      if (!isMounted.current) {
        return;
      }
      handleShowOverlay();
      handleHideOverlay();
    }, 300);
  }

  const handleShowProduct: (
  ) => void = (
  ): void => {
    props.displayChange(SwipeView.PRODUCT);
  }

  const handleShowReview: (
  ) => void = (
  ): void => {
    props.displayChange(SwipeView.REVIEW);
  }

  const handleShowVideo: (
  ) => void = (
  ): void => {
    props.displayChange(SwipeView.VIDEO);
  }

  /**
   * Handles playing and pausing video.
   */
  const handlePlayPause: (
    playState: boolean
  ) => void = (
    playState: boolean
  ): void => {
    setPlaying(playState);
  }

  return (
    <Grid
      className={clsx(
        classes.container, {
          [classes.shifted]: props.showing !== SwipeView.VIDEO
        }
      )}
      container
      style={{transform: `${setSwipePosition(props.showing)}`}}
    >
      {props.raveStream &&
        <Grid item xs={12} className={clsx(classes.item)}>
          <SwipeVideoOverlay
            down={handleShowProduct}
            hideOverlay={handleHideOverlay}
            next={handleNext}
            overlayState={props.showing}
            play={handlePlayPause}
            playing={playing}
            previous={handlePrevious}
            show={showOverlay}
            showOverlay={handleShowOverlay}
            up={handleShowReview}
            center={handleShowVideo}
          />
          {props.raveStream.reviews.length > 0 &&
            <React.Fragment>
              {props.raveStream.reviews.map((review: Review, index: number) => (
                <React.Fragment key={review._id}>
                  {typeof props.activeIndex === 'number' && index > props.activeIndex - 2 && index < props.activeIndex + 2 &&
                    <SwipeVideo
                      active={index === props.activeIndex}
                      activeIndex={props.activeIndex}
                      index={index}
                      nextVideo={handleNext}
                      playing={index === props.activeIndex ? playing : false}
                      positioning={setVideoPosition(props.activeIndex)(index)}
                      review={review}
                    />
                  }
                </React.Fragment>
              ))}
            </React.Fragment>
          }
        </Grid>
      }
    </Grid>
  );
}

/**
 * Map dispatch actions to properties on the stream.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateActiveIndex: updateActive,
      updateProduct: updateProduct
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: SwipeVideoControllerProps) => {
  // Retrieve the product stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0,
        product: Product = state.raveStream ? state.raveStream.product : undefined;

  return {
    ...ownProps,
    activeIndex,
    product,
    raveStream
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SwipeVideoController);
