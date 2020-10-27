/**
 * CardVideo.tsx
 * CardVideo menu component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Player from 'react-player';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import CardUser from '../cardUser/CardUser';
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
    overlay: {
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 5
    },
    thumbnailContainer: {
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      height: '100%',
      left: 0,
      overflow: 'hidden',
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 1
    },
    videoContainer: {
      height: '100%',
      left: 0,
      position: 'absolute',
      width: '100%',
      zIndex: 2
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
    review
  } = {...props};

  // Define the player reference to be used for video controls.
  const playerRef = React.useRef<Player>(null);

  const videoRatio: number = calculateVideoRatio(
    props.review.videoWidth)(props.review.videoHeight);

  // Tracking co-ordinates for the mouse events.
  const [startX, setStartX] = React.useState<number>(0);
  const [startY, setStartY] = React.useState<number>(0);

  // Define the player controls.
  const [config, setConfig] = React.useState({
    controls: false,
    file: {
      forceHLS: true
    },
    height: 'calc(100vw * .75)',
    muted: true,
    playing: props.active && props.playing,
    playsinline: true,
    url: props.review.videoURL,
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

    if (xDiff < 5 && yDiff < 5) {
      setConfig({
        ...config,
        playing: !config.playing
      });
    }
  }
  return (
    <Box className={clsx(classes.container)}>
      <Box
        className={clsx(classes.overlay)} 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <Box
        className={clsx(classes.thumbnailContainer)}
        style={{backgroundImage: `url(${review.thumbnail})`}}
      >
      </Box>
      <Box
        className={clsx(classes.videoContainer)}
        style={{
          left: videoRatio > 1 ? `-${((videoRatio - 1) * 100) / 2}%` : 0,
        }}
      >
        <Player
          {...config}
          progressInterval={5000}
          ref={playerRef}
          style={{position: 'absolute', top: 0, left: 0, height: 'auto !important'}}
        />
      </Box>
    </Box>
  );
}

export default withRouter(CardVideo);
