/**
 * LoadingRaveStream.tsx
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
import { LoadingRaveStreamProps } from './LoadingRaveStream.interface';

/**
 * Create styles for the placeholder.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    button: {
      borderRadius: 10
    },
    item: {
      backgroundColor: `rgba(100,106,240, .3)`,
    },
    container: {
      padding: theme.spacing(0, 2),
      margin: theme.spacing(2, 0)
    },
    video: {
      borderRadius: 20,
      margin: theme.spacing(2, 0)
    }
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingRaveStream: React.FC<LoadingRaveStreamProps> = (props: LoadingRaveStreamProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Grid
      container
      className={clsx(classes.container)}
    >
      <Grid item xs={6}>
        <Skeleton
          className={clsx(
            classes.item
          )}
          height={30}
          variant='rect'
          width={`100%`}
        />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={3}>
        <Skeleton
          className={clsx(
            classes.button,
            classes.item
          )}
          height={30}
          variant='rect'
          width={`100%`}
        />
      </Grid>
      <Grid item xs={12}>
        <Skeleton
          className={clsx(
            classes.video,
            classes.item
          )}
          height={270}
          variant='rect'
          width={`100%`} 
        />
      </Grid>
      <Grid item xs={3}>
        <Skeleton
          className={clsx(
            classes.item
          )}
          height={40}
          variant='circle'
          width={40}
        />
      </Grid>
      <Grid item xs={5} />
      <Grid item xs={4}>
        <Skeleton
          className={clsx(
            classes.button,
            classes.item
          )}
          height={30}
          variant='rect'
          width={`100%`}
        />
      </Grid>
    </Grid>
  );
}

export default LoadingRaveStream;
