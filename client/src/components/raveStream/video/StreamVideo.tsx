/**
 * StreamVideo.tsx
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
import Player from 'react-player';
import Typography from '@material-ui/core/Typography';
import { TransitionGroup } from 'react-transition-group';
import * as React from 'react';

// Actions.
import {
  update
} from '../../../store/video/Actions';

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
      transition: 'transform 300ms ease-in-out',
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
      height: '100%',
      padding: theme.spacing(0, 1)
    },
    videoBox: {
      borderRadius: 10,
      height: 0,
      overflow: 'hidden',
      paddingTop: '56.25%',
      position: 'relative'
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
      return 'translate3d(calc(-100vw), 0, 0)';
    case VideoPosition.NEXT:
      return 'translate3d(calc(100vw), 0, 0)';
    default:
      return 'translate3d(0, 0, 0)';
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
    height: '100%',
    muted: props.muted ? true : false,
    playing: props.active && props.playing,
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
    if (props.update && props.videoProgress && props.active) {
      props.update({
        ...props.videoProgress,
        _id: props.review._id,
        loaded: state.loaded,
        loadedSeconds: state.loadedSeconds,
        played: state.played,
        playedSeconds: state.playedSeconds
      });
    }
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
        const pl: any = current.getInternalPlayer();

        if (pl && pl.seekTo) {
          pl.seekTo(props.review.startTime || 0, true);
        }

        if (props.active && props.update) {
          // Reset the video progress.
          props.update({
            _id: props.review._id,
            loaded: 0,
            loadedSeconds: 0,
            played: 0,
            playedSeconds: 0,
            videoDuration: current.getDuration()
          });
        }
      }
    }
  }

  /**
   * Handles the video when it is first played.
   */
  const handleStart: (
  ) => void = (
  ): void => {
  }

  /**
   * Update the playing state.
   */
  React.useEffect(() => {
    if (props.playing !== config.playing) {
      setConfig({
        ...config,
        playing: props.playing
      });
    }
    if (props.muted !== config.muted) {
      setConfig({
        ...config,
        muted: props.muted ? true : false
      });
    }
  }, [config, props.muted, props.playing]);

  return (
    <Box
      className={clsx(classes.container)}
      style={{transform: `${setVideoPosition(props.positioning)}`}}
    >
      <Grid
        className={clsx(classes.videoContainer)}
        container
        alignItems='center'
      >
        <Grid item xs={12}>
          <Box className={clsx(classes.videoBox)}>
            <Player
              {...config}
              progressInterval={5000}
              onProgress={handleProgress}
              onReady={handleReady}
              onStart={handleStart}
              ref={playerRef}
              style={{position: 'absolute', top: 0, left: 0, height: 'auto !important'}}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
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
      update: update,
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: StreamVideoProps) => {
  // Retrieve the video progress from the redux store.
  const videoProgress: VideoProgress = state.video ? state.video.progress : undefined,
        muted: boolean = state.video ? state.video.muted : true;

  return {
    ...ownProps,
    muted,
    videoProgress
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StreamVideo);
