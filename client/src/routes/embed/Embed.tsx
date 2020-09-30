/**
 * Embed.tsx
 * Embed screen route component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
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
import * as React from 'react';
import { withRouter } from 'react-router';

// Components.

// Interfaces.
import { EmbedProps } from './Embed.interface';
import { VideoProgress } from '../../components/raveVideo/RaveVideo.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      zIndex: 1
    },
    overlay: {
      backgroundColor: theme.palette.common.black,
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 2
    },
    videoContainer: {
      zIndex: 1
    }
  })
);

/**
 * Embed route component.
 */
const Embed: React.FC<EmbedProps> = (props: EmbedProps) => {
  const playerRef = React.useRef<Player>(null);

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const [details, setDetails] = React.useState<boolean>(false);

  /**
   * Shows the overlay.
   */
  const handleOverlay: (
  ) => void = (
  ): void => {
    setDetails(!details);
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

        pl.seekTo(300, true);
      }
    }
    console.log('Video ready');
  }

  const [config, setConfig] = React.useState({
    controls: false,
    file: {
      forceHLS: true
    },
    muted: true,
    playing: true,
    playsinline: true,
    url: 'https://www.youtube.com/watch?v=7B9-241uugM',
    volume: 1,
    width: '100%'
  });

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
    console.log('Start video');
  }

  /**
   * Handles the video when it is first played.
   */
  const handleStart: (
  ) => void = (
  ): void => {
    console.log('Start video');
  }

  /**
   * Handles the video completion event.
   */
  const handleComplete: (
  ) => void = (
  ): void => {
    console.log('Complete video');
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
   * Render the about JSX elements.
   */
  return (
    <Grid container>
      <Grid item xs={12} sm={6} className={clsx(classes.container)}>
        <Box
          className={clsx(classes.overlay)}
          onClick={handleOverlay}
          style={{opacity: details ? 0.5 : 0}} 
        />
        <Box className={clsx(classes.videoContainer)}>
          <Player
            {...config}
            progressInterval={5000}
            onReady={handleReady}
            onStart={handleStart}
            ref={playerRef}
          />
        </Box>
      </Grid>
      <Grid item>
        <Button
          onClick={handlePlayback}
        >
          Play
        </Button>
      </Grid>
    </Grid>
  );
}

export default withRouter(Embed);
