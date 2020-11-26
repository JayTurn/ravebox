/**
 * UserLinks.tsx
 * Rave information component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Components.
import UserDescription from '../userDescription/UserDescription';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';
import {
  Role
} from '../../user/User.enum';

// Interfaces.
import { RaveStream } from '../RaveStream.interface';
import { UserLink } from '../../user/User.interface';
import { UserLinksProps } from './UserLinks.interface';

// Utilities.
import { getExternalLinkPath } from '../../user/User.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkContainer: {
      margin: theme.spacing(1, 0, 2),
      padding: theme.spacing(0, 2)
    },
    linkItem: {
      padding: theme.spacing(1, 0)
    },
    linkText: {
      fontWeight: 600
    },
    titleContainer: {
      margin: theme.spacing(2, 2, 0),
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 800
    },
    alignCenter: {
      marginLeft: 'auto',
      marginRight: 'auto',
      textAlign: 'center'
    }
  })
);

/**
 * Renders the user's link information.
 */
const UserLinks: React.FC<UserLinksProps> = (props: UserLinksProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [userId, setUserId] = React.useState<string>('');

  const [height, setHeight] = React.useState<number>(0);

  const title: string = props.user && props.user.role !== Role.YOUTUBE
    ? `Where to find ${props.user.handle}`
    : `Where to find`;

  return (
    <Grid container ref={ref}>
      <Grid item xs={12}>
        <Box className={clsx(
          classes.titleContainer, {
            [classes.alignCenter]: props.align === 'center'
          }
        )}>
          <Typography variant='body1' className={clsx(classes.title)}>
            {title}
          </Typography>
        </Box>
      </Grid>
      {props.user.links && props.user.links.length > 0 &&
        <Grid item xs={12}>
          <Grid container className={clsx(classes.linkContainer)}>
            {props.user.links.map((userLink: UserLink, index: number) => {
              const linkPrefix: string = getExternalLinkPath(userLink.linkType);

              return (
                <Grid item key={index} xs={12} className={clsx(
                  classes.linkItem, {
                    [classes.alignCenter]: props.align === 'center'
                  }
                )}>
                  <Typography variant='body1'>
                    <Link
                      className={clsx(classes.linkText)}
                      href={`${linkPrefix}${userLink.path}`} 
                      target='_blank'
                    >
                      {userLink.linkType}
                    </Link>
                  </Typography>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      }
    </Grid>
  );
};

export default UserLinks;
