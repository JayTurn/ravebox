/**
 * FollowButton.tsx
 * Follow button component user for subscribing to channels and products.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Popover from '@material-ui/core/Popover';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';
import { useFollow } from '../useFollow.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { FollowButtonProps } from './FollowButton.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Follow button styles.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
  },
  popoverActionContainer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1)
  },
  popoverActionButtonContainer: {
    justifyContent: 'space-between'
  },
  popoverButton: {
  },
  popoverContainer: {
  },
  popoverPadding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  popoverTextContainer: {
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2)
  },
  popoverTitle: {
    fontSize: '1.15rem'
  },
  popoverText: {
    fontSize: '.9rem'
  }
}));

/**
 * Follow button component.
 */
const FollowButton: React.FC<FollowButtonProps> = (props: FollowButtonProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Use the custom styles.
  const classes = useStyles();

  // Initialize the follow hook.
  const {
    following,
    setFollowing,
    submitting,
    updateFollowState
  } = useFollow({
    id: props.id,
    followType: props.followType,
    profile: props.profile,
    updateProfile: props.update
  });

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [open, setOpen] = React.useState<boolean>(false);

  /**
   * Handles the authenticated access to the follow button.
   */
  const handleFollow: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // Capture the current follow state before we update.
    const follow: boolean = !following;

    if (props.profile) {

      // Update the follow state.
      updateFollowState();

      // Record the follow event.
      trackFollow(follow)(true);

    } else {
      // Trigger the display of the minimum duration message.
      setAnchorEl(e.currentTarget);
      setOpen(true);
      trackFollow(follow)(false);
    }
  };

  /**
   * Handles the closing of the popover message.
   */
  const handlePopoverClose: (
  ) => void = (
  ): void => {
    setOpen(false);
    setAnchorEl(null)
  }

  /**
   * Handles the navigation to the log in screen.
   */
  const navigateToLogin: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    props.history.push('/user/login');
    setOpen(false);
    setAnchorEl(null)
  }

  /**
   * Tracks the follow event.
   */
  const trackFollow: (
    follow: boolean
  ) => (
    authenticated: boolean
  ) => void = (
    follow: boolean
  ) => (
    authenticated: boolean
  ): void => {
    const data: EventObject = {
      'reviewer handle': props.handle,
      'reviewer id': props.id
    };

    if (authenticated) {
      if (follow) {
        analytics.trackEvent('follow reviewer')(data);  
      } else {
        analytics.trackEvent('unfollow reviewer')(data);  
      }
    } else {
      analytics.trackEvent('attempted follow reviewer')(data);  
    }
  }

  return (
    <Box>
      <StyledButton
        title={following ? 'Following' : 'Follow'}
        clickAction={handleFollow}
        submitting={submitting}
        variant={following ? 'outlined' : 'contained'}
      />
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        className={clsx(classes.popoverContainer)}
        open={open} 
        onClose={handlePopoverClose}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <Grid container direction='column'>
          <Grid item className={clsx(
              classes.popoverPadding,
              classes.popoverTextContainer
            )}
          >
            <Typography variant='h2' className={clsx(classes.popoverTitle)}>
              Want to follow {props.handle}?
            </Typography>
            <Typography variant='body1' component='p' className={clsx(classes.popoverText)}>
              Before you can follow a raver, you must be logged in.
            </Typography>
          </Grid>
          <Grid item className={clsx(
              classes.popoverPadding,
              classes.popoverActionContainer
            )}
          >
            <Grid
              container
              direction='row'
              className={clsx(
                classes.popoverActionButtonContainer
              )}
            >
              <Grid item>
                <Button
                  color='primary'
                  disableElevation
                  onClick={navigateToLogin}
                  size='small'
                  title='Log in'
                  variant='contained'
                >
                  Log in
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color='primary'
                  disableElevation
                  onClick={handlePopoverClose}
                  size='small'
                  title='Close'
                  variant='outlined'
                >
                  Close
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </Box>
  );
};

/**
 * Map dispatch actions to the login dialog.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      update: update
    },
    dispatch
  );

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: FollowButtonProps) {
  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile
  };
}

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(FollowButton)
);
