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
import LinkElement from '../link/Link';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Enumerators.
import { PresentationType } from '../../review/listByQuery/ListByQuery.enum';

// Interfaces.
import { ListTitleProps } from './ListTitle.interface';

/**
 * Create styles for the list title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  titleContainer: {
  },
  titleText: {
    color: theme.palette.text.secondary,
    fontSize: '.9rem',
    fontWeight: 700,
    margin: theme.spacing(0, 2, 3),
    textTransform: 'uppercase'
  },
  gridTitle: {
    color: theme.palette.primary.main,
    fontSize: '1.15rem',
  },
  scrollableTitle: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    marginTop: theme.spacing(2)
  }
}));

/**
 * List title display component.
 */
const ListTitle: React.FC<ListTitleProps> = (props: ListTitleProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid
      container
      direction='column'
      alignItems='flex-start'
      className={classes.titleContainer}
    >
      <Grid item xs={12}>
          <Typography variant='h3' className={clsx(
            classes.titleText,
            {
              [classes.gridTitle]: props.presentationType === PresentationType.GRID,
              [classes.scrollableTitle]: props.presentationType === PresentationType.SCROLLABLE
            })}
          >
            {props.url ? (
              <LinkElement path={props.url} title={props.title}> 
                {props.title}
              </LinkElement>
            ) : (
              <React.Fragment>
                {props.title}
              </React.Fragment>
            )}
          </Typography>
      </Grid>
    </Grid>
  );
}

export default ListTitle;
