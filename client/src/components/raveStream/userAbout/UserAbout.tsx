/**
 * UserAbout.tsx
 * Rave information component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
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
import UserLinks from '../userLinks/UserLinks';

// Enumerators.
import { RaveStreamType } from '../RaveStream.enum';
import { Role } from '../../user/User.enum';

// Interfaces.
import { UserAboutProps } from './UserAbout.interface';
import { RaveStream } from '../RaveStream.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      margin: theme.spacing(1),
    }
  })
);

/**
 * Renders the user's about information.
 */
const UserAbout: React.FC<UserAboutProps> = (props: UserAboutProps) => {
  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  const ref: React.RefObject<HTMLDivElement> = React.useRef(null);

  const [userId, setUserId] = React.useState<string>('');

  const [height, setHeight] = React.useState<number>(0);

  /**
   * Handles the updating of the height.
   */
  const handleHeightUpdate: (
  ) => void = (
  ): void => {
    if (ref && ref.current) {
      if (ref.current.clientHeight < 600) {
        setHeight(600);
        props.updateHeight(600);
      } else {
        setHeight(ref.current.clientHeight);
        props.updateHeight(ref.current.clientHeight + 30);
      }
    }
  }

  /**
   * Returns the height of the element when it is loaded.
   */
  React.useEffect(() => {
    if (ref && ref.current) {
      if (height !== ref.current.clientHeight) {
        handleHeightUpdate();
      }

      if (props.user && props.user._id !== userId) {
        setUserId(props.user._id);
        handleHeightUpdate();
      }
    }

  }, [height, ref, props.user, userId]);

  return (
    <Grid container ref={ref}>
      <Grid item xs={12}
        className={clsx(classes.cardContainer)}
      >
        <UserDescription
          updateHeight={handleHeightUpdate}
          user={props.user}
        />
      </Grid>
      <Grid item xs={12}
        className={clsx(classes.cardContainer)}
      >
        <UserLinks
          updateHeight={handleHeightUpdate}
          user={props.user}
        />
      </Grid>
    </Grid>
  );
};

export default UserAbout;
