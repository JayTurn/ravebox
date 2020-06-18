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
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Box from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import {
  update,
} from '../../../store/user/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';

// Hooks.
import { useFollow } from '../useFollow.hook';

// Interfaces.
import { FollowButtonProps } from './FollowButton.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Follow button styles.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
  }
}));

/**
 * Follow button component.
 */
const FollowButton: React.FC<FollowButtonProps> = (props: FollowButtonProps) => {

  // Initialize the follow hook.
  const {
    following,
    updateFollowState
  } = useFollow({
    id: props.id,
    followType: props.followType,
    profile: props.profile
  });

  /**
   * Handles the authenticated access to the follow button.
   */
  const handleFollow: (
  ) => void = (
  ): void => {
    if (props.profile) {
      updateFollowState();
    }
  };

  return (
    <Box>
      <StyledButton
        title={following ? 'Following' : 'Follow'}
        clickAction={updateFollowState}
        variant={following ? 'outlined' : 'contained'}
      />
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

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(FollowButton);
