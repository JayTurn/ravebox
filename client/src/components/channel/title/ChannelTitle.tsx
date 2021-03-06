/**
 * ChannelTitle.tsx
 * Displays a user's handle and public statistics.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
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
import PaddedDivider from '../../elements/dividers/PaddedDivider';

// Interfaces.
import { ChannelTitleProps } from './ChannelTitle.interface';

/**
 * Create styles for the channel title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  avatar: {
    fontSize: '1.2rem',
    fontWeight: 600,
    height: theme.spacing(7),
    width: theme.spacing(7)
  },
  avatarIcon: {
    backgroundColor: theme.palette.primary.main,
    fontSize: '1.2rem',
    fontWeight: 600,
    height: theme.spacing(7),
    width: theme.spacing(7)
  },
  container: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: theme.spacing(1, 0, 1, 1)
  },
  containerLarge: {
    backgroundColor: 'transparent',
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 2)
  },
  handleContainer: {
    marginLeft: theme.spacing(2)
  },
  handleText: {
    fontSize: '1.2rem',
    fontWeight: 600,
    marginBottom: theme.spacing(.5)
  },
  raveCount: {
    fontSize: '.7rem',
    textTransform: 'uppercase'
  },
  titleContainer: {
    padding: theme.spacing(1, 0, 1, 1)
  }
}));

/**
 * Channel title display component.
 */
const ChannelTitle: React.FC<ChannelTitleProps> = (props: ChannelTitleProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <Grid container direction='column' className={clsx(
        classes.container,
        {
          [classes.containerLarge]: largeScreen,
        }
      )}
    >
      <Grid item xs={12}>
        <Grid container direction='row' className={classes.titleContainer} alignItems='center'>
          <Grid item>
            {props.avatar ? (
              <Avatar alt={props.handle} className={classes.avatar} src={props.avatar}/>
            ) : (
              <Avatar alt={props.handle} className={classes.avatarIcon}>j</Avatar>
            )}
          </Grid>
          <Grid item className={classes.handleContainer}>
            <Typography variant='h1' className={classes.handleText}>{props.handle}</Typography>
            {props.statistics &&
              <Typography variant='body1' className={classes.raveCount}>{props.statistics}</Typography>
            }
          </Grid>
        </Grid>
        {largeScreen &&
          <PaddedDivider />
        }
      </Grid>
    </Grid>
  );
}

export default ChannelTitle;
