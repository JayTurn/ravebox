/**
 * CardUser.tsx
 * CardUser menu component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Link as ReactLink } from 'react-router-dom';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';
import { Role } from '../../user/User.enum';

// Interfaces.
import { Review } from '../../review/Review.interface';
import { CardUserProps } from './CardUser.interface';

// Utilities.
import {
  getExternalAvatar,
  formatStatistics
} from '../../user/User.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      height: theme.spacing(5),
      width: theme.spacing(5)
    },
    avatarIcon: {
      fontSize: '.9rem',
      fontWeight: 600,
      height: theme.spacing(5),
      width: theme.spacing(5)
    },
    container: {
    },
    handleContainer: {
      margin: theme.spacing(0, 2, 0, 1)
    },
    handleText: {
      fontSize: '1.15rem',
      lineHeight: 1.3,
      fontWeight: 600
    },
    raveButton: {
    },
    userLink: {
      color: 'inherit',
      textDecoration: 'none'
    },
    userStatisticsText: {
      fontSize: '.7rem',
      fontWeight: 600,
      textTransform: 'uppercase'
    },
    userYTText: {
      fontSize: '.7rem',
      fontWeight: 600
    }
  })
);

/**
 * Renders the rave stream card.
 */
const CardUser: React.FC<CardUserProps> = (props: CardUserProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const firstLetter: string = props.review && props.review.user ?
    props.review.user.handle.substr(0, 1) : 'R';

  const {
    review
  } = {...props};

  const statistics: string = review && review.user && review.user.statistics 
    ? formatStatistics(review.user.statistics)
    : '';

  const avatar: string | undefined = review.user ? getExternalAvatar(review.user) : undefined; 

  return (
    <React.Fragment>
      {review.user &&
        <ReactLink
          className={clsx(classes.userLink)}
          to={`/user/channel/${review.user.handle}`}
          title={`Visit the profile of ${review.user.handle}`}
        >
          <Grid
            container
            alignItems='center'
            className={clsx(classes.container)}
            justify='flex-start'
          >
            <Grid item>
              {avatar ? (
                <Avatar
                  alt={review.user.handle}
                  className={clsx(classes.avatar)}
                  src={avatar}
                />
              ) : (
                <Avatar
                  alt={review.user.handle}
                  className={clsx(classes.avatarIcon)}
                >
                  {firstLetter} 
                </Avatar>
              )}
            </Grid>
            <Grid item className={clsx(classes.handleContainer)}>
              <Typography
                className={clsx(classes.handleText)}
                variant='body1'
              >
                {review.user.handle}
              </Typography>
              {review.user.role === Role.YOUTUBE ? (
                <Typography variant='body2' className={classes.userYTText}>
                  (via YouTube)
                </Typography>
              ) : (
                <React.Fragment>
                  {review.user.statistics &&
                    <Typography variant='body2' className={classes.userStatisticsText}>
                      {statistics}
                    </Typography>
                  }
                </React.Fragment>
              )}
            </Grid>
          </Grid>
        </ReactLink>
      }
    </React.Fragment>
  );
}

export default CardUser;
