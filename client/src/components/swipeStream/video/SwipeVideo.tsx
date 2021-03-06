/**
 * SwipeVideo.tsx
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
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Player from 'react-player';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  update
} from '../../../store/video/Actions';

// Components.
import PlaybackIcon from '../../elements/playbackIcon/PlaybackIcon';

// Enumerators.
import {
  VideoPosition
} from '../SwipeStream.enum';

// Hooks.
// import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
// import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  SwipeVideoProps
} from './SwipeVideo.interface';
import { VideoProgress } from '../../raveVideo/RaveVideo.interface';

// Utilities.
import { calculateVideoRatio } from '../../raveStream/RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '100%',
      //maxHeight: 'calc(100vh); max-height: -webkit-fill-available;',
      //minHeight: 'calc(100vh); min-height: -webkit-fill-available;',
      position: 'fixed',
      overflowY: 'auto',
      transition: 'transform 300ms ease-in-out',
      width: 'calc(100vw)',
      zIndex: 3
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
      zIndex: 4
    },
    shadeOverlay: {
      backgroundColor: theme.palette.common.black,
      height: '100%',
      left: 0,
      opacity: 0,
      position: 'absolute',
      top: 0,
      transition: 'opacity 200ms ease-in-out',
      width: '100%',
      zIndex: 3
    },
    shadeOverlayVisible: {
      opacity: .35
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
      borderRadius: 10,
      //height: 0,
      overflow: 'hidden',
      //paddingTop: '56.25%',
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
const SwipeVideo: React.FC<SwipeVideoProps> = (props: SwipeVideoProps) => {
  // Define the analytics context and a tracking event.
  // const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the player reference to be used for video controls.
  const playerRef = React.useRef<Player>(null);

  const videoRatio: number = calculateVideoRatio(
    props.review.videoWidth)(props.review.videoHeight);

  //const height: string = videoRatio !== 0
    //? `calc(100vw / ${videoRatio})`
    //: `calc(100vw * .5625)`; 
  const height: string = `calc(100vw * .5625)`,
        width: string = `calc(100vh / .5625)`;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Create a page viewed state to avoid duplicate views.
  // const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  // Define a first load property to show the thumbnail.
  const [unplayed, setUnplayed] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [ready, setReady] = React.useState<boolean>(false);

  const [landscape, setLandscape] = React.useState<boolean>(largeScreen); 

  // Define the player controls.
  const [config, setConfig] = React.useState({
    controls: false,
    file: {
      forceHLS: true
    },
    height: landscape ? '100%' : height,
    muted: props.muted ? true : false,
    playing: props.active && props.playing,
    playsinline: true,
    url: props.review.videoURL,
    volume: 1,
    width: landscape ? width : 'calc(100vw)'
  });

  /**
   * Handles the video completion event.
   */
  const handleComplete: (
  ) => void = (
  ): void => {
    props.nextVideo();
  };

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
   * Handles the progress of video.
   */
  const handleProgress: (
    state: VideoProgress
  ) => void = (
    state: VideoProgress
  ): void => {
    if (props.update && props.videoProgress && props.active && playerRef) {
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


      setReady(true);

      if (current) {
        current.seekTo(props.review.startTime || 0);
        //const pl: any = current.getInternalPlayer();

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

        if (props.active && props.playing) {
          setConfig({
            ...config,
            playing: true
          });
        } else {
          setConfig({
            ...config,
            playing: false
          });
        }
      }
    }
  };

  /**
   * Handles the video when it is first played.
   */
  const handleStart: (
  ) => void = (
  ): void => {
    setUnplayed(false);
    setLoading(false);

    if (playerRef) {
      const current: Player | null = playerRef.current;

      if (current) {
        console.log(current);
        //current.seekTo(props.review.startTime || 0);
        //const pl: any = current.getInternalPlayer();

        //if (pl && pl.seekTo) {
          //pl.seekTo(props.review.startTime || 0, true);
        //}
      }
    }
  };

  /**
   * Update the playing state.
   */
  React.useEffect(() => {
    // Set the portrait screen size if we're viewing a smaller screen.
    if (landscape && !largeScreen) {
      setConfig({
        ...config,
        height: height,
        width: `calc(100vw)`
      });
      setLandscape(false);
    }

    // Set the landscape screen size if we're viewing a larger screen.
    if (!landscape && largeScreen) {
      setConfig({
        ...config,
        height: 'calc(100vh)',
        width: width
      });
      setLandscape(true);
    }

  }, [landscape, largeScreen]);

  /**
   * Update the playing state.
   */
  React.useEffect(() => {

    if (!playerRef || !playerRef.current) {
      return;
    }
    /*
    if (props.playing && props.active && unplayed) {
      setConfig({
        ...config,
        playing: props.playing,
      });
      //setUnplayed(false);

      return;
    }
    */

    if (props.active && props.playing !== config.playing && ready) {
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
  }, [config, props.active, props.muted, props.playing, unplayed, playerRef]);

  return (
    <Box
      className={clsx(classes.container)}
      style={{transform: `${setVideoPosition(props.positioning)}`}}
    >
      <Box
        className={clsx(
          classes.overlay, {
            [classes.externalVideo]: videoRatio === 0
          }
        )} 
      >
        <PlaybackIcon
          loading={loading}
          playing={config.playing}
          size='small'
          unplayed={false}
        />
      </Box>
      <Box className={clsx(
        classes.shadeOverlay, {
          [classes.shadeOverlayVisible]: !config.playing
        }
      )} />
      {/*
      <Box
        className={clsx(classes.thumbnailContainer)}
        style={{
          backgroundImage: `url(${props.review.thumbnail})`,
          opacity: unplayed ? 1 : 0
        }}
      >
      </Box>
      */}
      <Grid
        className={clsx(classes.videoContainer)}
        container
        alignItems='center'
      >
        <Grid item xs={12} style={{overflow: 'hidden'}}>
          <Box
            className={clsx(classes.videoBox)}
            style={{
              height: landscape ? 'calc(100vh)' : height,
              margin: 'auto',
              overflow: 'hidden',
              width: landscape ? width : 'calc(100vw)'
            }}
          >
            <Player
              {...config}
              progressInterval={5000}
              onBuffer={handleBuffer}
              onBufferEnd={handleBufferEnd}
              onEnded={handleComplete}
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
const mapStateToProps = (state: any, ownProps: SwipeVideoProps) => {
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
)(SwipeVideo);
