/**
 * LoadingReviewList.tsx
 * Placeholder for a list of loading review cards.
 */

// Modules.
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

// Interfaces.
import { LoadingReviewListProps } from './LoadingReviewList.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      marginTop: theme.spacing(1),
    }
  }),
);

/**
 * Creates a numerical array using the count value provided.
 *
 * @param { number } count - the number of array items to create.
 */
const createItems: (
  count: number
) => Array<number> = (
  count: number
): Array<number> => {

  let i: number = 0;

  const items: Array<number> = [];

  do {
    items.push(i);
    i++;
  } while (i < count);

  return items;
}

/**
 * Loading display for a list of reviews.
 */
const LoadingReviewList: React.FC<LoadingReviewListProps> = (props: LoadingReviewListProps) => {
  // Define the style classes.
  const classes = useStyles();

  // Create an array of placeholders to display.
  const items: Array<number> = createItems(props.count); 

  return (
    <Grid
      container
      direction='row'
      spacing={3}
    >
      {items.map((item: number) => {
        return (
          <Grid item xs={12} lg={4} key={item}>
            <Skeleton variant='rect' width='100%' height={280} />
            <Skeleton className={classes.text} height={20} />
            <Skeleton width='60%' className={classes.text} height={20} />
          </Grid>
        );
      })}
    </Grid>
  );
}

export default LoadingReviewList;
