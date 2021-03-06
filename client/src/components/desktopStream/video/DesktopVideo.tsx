/**
 * DesktopVideo.tsx
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

// Components.
import PlaybackIcon from '../../elements/playbackIcon/PlaybackIcon';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { Review } from '../../review/Review.interface';
import {
  DesktopVideoProps
} from './DesktopVideo.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

// Utilities.
import { calculateVideoRatio } from '../../raveStream/RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: 0,
      paddingTop: '56.25%',
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    },
    inside: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%'
    },
    defaultColor: {
      color: theme.palette.common.white
    },
    externalVideo: {
      left: -15,
      top: -10
    },
    overlay: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 3
    },
    subtitle: {
      fontSize: '1rem',
      fontWeight: 600
    },
    thumbnailContainer: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      height: '100%',
      left: 0,
      overflow: 'hidden',
      position: 'absolute',
      transition: 'opacity 200ms ease-in-out',
      top: 0,
      width: '100%',
      zIndex: 2
    },
    videoContainer: {
      height: '100%',
      padding: theme.spacing(0, 1)
    },
    videoBox: {
      height: '100%',
      left: 0,
      overflow: 'hidden',
      //paddingTop: '56.25%',
      position: 'absolute',
      top: 0,
      width: '100%'
    }
  })
);

/**
 * Renders the video in the stream.
 */
const DesktopVideo: React.FC<DesktopVideoProps> = (props: DesktopVideoProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the player reference to be used for video controls.
  const playerRef = React.useRef<Player>(null);

  const videoRatio: number = calculateVideoRatio(
    props.review.videoWidth)(props.review.videoHeight);

  //const height: string = videoRatio !== 0
    //? `calc(100vw / ${videoRatio})`
    //: `calc(100vw * .5625)`; 

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  // Define a first load property to show the thumbnail.
  const [unplayed, setUnplayed] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Define the player controls.
  const [config, setConfig] = React.useState({
    controls: true,
    file: {
      forceHLS: true
    },
    height: '100%',
    muted: props.muted ? true : false,
    playing: props.playing,
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
   * Handles video buffering.
   */
  const handleBuffer: (
  ) => void = (
  ): void => {
    setLoading(true);
  }

  /**
   * Handles completion of video buffering.
   */
  const handleBufferEnd: (
  ) => void = (
  ): void => {
    setLoading(false);
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
    if (props.update && props.videoProgress) {
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

        if (props.update) {
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
    setUnplayed(false);
    setLoading(false);
  }

  /**
   * Update the playing state.
   */
  React.useEffect(() => {

    if (props.playing && unplayed) {
      setConfig({
        ...config,
        playing: props.playing,
        url: props.review.videoURL || ''
      });
      setUnplayed(false);

      return;
    }

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

    if (props.review.videoURL !== config.url) {
      setConfig({
        ...config,
        url: props.review.videoURL
      });
    }
  }, [config, props.muted, props.playing, props.review]);

  return (
    <Box
      className={clsx(classes.container)}
    >
      <Box
        className={clsx(classes.videoBox)}
      >
        <Player
          {...config}
          progressInterval={5000}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onProgress={handleProgress}
          onReady={handleReady}
          onStart={handleStart}
          ref={playerRef}
          style={{position: 'absolute', top: 0, left: 0, height: 'auto !important'}}
        />
      </Box>
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
const mapStateToProps = (state: any, ownProps: DesktopVideoProps) => {
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
)(DesktopVideo);
