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
import { getExternalAvatar } from '../../user/User.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      boxShadow: `0 1px 1px rgba(0,0,0,0.25)`,
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
      margin: theme.spacing(0, 2, 0, .5)
    },
    handleText: {
      fontSize: '1rem',
      fontWeight: 500
    },
    raveButton: {
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
    props.review.user.handle.substr(0,1) : 'R';

  const {
    review
  } = {...props};

  const avatar: string | undefined = review.user ? getExternalAvatar(review.user) : undefined; 

  return (
    <Grid
      container
      alignItems='center'
      className={clsx(classes.container)}
      justify='flex-start'
    >
      {review.user &&
        <React.Fragment>
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
              {review.user.role === Role.YOUTUBE ? 'youtube' : review.user.handle}
            </Typography>
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
}

export default CardUser;
