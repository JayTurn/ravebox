/**
 * ListTitle.tsx
 * Renders the title above a list of content.
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
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Interfaces.
import { ListTitleProps } from './ListTitle.interface';

/**
 * Create styles for the list title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  titleContainer: {
  },
  titleText: {
    fontSize: '.8rem',
    fontWeight: 700,
    margin: theme.spacing(3, 2),
    textTransform: 'uppercase'
  }
}));

/**
 * List title display component.
 */
const ListTitle: React.FC<ListTitleProps> = (props: ListTitleProps) => {
  // Match the large media query size.
  const classes = useStyles();

  return (
    <Grid
      container
      direction='column'
      alignItems='flex-start'
      className={classes.titleContainer}
    >
      <Grid item xs={12}>
        <Typography variant='h3' className={clsx(classes.titleText)}>
          {props.title}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default ListTitle;
