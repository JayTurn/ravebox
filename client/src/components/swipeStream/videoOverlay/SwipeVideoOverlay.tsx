/**
 * SwipeVideoOverlay.tsx
 * Video for the stream component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
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
import SwipeNavigation from '../navigation/SwipeNavigation';
import SwipeVideo from '../video/SwipeVideo';
import StreamUser from '../../raveStream/user/StreamUser';
import SwipeHelper from '../../elements/swipeHelper/SwipeHelper';

// Enumerators.
import { SwipeDirection } from '../../elements/swipeHelper/SwipeHelper.enum';
import {
  SwipeView,
  VideoPosition
} from '../SwipeStream.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useIsMounted } from '../../../utils/safety/useIsMounted.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import {
  SwipeVideoOverlayProps
} from './SwipeVideoOverlay.interface';
import { Review } from '../../review/Review.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      //border: `1px solid ${theme.palette.common.white}`,
      color: theme.palette.common.white
    },
    backButtonBottom: {
      bottom: 0
    },
    backButtonTop: {
      top: 0
    },
    backButtonWrapper: {
      left: 0,
      padding: theme.spacing(2.5, 1),
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
      zIndex: 2
    },
    brandText: {
      fontSize: '.8rem',
      fontWeight: 800
    },
    container: {
      height: '100%',
      //maxHeight: 'calc(100vh); max-height: -webkit-fill-available;',
      //minHeight: 'calc(100vh); min-height: -webkit-fill-available;',
      position: 'fixed',
      transition: `opacity 300ms ease-in-out`,
      width: 'calc(100vw)',
      zIndex: 5
    },
    contentContainer: {
      height: '100%',
      zIndex: 1
    },
    overlaySwiped: {
      backgroundColor: `rgba(0,0,0,0.8)`,
      transition: 'backgroundColor 300ms ease-in-out'
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
      color: `rgba(255,255,255,.8)`,
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
      alignSelf: 'flex-end',
      zIndex: 2
    }
  })
);

/**
 * Renders the controller which holds the videos in the stream.
 */
const SwipeVideoOverlay: React.FC<SwipeVideoOverlayProps> = (props: SwipeVideoOverlayProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Add the safety check to ensure the component is still mounted.
  const isMounted = useIsMounted();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const activeIndex: number = props.activeIndex || 0;

  const [unplayed, setUnplayed] = React.useState<boolean>(true);

  const [startX, setStartX] = React.useState<number>(0);
  const [startY, setStartY] = React.useState<number>(0);

  const [overlayTimeout, setOverlayTimeout] = React.useState<ReturnType<typeof setTimeout> | void | null>(null);

  /**
   * Handles mouse down handling.
   */
  const handleMouseDown: (
    e: React.MouseEvent
  ) => void = (
    e: React.MouseEvent
  ): void => {
    setStartX(e.clientX);
    setStartY(e.clientY);
  }

  /**
   * Handles mouse up handling.
   */
  const handleMouseUp: (
    e: React.MouseEvent
  ) => void = (
    e: React.MouseEvent
  ): void => {
    if (!isMounted.current) {
      return;
    }
    const xDiff: number = Math.abs(e.clientX - startX),
          yDiff: number = Math.abs(e.clientY - startY);

    if (xDiff < 5 && yDiff < 5) {
      if (props.playing) {
        props.play(false);
        props.showOverlay();
      } else {
        props.play(true);
        props.hideOverlay();
      }
    }
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
    if (props.playing) {
      props.play(false);
    } else {
      props.play(true);
    }
  }

  /**
   * Handles returning to the video.
   */
  const handleDisplayVideo: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    e.stopPropagation();
    props.center();
    props.showOverlay();
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
    if (!isMounted.current) {
      return;
    }

    props.play(false);

    switch (eventData.dir) {
      case 'Down':
        if (props.overlayState === SwipeView.VIDEO) {
          props.down();
          props.hideOverlay(true);
        } else {
          props.center();
          props.showOverlay();
        }
        break;
      case 'Left':
        props.next();
        break;
      case 'Right':
        props.previous();
        break;
      case 'Up':
        if (props.overlayState === SwipeView.VIDEO) {
          props.hideOverlay(true);
          props.up();
        } else {
          props.center();
          props.showOverlay();
        }
        break;
      default:
    }
  }

  /**
   * Handle the overlay state based on whether or not the video is playing.
   */
  React.useEffect(() => {
    if (!isMounted.current) {
      return;
    }

    if (unplayed) {
      setUnplayed(false);
      props.play(true);

      /*
      setOverlayTimeout(setTimeout(() => {
        if (isMounted.current) {
          setVisible(false);
        }
      }, 5000));
      */

    }

  }, [
    isMounted,
    props.playing,
    props.overlayState, 
    props.show,
    unplayed
  ]);

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
    >
      {props.overlayState !== SwipeView.VIDEO &&
        <Box className={clsx(
          classes.backButtonWrapper, {
            [classes.backButtonTop]: props.overlayState === SwipeView.PRODUCT,
            [classes.backButtonBottom]: props.overlayState === SwipeView.REVIEW,
          }
        )}>
          <Button
            className={clsx(classes.backButton)}
            color={'secondary'}
            onClick={handleDisplayVideo}
            variant='contained'
          >
            Back to Rave
          </Button>
        </Box>
      }
      {props.raveStream && props.raveStream.reviews.length > 0 &&
        <Grid
          className={clsx(
            classes.contentContainer, {
              [classes.overlaySwiped]: props.overlayState !== SwipeView.VIDEO
            }
          )}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          container
          alignItems='stretch'
          style={{opacity: props.show ? 1 : 0}}
        >
          <React.Fragment>
            <Grid item xs={12}>
              <SwipeNavigation
                streamType={props.raveStream.streamType}
                title={props.raveStream ? props.raveStream.title : ''}
                variant='white'
              />  
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
          </React.Fragment>
        </Grid>
      }
    </Box>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: SwipeVideoOverlayProps) => {
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
)(SwipeVideoOverlay);

