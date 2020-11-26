/**
 * DesktopCardVideo.tsx
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
  update,
  updateActive
} from '../../../store/video/Actions';

// Components.
import PlaybackIcon from '../../elements/playbackIcon/PlaybackIcon';
import RaveStreamMute from '../../raveStream/mute/RaveStreamMute';

// Enumerators.
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { Review } from '../../review/Review.interface';
import {
  DesktopCardVideoProps
} from './DesktopCardVideo.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

// Utilities.
import { calculateVideoRatio } from '../../raveStream/RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      borderRadius: 10,
      height: '0',
      //maxHeight: 'calc(100vh); max-height: -webkit-fill-available;',
      //minHeight: 'calc(100vh); min-height: -webkit-fill-available;',
      paddingTop: '75%',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 300ms ease-in-out',
      width: '100%',
      zIndex: 3
    },
    defaultColor: {
      color: theme.palette.common.white
    },
    externalVideo: {
      left: -15,
      top: -10
    },
    muteButton: {
      bottom: theme.spacing(1),
      left: theme.spacing(1),
      opacity: 0,
      position: 'absolute'
    },
    overlay: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 3
    },
    showMute: {
      opacity: .8
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
      position: 'absolute',
      width: '100%'
    }
  })
);

/**
 * Renders the video in the stream.
 */
const DesktopCardVideo: React.FC<DesktopCardVideoProps> = (props: DesktopCardVideoProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const {
    activeId,
    muted,
    review
  } = {...props};

  // Define the player reference to be used for video controls.
  const playerRef = React.useRef<Player>(null);

  const videoRatio: number = calculateVideoRatio(
    review.videoWidth)(review.videoHeight);

  //const height: string = videoRatio !== 0
    //? `calc(100vw / ${videoRatio})`
    //: `calc(100vw * .5625)`; 
  const height: string = `calc(100vw * .5625)`;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [playing, setPlaying] = React.useState<boolean>(false);

  // Define a first load property to show the thumbnail.
  const [unplayed, setUnplayed] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const isActiveVideo: boolean = review._id === activeId;

  // Define the player controls.
  const [config, setConfig] = React.useState({
    controls: false,
    file: {
      forceHLS: true
    },
    height: videoRatio !== 0 ? 'auto' : '100%',
    muted: muted ? true : false,
    playing: playing,
    playsinline: true,
    url: '',
    volume: 1,
    width: videoRatio !== 0 ? `calc(${videoRatio * 100}%` : '100%'
  });

  /**
   * Handles the video completion event.
   */
  const handleComplete: (
  ) => void = (
  ): void => {
  };

  /**
   * Handles video buffering.
   */
  const handleBuffer: (
  ) => void = (
  ): void => {
    setLoading(true);
  };

  /**
   * Handles completion of video buffering.
   */
  const handleBufferEnd: (
  ) => void = (
  ): void => {
    setLoading(false);
  };

  /**
   * Handles playback.
   */
  const handlePlayback: (
    e: React.MouseEvent
  ) => void = (
    e: React.MouseEvent
  ): void => {
    e.stopPropagation();

    if (props.updateActive) {
      props.updateActive(review._id);
    }

    if (unplayed === true) {
      setLoading(true);
      setConfig({
        ...config,
        url: review.videoURL || '',
        playing: !config.playing
      });
    } else {
      setConfig({
        ...config,
        playing: !config.playing
      });
    }
    setPlaying(!config.playing);
  };

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
        _id: review._id,
        loaded: state.loaded,
        loadedSeconds: state.loadedSeconds,
        played: state.played,
        playedSeconds: state.playedSeconds
      });
    }
  };

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
        
      }
    }

    setConfig({
      ...config,
      playing: true
    });
    setPlaying(true);
  };

  /**
   * Handles the video when it is ready.
   */
  /*
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
  */

  /**
   * Handles the video when it is first played.
   */
  const handleStart: (
  ) => void = (
  ): void => {
    setUnplayed(false);
    setLoading(false);
  };

  /**
   * Update the playing state.
   */
  React.useEffect(() => {

    if (isActiveVideo) {
      if (playing && unplayed) {
        setConfig({
          ...config,
          playing: playing,
          url: review.videoURL || ''
        });
        setUnplayed(false);

        return;
      }

      if (playing !== config.playing) {
        setConfig({
          ...config,
          playing: playing
        });
      }
      if (muted !== config.muted) {
        setConfig({
          ...config,
          muted: muted ? true : false
        });
      }
    } else {
      if (playing) {
        setConfig({
          ...config,
          playing: false
        });
        setPlaying(false);
        console.log('Note active id');
      }
    }
    /*
    if (!isActiveVideo) {
      setConfig({
        ...config,
        playing: false
      });
    }
    */


  }, [
    config,
    isActiveVideo,
    muted,
    playing,
    review
  ]);

  return (
    <Box
      className={clsx(classes.container)}
    >
      <Box
        className={clsx(
          classes.overlay, {
            [classes.externalVideo]: videoRatio === 0
          }
        )} 
        onClick={handlePlayback}
      >
        <PlaybackIcon
          loading={loading}
          playing={playing}
          size='small'
          unplayed={unplayed}
        />
        <Box
          className={clsx(
            classes.muteButton, {
              [classes.showMute]: config.playing && !unplayed
            }
          )}
        > 
          <RaveStreamMute />
        </Box>
      </Box>
      <Box
        className={clsx(classes.thumbnailContainer)}
        style={{
          backgroundImage: `url(${review.thumbnail})`,
          opacity: unplayed ? 1 : 0
        }}
      >
      </Box>
      <Box
        className={clsx(classes.videoBox)}
        style={{
          left: `-${((videoRatio * 100) / 4) / 2}%`,
          top: 0
        }}
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
      updateActive: updateActive
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: DesktopCardVideoProps) => {
  // Retrieve the video progress from the redux store.
  const activeId: string = state.video ? state.video.active : '',
        videoProgress: VideoProgress = state.video ? state.video.progress : undefined,
        muted: boolean = state.video ? state.video.muted : false;

  return {
    ...ownProps,
    activeId,
    muted,
    videoProgress
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DesktopCardVideo);
