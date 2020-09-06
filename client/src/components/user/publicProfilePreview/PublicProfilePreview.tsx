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
import { NavLink } from 'react-router-dom';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Hooks.
import { useRetrievePublicProfileStatistics } from './useRetrievePublicStatistics';

// Interfaces.
import { PublicProfilePreviewProps } from './PublicProfilePreview.interface';

/**
 * Styles for the public profile preview.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  avatar: {
    height: theme.spacing(5),
    width: theme.spacing(5)
  },
  avatarIcon: {
    backgroundColor: theme.palette.primary.main,
    fontSize: '.9rem',
    fontWeight: 600,
    height: theme.spacing(5),
    width: theme.spacing(5)
  },
  channelLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none'
    }
  },
  container: {
    padding: theme.spacing(0, 2)
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

  // Use the public profile statistics hook.
  const {
    profileStatistics,
    retrievalStatus
  } = useRetrievePublicProfileStatistics({ id: props._id });

  const firstLetter: string = props.handle.substr(0,1);

  return (
    <Grid container direction='row' className={classes.container} alignItems='center'>
      <Grid item>
        <NavLink 
          className={clsx(classes.channelLink)}
          title={`View ${props.handle}'s channel`}
          to={`/user/channel/${props.handle}`}
        >
          {props.avatar ? (
            <Avatar alt={props.handle} className={classes.avatar} src={`${process.env.RAZZLE_CDN}${props.avatar}`}/>
          ): (
            <Avatar alt={props.handle} className={classes.avatarIcon}>{firstLetter}</Avatar>
          )}
        </NavLink>
      </Grid>
      <Grid item className={classes.handleContainer}>
        <NavLink 
          className={clsx(classes.channelLink)}
          title={`View ${props.handle}'s channel`}
          to={`/user/channel/${props.handle}`}
        >
          <Typography variant='body1' className={classes.handleText}>{props.handle}</Typography>
          {profileStatistics.ravesCount &&
            <Typography variant='body1' className={classes.raveCount}>{profileStatistics.ravesCount}</Typography>
          }
        </NavLink>
      </Grid>
    </Grid>
  );
}

export default withRouter(PublicProfilePreview);
