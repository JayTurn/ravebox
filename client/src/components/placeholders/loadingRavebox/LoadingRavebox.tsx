/**
 * LoadingRavebox.tsx
 * Loading Ravebox component.
 */

// Modules.
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
import LinearProgress from '@material-ui/core/LinearProgress';
import * as React from 'react';
import { Transition } from 'react-transition-group';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import Logo from '../../logo/Logo';

// Enumerators.
import { LogoColor } from '../../logo/Logo.enum';

// Interfaces.
import { LoadingRaveboxProps } from './LoadingRavebox.interface';

const StyledLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0),
      width: 75 
    },
    colorPrimary: {
      borderRadius: 5,
      backgroundColor: `rgba(200, 200, 200, 1)`
    },
    bar: {
      borderRadius: 5,
      backgroundColor: `rgba(255,255,255,1)`
    },
  }),
)(LinearProgress);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loading: {
      height: '100%',
    },
    loadingContainerHidden: {
      zIndex: 0,
      display: 'none'
    },
    loadingContainerEntering: {
      opacity: 1,
    },
    loadingContainerEntered: {
      opacity: 1,
    },
    loadingContainerExiting: {
      opacity: 1,
    },
    loadingContainerExited: {
      opacity: 0,
    },
    loadingContainer: {
      backgroundColor: theme.palette.primary.main,
      height: '100%',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      transition: `opacity 100ms ease-in-out`,
      width: 'calc(100vw)',
      zIndex: 5
    },
    loadingText: {
      color: theme.palette.common.white,
      fontSize: '.9rem',
      marginTop: theme.spacing(.5),
      textTransform: 'uppercase'
    }
  })
);

/**
 * Renders the Ravebox loading screen.
 */
const LoadingRavebox: React.FC<LoadingRaveboxProps> = (props: LoadingRaveboxProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const [progress, setProgress] = React.useState<number>(0);

  const [progressInterval, setProgressInterval] = React.useState<ReturnType<typeof setInterval> | void | null>(null);

  const [display, setDisplay] = React.useState<boolean>(props.loading || false);

  /**
   * Update the loading state.
   */
  React.useEffect(() => {
    if (progress <= 0 && !progressInterval) {
      setProgressInterval(setInterval(() => {
        setProgress((oldProgress: number) => {
          if (oldProgress >= 100) {
            return 100;
          } else {
            if (oldProgress > 50 && props.loading) {
              return oldProgress + 5;
            } else {
              return oldProgress + 10;
            }
          }
        });
      }, 300));
    }

    if (progress >= 100 && progressInterval) {
      setProgressInterval(
        clearInterval(progressInterval)
      );
    }

    if (!display && props.loading) {
      setDisplay(true);
    }

    if (display && !props.loading) {
      setTimeout(() => {
        setDisplay(false);
      }, 300);
    }

  }, [
    display,
    progress,
    progressInterval,
    props.loading
  ]);

  return (
    <React.Fragment>
      <Transition in={props.loading} timeout={0}>
        {(state: string) => (
          <Box className={clsx(
            classes.loadingContainer, {
              [classes.loadingContainerHidden]: !display,
              [classes.loadingContainerEntering]: state === 'entering',
              [classes.loadingContainerEntered]: state === 'entered',
              [classes.loadingContainerExiting]: state === 'exiting',
              [classes.loadingContainerExited]: state === 'exited'
            }
          )}>
            <Grid
              alignItems='center'
              className={clsx(classes.loading)}
              container
              justify='center' 
            >
              <Grid item xs={12}>
                <Grid container
                  alignItems='center'
                  direction='column'
                >
                  <Grid item>
                    <Logo
                      color={LogoColor.WHITE} 
                      fullWidth='50px'
                      iconOnly={true}
                    />
                  </Grid>
                  <Grid item>
                    <StyledLinearProgress
                      variant='determinate' 
                      value={progress}
                    />
                  </Grid>
                  {props.title &&
                    <Grid item xs={12}>
                      <Typography variant='body1' className={clsx(classes.loadingText)}>
                        {props.title}
                      </Typography>
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
      </Transition>
    </React.Fragment>
  );
};

/**
 * Map the loading state to the properties.
 *
 */
function mapStatetoProps(state: any, ownProps: LoadingRaveboxProps) {

  const loading: boolean = state.loading ? state.loading.loading : true;

  console.log('LOADING_STATE: ', loading);
  return {
    ...ownProps,
    loading
  };
}

export default connect(
  mapStatetoProps
)(LoadingRavebox);
