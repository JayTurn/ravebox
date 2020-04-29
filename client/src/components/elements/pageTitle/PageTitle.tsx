/**
 * PageTitle.tsx
 * Page title component to provide consistency across screens.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import PaddedDivider from '../dividers/PaddedDivider';

// Interfaces.
import { PageTitleProps } from './PageTitle.interface';

/**
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  desktop: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 2)
  },
  mobile: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 2)
  }
}));

/**
 * Page title display component.
 */
const PageTitle: React.FC<PageTitleProps> = (props: PageTitleProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid item xs={12} className={clsx({
        [classes.desktop]: largeScreen,
        [classes.mobile]: !largeScreen,
      })}
    >
      <Typography variant='h1' color='textPrimary'>
        {props.title}
      </Typography>
      {largeScreen &&
        <PaddedDivider />
      }
    </Grid>
  );
}

export default PageTitle;
