/**
 * PublicPreview.tsx
 * Preview of a user's public profile.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Interfaces.
import { PublicProfilePreviewProps } from './PublicProfilePreview.interface';

/**
 * Styles for the public profile preview.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  avatarIcon: {
    backgroundColor: theme.palette.primary.main,
    fontSize: '.9rem',
    fontWeight: 600,
    height: theme.spacing(5),
    width: theme.spacing(5)
  },
  container: {
    padding: theme.spacing(3, 2)
  },
  handleContainer: {
    marginLeft: theme.spacing(2)
  },
  handleText: {
    fontWeight: 600
  },
  raveCount: {
    fontSize: '.7rem',
    textTransform: 'uppercase'
  }
}));

/**
 * Renders a preview of a user's public profile.
 */
const PublicProfilePreview: React.FC<PublicProfilePreviewProps> = (props: PublicProfilePreviewProps) => {
  // Use the custom styles.
  const classes = useStyles();

  return (
    <Grid container direction='row' className={classes.container} alignItems='center'>
      <Grid item>
        <Avatar alt={props.handle} className={classes.avatarIcon}>j</Avatar>
      </Grid>
      <Grid item className={classes.handleContainer}>
        <Typography variant='body1' className={classes.handleText}>{props.handle}</Typography>
        <Typography variant='body1' className={classes.raveCount}>5 raves | 100 subscribers</Typography>
      </Grid>
    </Grid>
  );
}

export default PublicProfilePreview;
