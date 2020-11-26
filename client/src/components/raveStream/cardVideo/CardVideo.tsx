/**
 * CardVideo.tsx
 * CardVideo menu component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Player from 'react-player/lazy';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import CardUser from '../cardUser/CardUser';
import PlaybackIcon from '../../elements/playbackIcon/PlaybackIcon';
import RaveStreamMute from '../mute/RaveStreamMute';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { CardVideoProps } from './CardVideo.interface';

// Utilities.
import { calculateVideoRatio } from '../RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      borderRadius: 20,
      height: `calc(100vw * .75)`,
      overflow: 'hidden',
      margin: theme.spacing(0, 1),
      position: 'relative',
      width: 'calc(100% - 16px)'
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
    player: {
    },
    showMute: {
      opacity: .8
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
      left: 0,
      position: 'absolute',
      width: '100%',
      zIndex: 1
    }
  })
);

/**
 * Renders the rave stream card.
 */
const CardVideo: React.FC<CardVideoProps> = (props: CardVideoProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const {
    active,
    muted,
    review
  } = {...props};

  // Define the player reference to be used for video controls.
  const playerRef = React.useRef<Player>(null);

  const videoRatio: number = calculateVideoRatio(
    props.review.videoWidth)(props.review.videoHeight);

  // Tracking co-ordinates for the mouse events.
  const [startX, setStartX] = React.useState<number>(0);
  const [startY, setStartY] = React.useState<number>(0);

  // Define a first load property to show the thumbnail.
  const [unplayed, setUnplayed] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Define the player controls.
  const [config, setConfig] = React.useState({
    controls: false,
    file: {
      forceDASH: true,
      forceHLS: true,
      hlsOptions: {
      }
    },
    height: 'calc(100vw * .75)',
    muted: muted ? true : false,
    playing: props.active && props.playing,
    playsinline: true,
    url: '',
    volume: 1,
    width: videoRatio !== 0 ? `calc(${videoRatio * 100}vw)` : `calc(92vw)`,
    youtube: {
      playerVars: {
        iv_load_policy: 3,
        modestbranding: 1
      }
    }
  });

  /**
   * Handles selecting the overlay to play and pause video.
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
    const xDiff: number = Math.abs(e.clientX - startX),
          yDiff: number = Math.abs(e.clientY - startY);

    if (xDiff < 5) {
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
    }
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
  };

  const handleStart: (
  ) => void = (
  ): void => {
    setUnplayed(false);
    setLoading(false);
  };

  /**
   * Pause video playback when not the active video.
   */
  React.useEffect(() => {
    // If this isn't the active video, pause playback.
    if (!props.active) {
      setConfig({
        ...config,
        playing: false
      });
    }
    if (props.active && muted !== config.muted) {
      setConfig({
        ...config,
        muted: muted ? true : false
      });
    }
  }, [config.playing, props.active, unplayed, muted]);

  return (
    <Box className={clsx(classes.container)}>
      <Box
        className={clsx(classes.overlay)} 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <PlaybackIcon
          loading={loading}
          playing={config.playing}
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
      />
      <Box
        className={clsx(classes.videoContainer)}
        style={{
          left: videoRatio > 1 ? `-${((videoRatio - 1) * 100) / 2}%` : 0,
        }}
      >
        <Player
          {...config}
          className={clsx(classes.player)}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onReady={handleReady}
          onStart={handleStart}
          progressInterval={5000}
          ref={playerRef}
          style={{position: 'absolute', top: 0, left: 0, height: 'auto !important'}}
        />
      </Box>
    </Box>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: CardVideoProps) => {
  // Retrieve the video progress from the redux store.
  const muted: boolean = state.video ? state.video.muted : true;

  return {
    ...ownProps,
    muted,
  };
};

export default withRouter(connect(
  mapStateToProps
)(CardVideo));
