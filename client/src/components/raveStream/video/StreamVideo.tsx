/**
 * StreamVideo.tsx
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
import Player from 'react-player';
import Typography from '@material-ui/core/Typography';
import { TransitionGroup } from 'react-transition-group';
import * as React from 'react';

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
  StreamVideoProps
} from './StreamVideo.interface';
import { Review } from '../../review/Review.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: 'black',
      height: 'calc(100vh)',
      position: 'absolute',
      overflowY: 'auto',
      transition: 'left 300ms ease-in-out',
      width: 'calc(100vw)',
      zIndex: 3
    },
    defaultColor: {
      color: theme.palette.common.white
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600
    },
    videoContainer: {
      height: '100%'
    }
  })
);

/**
 * Returns a string or number based on the video positioning.
 *
 * @param { VideoPosition } videoPosition
 *
 * @return string
 */
const setVideoPosition: (
  videoPosition: VideoPosition
) => string = (
  videoPosition: VideoPosition
): string => {
  switch (videoPosition) {
    case VideoPosition.PREVIOUS:
      return 'calc(-100vw)';
    case VideoPosition.NEXT:
      return 'calc(100vw)';
    default:
      return '0px';
  }
};

/**
 * Renders the video in the stream.
 */
const StreamVideo: React.FC<StreamVideoProps> = (props: StreamVideoProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the player reference to be used for video controls.
  const playerRef = React.useRef<Player>(null);

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  // Define the player controls.
  const [config, setConfig] = React.useState({
    controls: false,
    file: {
      forceHLS: true
    },
    muted: true,
    playing: false,
    playsinline: true,
    url: props.review.videoURL,
    volume: 1,
    width: '100%'
  });

  /**
   * Handles the video completion event.
   */
  const handleComplete: (
  ) => void = (
  ): void => {
    console.log('Complete video');
  }

  /**
   * Handles the video playback.
   */
  const handlePlayback: (
  ) => void = (
  ): void => {
    setConfig({
      ...config,
      playing: !config.playing
    });
  }

  /**
   * Handles the progress of video.
   */
  const handleProgress: (
    state: VideoProgress 
  ) => void = (
    state: VideoProgress 
  ): void => {
    console.log(state);
  }

  /**
   * Handles the video when it is ready.
   */
  const handleReady: (
  ) => void = (
  ): void => {

    if (playerRef) {
      const current: Player | null = playerRef.current;

      if (current) {
        //const pl: any = current.getInternalPlayer();

        //pl.seekTo(props.review.startTime || 0, true);
      }
    }
  }

  /**
   * Handles the video when it is first played.
   */
  const handleStart: (
  ) => void = (
  ): void => {
    console.log('Start video');
  }

  return (
    <Box
      className={clsx(classes.container)}
      style={{left: `${setVideoPosition(props.positioning)}`}}
    >
      <Grid
        className={clsx(classes.videoContainer)}
        container
        alignItems='center'
      >
        <Grid item xs={12}>
          <Player
            {...config}
            progressInterval={5000}
            onReady={handleReady}
            onStart={handleStart}
            ref={playerRef}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default StreamVideo;
