/**
 * StreamVideoController.tsx
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
  updateActive
} from '../../../store/raveStream/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';
import StreamVideo from '../video/StreamVideo';
import StreamVideoOverlay from '../videoOverlay/StreamVideoOverlay';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';
import {
  SwipeView,
  VideoPosition
} from '../swipe/SwipeStream.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  StreamVideoControllerProps
} from './StreamVideoController.interface';
import { RaveStream } from '../RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: 'black',
      height: '100%',
      left: 0,
      //maxHeight: 'calc(100vh); max-height: -webkit-fill-available;',
      //minHeight: 'calc(100vh); min-height: -webkit-fill-available;',
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
      //maxHeight: 'calc(100vh); max-height: -webkit-fill-available;',
      //minHeight: 'calc(100vh); min-height: -webkit-fill-available;',
      position: 'fixed'
    },
    shifted: {
      borderRadius: 10
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
      return 'translate3d(0, 93%, 0)';
    case SwipeView.REVIEW:
      return 'translate3d(0, -93%, 0)';
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
const StreamVideoController: React.FC<StreamVideoControllerProps> = (props: StreamVideoControllerProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [showOverlay, setShowOverlay] = React.useState<boolean>(true);

  const [playing, setPlaying] = React.useState<boolean>(false);

  const activeIndex: number = props.activeIndex || 0;

  /**
   * Handles moving to the next video.
   */
  const handleNext: (
  ) => void = (
  ): void => {
    if (props.updateActiveIndex) {
      props.updateActiveIndex(activeIndex + 1);
      setPlaying(true);
    }
  }

  const handlePrevious: (
  ) => void = (
  ): void => {
    if (props.updateActiveIndex) {
      props.updateActiveIndex(activeIndex - 1);
      setPlaying(true);
    }
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
          <StreamVideoOverlay
            down={handleShowProduct}
            next={handleNext}
            overlayState={props.showing}
            play={handlePlayPause}
            playing={playing}
            previous={handlePrevious}
            show={showOverlay}
            up={handleShowReview}
            center={handleShowVideo}
          />
          {props.raveStream.reviews.length > 0 &&
            <React.Fragment>
              {props.raveStream.reviews.map((review: Review, index: number) => (
                <React.Fragment key={review._id}>
                  {index > activeIndex - 2 && index < activeIndex + 2 &&
                    <StreamVideo
                      active={index === activeIndex}
                      playing={index === activeIndex ? playing : false}
                      positioning={setVideoPosition(activeIndex)(index)}
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
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: StreamVideoControllerProps) => {
  // Retrieve the product stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  return {
    ...ownProps,
    activeIndex,
    raveStream
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StreamVideoController);
