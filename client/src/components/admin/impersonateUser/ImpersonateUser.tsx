/**
 * ImpersonateUser.tsx
 * Renders the component to create a new user.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  login,
} from '../../../store/user/Actions';
import { add } from '../../../store/xsrf/Actions';

// Components.
import API from '../../../utils/api/Api.model';
import StyledButton from '../../elements/buttons/StyledButton';

import {
  ImpersonateUserResponse,
  ImpersonateUserProps
} from './ImpersonateUser.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Impersonate styles for the review screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  containerBegin: {
    float: 'right'
  },
  containerEnd: {
    display: 'inline-block'
  },
  end: {
    color: theme.palette.error.main
  },
  begin: {
    color: theme.palette.secondary.main
  }
}));

/**
 * Impersonate user component.
 */
const ImpersonateUser: React.FC<ImpersonateUserProps> = (props: ImpersonateUserProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Define the path for the api request.
  let path: string = 'admin/users/impersonate';

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  /**
   * Submits the user creation form.
   */
  const handleImpersonate: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void> = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    if (props.id) {
      path += `/${props.id}`;
    }

    API.requestAPI<ImpersonateUserResponse>(path, {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: 'GET'
    })
    .then((response: ImpersonateUserResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        return;
      }

      // Remove the admin cookie if we weren't provided an id.
      if (!props.id) {
        const cookies: Cookies = new Cookies();
        cookies.remove('XSRF-TOKEN-ADMIN', {path: '/', domain: '.ravebox.io'});
      }

      if (props.addXsrf && props.login) {
        // Retrieve the xsrf cookie to be set on the header for future requests. 
        const cookies: Cookies = new Cookies();
        const xsrf: string = cookies.get('XSRF-TOKEN');

        if (xsrf) {
          props.addXsrf(xsrf);
          props.login(response.user);
          if (props.id) {
            props.history.push('/account');
          } else {
            props.history.push('/admin/users');
          }
        }
        setSubmitting(false);
      }
    })
    .catch((error: Error) => {
      console.log(error);
      // Present any errors that were returned in the response.
      setSubmitting(false);
    });
  }

  /**
   * Displays the create new account overlay.
   */
  return (
    <Box className={clsx({
      [classes.containerBegin]: props.id,
      [classes.containerEnd]: !props.id
    })}>
      <IconButton
        className={clsx({
          [classes.begin]: props.id,
          [classes.end]: !props.id
        })}
        onClick={handleImpersonate}
        title='Impersonate'
      >
        <PeopleAltRoundedIcon />
      </IconButton>
    </Box>
  );
}

/**
 * Map dispatch actions to the login dialog.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      addXsrf: add,
      login: login
    },
    dispatch
  );

/**
 * Map the profile to the naigation menu.
 *
 */
function mapStateToProps(state: any, ownProps: ImpersonateUserProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  let profile: PrivateProfile | undefined = state.user ? state.user.profile : undefined;

  if (profile && !profile._id) {
    profile = undefined;
  }

  return {
    ...ownProps,
    profile,
    xsrf: xsrfToken
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ImpersonateUser));
