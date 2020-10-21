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
import IconButton from '@material-ui/core/IconButton';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
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
import StreamRate from '../rate/StreamRate';
import StreamVideo from '../video/StreamVideo';
import StreamUser from '../user/StreamUser';
import SwipeHelper from '../../elements/swipeHelper/SwipeHelper';

// Enumerators.
import { SwipeDirection } from '../../elements/swipeHelper/SwipeHelper.enum';
import {
  SwipeView,
  VideoPosition
} from '../swipe/SwipeStream.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

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
      fontSize: '.8rem',
      fontWeight: 800
    },
    container: {
      height: 'calc(100vh)',
      position: 'absolute',
      transition: `opacity 300ms ease-in-out`,
      width: 'calc(100vw)',
      zIndex: 5
    },
    contentContainer: {
      height: '100%'
    },
    playButtonContainer: {
      height: '100%'
    },
    playButton: {
      backgroundColor: `rgba(255,255,255, .1)`,
      color: `rgba(255,255,255,0.6)`,
      padding: theme.spacing(1)
    },
    playIcon: {
      height: 60,
      width: 60
    },
    productTitle: {
      color: theme.palette.common.white,
      fontSize: '1.3rem',
      fontWeight: 700,
      paddingBottom: 0,
      marginBottom: 0,
      textShadow: `1px 1px 1px rgba(0,0,0,0.5)`
    },
    productTitleContainer: {
      padding: theme.spacing(1, 2, .5),
      marginTop: theme.spacing(1),
      textAlign: 'center'
    },
    swipeContainer: {
      padding: theme.spacing(0, 2, 0)
    },
    userContainer: {
      alignSelf: 'flex-end'
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

  const [visible, setVisible] = React.useState<boolean>(props.show);

  /**
   * Handles clicking the overlay to play and pause video.
   */
  const handleClick: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    setVisible(!visible);
  }

  /**
   * Handles clicking the overlay to play and pause video.
   */
  const handlePlay: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    e.stopPropagation();
    if (!props.playing) {
      props.play(true);
      setVisible(false);
    } else {
      props.play(false);
    }
  }

  /**
   * Handles swipe events.
   *
   * @param { EventData } eventData - the swipe event data.
   */
  const handleSwipe: (
    eventData: EventData
  ) => void = (
    eventData: EventData
  ): void => {

    props.play(false);
    setVisible(false);

    switch (eventData.dir) {
      case 'Down':
        props.down();
        break;
      case 'Left':
        props.next();
        break;
      case 'Right':
        props.previous();
        break;
      case 'Up':
        props.up();
        break;
      default:
    }
  }

  const swipeableHandlers: SwipeableHandlers = useSwipeable({
    delta: 10,
    onSwiped: handleSwipe,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <Box
      {...swipeableHandlers}
      className={clsx(classes.container)}
      onClick={handleClick}
      style={{opacity: visible ? 1 : 0}}
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
            <Grid container alignItems='center' justify='space-between'>
              <Grid item className={clsx(classes.productTitleContainer)} xs={12}>
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
            <Grid container justify='flex-start'>
              <Grid item className={clsx(classes.swipeContainer)} xs={12}>
                <SwipeHelper
                  direction={SwipeDirection.DOWN}
                  title='Swipe down'
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid
              alignItems='center'
              className={clsx(classes.playButtonContainer)}
              container 
              justify='center'
            >
              <Grid item>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={clsx(classes.userContainer)}>
            <Grid container>
              <Grid item className={clsx(classes.swipeContainer)} xs={12}>
                <SwipeHelper
                  direction={SwipeDirection.UP}
                  title='Swipe up'
                />
              </Grid>
            </Grid>
            <StreamUser play={handlePlay} playing={props.playing}/>
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

