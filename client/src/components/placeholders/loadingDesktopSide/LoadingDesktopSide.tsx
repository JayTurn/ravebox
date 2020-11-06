/**
 * LoadingDesktopSide.tsx
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

// Components.
import LoadingProductTitle from '../loadingProductTitle/LoadingProductTitle';
import LoadingSideCard from '../loadingSideCard/LoadingSideCard';

// Interfaces.
import { LoadingDesktopSideProps } from './LoadingDesktopSide.interface';

/**
 * Create styles for the placeholder.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    nextTitle: {
      borderRadius: 5,
      height: 30,
      margin: theme.spacing(2, 0),
      width: 70
    },
    padding: {
      padding: theme.spacing(0, 2),
      margin: theme.spacing(2, 0)
    },
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingDesktopSide: React.FC<LoadingDesktopSideProps> = (props: LoadingDesktopSideProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12}>
        <LoadingProductTitle />
      </Grid>
      <Grid item xs={12} className={clsx(classes.padding)}>
        <Skeleton
          className={clsx(
            classes.nextTitle
          )}
          variant='rect'
        />
      </Grid>
      <Grid item xs={12}>
        <LoadingSideCard />
      </Grid>
      <Grid item xs={12}>
        <LoadingSideCard />
      </Grid>
      <Grid item xs={12}>
        <LoadingSideCard />
      </Grid>
      <Grid item xs={12}>
        <LoadingSideCard />
      </Grid>
      <Grid item xs={12}>
        <LoadingSideCard />
      </Grid>
    </Grid>
  );
}

export default LoadingDesktopSide;
