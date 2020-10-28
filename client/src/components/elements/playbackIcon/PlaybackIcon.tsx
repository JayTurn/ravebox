/**
 * PlaybackIcon.tsx
 * Component rendering the playback icon.
 */

// Modules.
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PauseRoundedIcon from '@material-ui/icons/PauseRounded';
import PlayArrowRoundedIcon from '@material-ui/icons/PlayArrowRounded';
import * as React from 'react';
import { Transition } from 'react-transition-group';

// Interfaces.
import { PlaybackIconProps } from './PlaybackIcon.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    playbackIcon: {
      color: theme.palette.common.white,
      fontSize: '5.5rem',
      opacity: 0,
      transition: 'all 200ms ease-in-out'
    },
    playbackIconEntering: {
      opacity: 0,
      transform: `scale(1)`
    },
    playbackIconEntered: {
      opacity: .7,
      transform: `scale(1.25)`
    },
    playbackIconExiting: {
      opacity: .7,
      transform: `scale(1.25)`
    },
    playbackIconExited: {
      opacity: 0,
      transform: `scale(1.25)`
    },
    progress: {
      color: theme.palette.common.white,
      opacity: 0,
      transition: 'opacity 100ms ease-in-out'
    },
    progressEntering: {
      opacity: 0,
      transform: `scale(1)`
    },
    progressEntered: {
      opacity: .7,
      transform: `scale(1.25)`
    },
    progressExiting: {
      opacity: .7,
      transform: `scale(1.25)`
    },
    progressExited: {
      opacity: 0,
      transform: `scale(1.25)`
    },
    playContainer: {
      height: '100%',
      textAlign: 'center'
    }
  })
);

/**
 * Renders the playback icon component.
 */
const PlaybackIcon: React.FC<PlaybackIconProps> = (props: PlaybackIconProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Track the current playing state.
  const [showPlayButton, setShowPlayButton] = React.useState<boolean>(false);

  const [playing, setPlaying] = React.useState<boolean>(props.playing);

  /**
   * Display the playback button when the playing state has changed.
   */
  React.useEffect(() => {
    if (playing !== props.playing) {
      setPlaying(props.playing);

      if (props.unplayed) {
        return;
      }

      setShowPlayButton(true);
    }
  }, [playing, props.playing, props.unplayed]);

  /**
   * Hide the playback icon after it has been displayed.
   */
  React.useEffect(() => {
    if (showPlayButton) {
      setTimeout(() => {
        setShowPlayButton(false);
      }, 300);
    }
  }, [showPlayButton]);

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.playContainer)}
      container 
      direction='column'
      justify='center'
    >
      {props.loading ? (
        <Grid item>
          <Transition in={props.loading} timeout={100}>
            {(state: string) => (
              <CircularProgress className={clsx(
                classes.progress, {
                  [classes.progressEntering]: state === 'entering',
                  [classes.progressEntered]: state === 'entered',
                  [classes.progressExiting]: state === 'exiting',
                  [classes.progressExited]: state === 'exited'
                }
              )}/>  
            )}
          </Transition>
        </Grid>
      ): (
        <Grid item>
          {props.unplayed ? (
            <Transition in={props.unplayed} timeout={100}>
              {(state: string) => (
                <PlayArrowRoundedIcon className={clsx(
                  classes.playbackIcon, {
                    [classes.playbackIconEntering]: state === 'entering',
                    [classes.playbackIconEntered]: state === 'entered',
                    [classes.playbackIconExiting]: state === 'exiting',
                    [classes.playbackIconExited]: state === 'exited'
                  }
                )}/>  
              )}
            </Transition>
          ) : (
            <Transition in={showPlayButton} timeout={100}>
              {(state: string) => (
                <React.Fragment>
                  {playing ? (
                    <PlayArrowRoundedIcon className={clsx(
                      classes.playbackIcon, {
                        [classes.playbackIconEntering]: state === 'entering',
                        [classes.playbackIconEntered]: state === 'entered',
                        [classes.playbackIconExiting]: state === 'exiting',
                        [classes.playbackIconExited]: state === 'exited'
                      }
                    )}/>  
                  ) : (
                    <PauseRoundedIcon className={clsx(
                      classes.playbackIcon, {
                        [classes.playbackIconEntering]: state === 'entering',
                        [classes.playbackIconEntered]: state === 'entered',
                        [classes.playbackIconExiting]: state === 'exiting',
                        [classes.playbackIconExited]: state === 'exited'
                      }
                    )}/>  
                  )}
                </React.Fragment>
              )}
            </Transition>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default PlaybackIcon;
