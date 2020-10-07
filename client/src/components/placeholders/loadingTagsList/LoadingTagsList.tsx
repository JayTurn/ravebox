/**
 * LoadingTagsList.tsx
 * Renders a placeholder of tags being loaded.
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
import { LoadingTagsListProps } from './LoadingTagsList.interface';

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
      width: '100%',
      padding: theme.spacing(0, 2)
    },
    gridTitleText: {
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(1),
      width: '100%',
      height: 50
    }
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingTagsList: React.FC<LoadingTagsListProps> = (props: LoadingTagsListProps) => {
  // Match the large media query size.
  const classes = useStyles();

  // Define the grid list.
  const gridList: Array<number> = [0, 1, 2, 3];

  return (
    <Grid
      container
      className={clsx(classes.gridContainer)}
    >
      {gridList.map((item: number, index: number) => {
        return (
          <Grid item xs={12} key={index}
            className={clsx(classes.gridItem)}
          >
            <Grid
              alignItems='center'
              className={clsx(classes.gridHeaderContainer)}
              container
              direction='row'
            >
              <Grid item className={clsx(classes.gridTitleContainer)}>
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

export default LoadingTagsList;
