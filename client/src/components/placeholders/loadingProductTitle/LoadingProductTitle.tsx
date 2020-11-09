/**
 * LoadingProductTitle.tsx
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
import { LoadingProductTitleProps } from './LoadingProductTitle.interface';

/**
 * Create styles for the placeholder.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    brandName: {
      borderRadius: 5,
      height: 20,
      marginBottom: theme.spacing(1),
      maxWidth: 200,
      width: '100%'
    },
    padding: {
      padding: theme.spacing(0, 2),
      margin: theme.spacing(2, 0)
    },
    productName: {
      borderRadius: 5,
      height: 30,
      maxWidth: 450,
      width: '100%'
    }
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingProductTitle: React.FC<LoadingProductTitleProps> = (props: LoadingProductTitleProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Grid container className={clsx(classes.padding)}>
      <Grid item xs={12}>
        <Skeleton
          className={clsx(
            classes.brandName
          )}
          variant='rect'
        />
      </Grid>
      <Grid item xs={12}>
        <Skeleton
          className={clsx(
            classes.productName
          )}
          variant='rect'
        />
      </Grid>
    </Grid>
  );
}

export default LoadingProductTitle;
