/**
 * LoadingDesktopTabs.tsx
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
import { LoadingDesktopTabsProps } from './LoadingDesktopTabs.interface';

/**
 * Create styles for the placeholder.
 */
const useStyles = makeStyles((theme: Theme) => (
  createStyles({
    tab: {
      borderRadius: 5,
      height: 30,
      margin: theme.spacing(1, 2, 1, 0),
      width: 200
    },
    padding: {
      padding: theme.spacing(0, 2),
      margin: theme.spacing(2, 0)
    },
    divider: {
      height: 2,
      width: '100%'
    },
    content: {
      borderRadius: 20,
      margin: theme.spacing(2, 0),
      width: '100%'
    }
  })
));

/**
 * Renders the placeholder loading element based on the list type.
 */
const LoadingDesktopTabs: React.FC<LoadingDesktopTabsProps> = (props: LoadingDesktopTabsProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Grid container className={clsx(classes.padding)}>
      <Grid item xs={12}>
        <Grid container>
          <Grid item>
            <Skeleton
              className={clsx(
                classes.tab
              )}
              variant='rect'
            />
          </Grid>
          <Grid item>
            <Skeleton
              className={clsx(
                classes.tab
              )}
              variant='rect'
            />
          </Grid>
          <Grid item>
            <Skeleton
              className={clsx(
                classes.tab
              )}
              variant='rect'
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Skeleton
          className={clsx(
            classes.divider
          )}
          variant='rect'
        />
      </Grid>
      <Grid item xs={12}>
        <Skeleton
          className={clsx(
            classes.content
          )}
          height={200}
          variant='rect'
        />
        <Skeleton
          className={clsx(
            classes.content
          )}
          height={400}
          variant='rect'
        />
      </Grid>
    </Grid>
  );
}

export default LoadingDesktopTabs;
