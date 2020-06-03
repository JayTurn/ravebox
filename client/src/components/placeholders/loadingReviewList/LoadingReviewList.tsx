/**
 * LoadingReviewList.tsx
 * Renders a placeholder of reviews being loaded.
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
import { LoadingReviewListProps } from './LoadingReviewList.interface';

/**
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    gridContainer: {
      padding: theme.spacing(0, 2),
      margin: theme.spacing(4, 0)
    },
    gridHeaderContainer: {
      marginBottom: theme.spacing(1)
    },
    gridItem: {
      padding: theme.spacing(2)
    },
    gridTitleContainer: {
      marginLeft: theme.spacing(1)
    },
    gridTitleText: {
      marginBottom: theme.spacing(1)
    }
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingReviewList: React.FC<LoadingReviewListProps> = (props: LoadingReviewListProps) => {
  // Match the large media query size.
  const classes = useStyles();

  // Define the grid list.
  const gridList: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <Grid
      container
      className={clsx(classes.gridContainer)}
    >
      {gridList.map((item: number, index: number) => {
        return (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}
            className={clsx(classes.gridItem)}
          >
            <Grid
              alignItems='center'
              className={clsx(classes.gridHeaderContainer)}
              container
              direction='row'
            >
              <Grid item>
                <Skeleton variant='circle' width={40} height={40} />
              </Grid>
              <Grid item className={clsx(classes.gridTitleContainer)}>
                <Skeleton variant='rect' width={120} height={10} className={clsx(classes.gridTitleText)} />
                <Skeleton variant='rect' width={200} height={10} />
              </Grid>
            </Grid>
            <Skeleton variant='rect' width='100%' height={170} />
          </Grid>
        )
      })}
    </Grid>
  );
}

export default LoadingReviewList;
