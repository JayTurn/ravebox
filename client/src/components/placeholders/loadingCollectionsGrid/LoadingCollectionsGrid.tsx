/**
 * LoadingCollectionsGrid.tsx
 * Renders a placeholder of collections being loaded in a grid.
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
import { LoadingCollectionsGridProps } from './LoadingCollectionsGrid.interface';

/**
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    gridContainer: {
      margin: theme.spacing(4, 0)
    },
    gridHeaderContainer: {
      marginBottom: theme.spacing(1)
    },
    gridItem: {
    },
    gridTitleContainer: {
      padding: theme.spacing(0, 2)
    },
    gridTitleText: {
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(1),
      width: 150,
      height: 150,
    }
  })
));

/**
 * Renders the placeholder loading element based on the collections grid.
 */
const LoadingCollectionsGrid: React.FC<LoadingCollectionsGridProps> = (props: LoadingCollectionsGridProps) => {
  // Match the large media query size.
  const classes = useStyles();

  // Define the grid list.
  const gridList: Array<number> = [0, 1, 2, 3, 4, 5];

  return (
    <Grid
      container
      className={clsx(classes.gridContainer)}
      spacing={2}
      justify='center'
    >
      {gridList.map((item: number, index: number) => {
        return (
          <Grid item key={index}
            className={clsx(classes.gridItem)}
          >
            <Grid
              alignItems='center'
              className={clsx(classes.gridHeaderContainer)}
              container
              direction='row'
            >
              <Grid
                item 
                className={clsx(classes.gridTitleContainer)}
                xs={12}
              >
                <Skeleton
                  variant='rect'
                  className={clsx(classes.gridTitleText)}
                />
              </Grid>
            </Grid>
          </Grid>
        )
      })}
    </Grid>
  );
}

export default LoadingCollectionsGrid;
