/**
 * StreamVideoOverlay.tsx
 * Video for the stream component.
 */

// Modules.
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
import * as React from 'react';
import {
  EventData,
  SwipeableHandlers,
  SwipeableOptions,
  useSwipeable
} from 'react-swipeable'

// Components.
import StyledButton from '../../elements/buttons/StyledButton';
import StreamNavigation from '../navigation/StreamNavigation';
import StreamVideo from '../video/StreamVideo';
import StreamUser from '../user/StreamUser';

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
import { RaveStream } from '../RaveStream.interface';
import {
  StreamVideoOverlayProps
} from './StreamVideoOverlay.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    brandText: {
      fontSize: '.75rem',
      fontWeight: 800
    },
    container: {
      backgroundColor: `rgba(0,0,0,0.25)`,
      height: 'calc(100vh)',
      position: 'absolute',
      width: 'calc(100vw)',
      zIndex: 5
    },
    contentContainer: {
      height: '100%'
    },
    productTitle: {
      color: theme.palette.common.white,
      fontSize: '1.2rem',
      fontWeight: 600
    },
    productTitleContainer: {
      padding: theme.spacing(1)
    }
  })
);

/**
 * Renders the controller which holds the videos in the stream.
 */
const StreamVideoOverlay: React.FC<StreamVideoOverlayProps> = (props: StreamVideoOverlayProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const activeIndex: number = props.activeIndex || 0;

  /**
   * Handles moving to the next video.
   */
  const handleNext: (
    eventData: EventData
  ) => void = (
    eventData: EventData
  ): void => {
    console.log('Handle next hit');
  }

  const swipeableHandlers: SwipeableHandlers = useSwipeable({
    delta: 10,
    onSwipedDown: props.down,
    onSwipedLeft: props.next,
    onSwipedRight: props.previous,
    onSwipedUp: props.up,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <Box
      className={clsx(classes.container)}
      {...swipeableHandlers}
    >
      {props.raveStream && props.raveStream.reviews.length > 0 &&
        <Grid
          className={clsx(classes.contentContainer)}
          container
          alignItems='stretch'
        >
          <Grid item xs={12}>
            {props.raveStream &&
              <StreamNavigation title={props.raveStream.title} />  
            }
            <Grid container>
              <Grid item className={clsx(classes.productTitleContainer)}>
                {props.review && props.review.product &&
                  <Typography className={clsx(classes.productTitle)}variant='h1'>
                    <Box className={clsx(classes.brandText)}>
                      {props.review.product.brand.name}
                    </Box>
                    {props.review.product.name}
                  </Typography>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            Mid section  
          </Grid>
          <Grid item xs={12}>
            <StreamUser />
          </Grid>
        </Grid>
      }
    </Box>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: StreamVideoOverlayProps) => {
  // Retrieve the current stream from the active properties.
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

export default connect(
  mapStateToProps,
)(StreamVideoOverlay);

