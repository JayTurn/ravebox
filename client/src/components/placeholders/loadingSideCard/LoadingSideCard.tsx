/**
 * LoadingSideCard.tsx
 * Renders a placeholder of a loading side card.
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

// Interfaces.
import { LoadingSideCardProps } from './LoadingSideCard.interface';

/**
 * Create styles for the placeholder.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    container: {
      padding: theme.spacing(0, 2, 4)
    },
    contentContainer: {
      padding: theme.spacing(0, 0, 0, 2)
    },
    image: {
      borderRadius: 5,
      height: 100,
      margin: theme.spacing(0),
      width: '100%'
    },
    title: {
      borderRadius: 5,
      height: 20,
      margin: theme.spacing(0, 0, 1),
      width: '80%'
    },
    user: {
      borderRadius: 5,
      height: 20,
      margin: theme.spacing(0, 0, 1),
      width: '30%'
    },
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingSideCard: React.FC<LoadingSideCardProps> = (props: LoadingSideCardProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={4}>
        <Skeleton
          className={clsx(
            classes.image
          )}
          variant='rect'
        />
      </Grid>
      <Grid item xs={8} className={clsx(classes.contentContainer)}>
        <Skeleton
          className={clsx(
            classes.title
          )}
          variant='rect'
        />
        <Skeleton
          className={clsx(
            classes.user
          )}
          variant='rect'
        />
      </Grid>
    </Grid>
  );
}

export default LoadingSideCard;
