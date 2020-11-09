/**
 * LoadingDesktopVideo.tsx
 * Renders a placeholder of a loading ravestream.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

// Interfaces.
import { LoadingDesktopVideoProps } from './LoadingDesktopVideo.interface';

/**
 * Create styles for the placeholder.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    video: {
      borderRadius: 20,
      height: 0,
      paddingTop: '56.25%'
    }
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingDesktopVideo: React.FC<LoadingDesktopVideoProps> = (props: LoadingDesktopVideoProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Skeleton
      className={clsx(
        classes.video
      )}
      variant='rect'
      width={`100%`}
    />
  );
}

export default LoadingDesktopVideo;
