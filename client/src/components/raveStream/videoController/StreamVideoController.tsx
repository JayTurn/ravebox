/**
 * StreamVideoController.tsx
 * Video for the stream component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
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
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: 'black',
      height: 'calc(100vh)',
      left: 0,
      position: 'absolute',
      overflow: 'hidden',
      transition: 'top 300ms ease-in-out',
      zIndex: 3
    },
    defaultColor: {
      color: theme.palette.common.white
    },
    item: {
      height: 'calc(100vh)',
      position: 'relative'
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
      return 'calc(100vh - 50px)';
    case SwipeView.REVIEW:
      return 'calc(-100vh)';
    default:
      return '0px';
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

  const [activeIndex, setActiveIndex] = React.useState<number>(
    props.startingIndex);

  const [showOverlay, setShowOverlay] = React.useState<boolean>(true);

  /**
   * Handles moving to the next video.
   */
  const handleNext: (
  ) => void = (
  ): void => {
    setActiveIndex(activeIndex + 1);
  }

  const handlePrevious: (
  ) => void = (
  ): void => {
    setActiveIndex(activeIndex - 1);
  }

  return (
    <Grid
      className={clsx(classes.container)}
      container
      style={{top: `${setSwipePosition(props.showing)}`}}
    >
      <Grid item xs={12} className={clsx(classes.item)}>
        <StreamVideoOverlay
          next={handleNext}
          previous={handlePrevious}
          review={props.reviews[activeIndex]}
          show={showOverlay}
        />
        {props.reviews.length > 0 &&
          <React.Fragment>
            {props.reviews.map((review: Review, index: number) => (
              <React.Fragment>
                {index > activeIndex - 2 && index < activeIndex + 2 &&
                  <StreamVideo
                    positioning={setVideoPosition(activeIndex)(index)}
                    review={{...review}}
                  />
                }
              </React.Fragment>
            ))}
          </React.Fragment>
        }
      </Grid>
    </Grid>
  );
}

export default StreamVideoController;
