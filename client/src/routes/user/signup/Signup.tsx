/**
 * Login.tsx
 * Login route component.
 */

// Modules.
import AccessType from '../../../components/user/accessType/AccessType';
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import API from '../../../utils/api/Api.model';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { Helmet } from 'react-helmet';
import * as React from 'react';
import StyledButton from '../../../components/elements/buttons/StyledButton';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import SignupForm from '../../../components/user/signupForm/SignupForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import { Invitation } from '../../../components/invitation/invitation.interface';
import {
  SignupProps,
  ValidateInvitationResponse
} from './Signup.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ctaButton: {
      marginTop: theme.spacing(3)
    },
    ctaWrapper: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(4),
      padding: theme.spacing(0, 2),
      textAlign: 'center'
    },
    ctaWrapperDesktop: {
      padding: theme.spacing(6, 2),
    },
    loading: {
      height: 'calc(90vh)'
    },
    loadingBox: {
      height: 'calc(90vh)'
    },
    loadingContainer: {
      textAlign: 'center'
    },
    paragraph: {
      margin: theme.spacing(2, 0)
    }
  })
);

/**
 * Signup component.
 */
const Signup: React.FC<SignupProps> = (props: SignupProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  // Create a load state for the signup form.
  const [valid, setValid] = React.useState<boolean>(false);

  const [invitationId, setInvitationId] = React.useState<string>('');

  const [invitation, setInvitaiton] = React.useState<Invitation>({
    _id: '',
    email: '',
    invitedBy: ''
  });

  const [errorMessage, setErrorMessage] = React.useState<string>('');

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: props.location.pathname,
          title: 'Sign up'
        }
      });
      setPageViewed(true);
    }

    // Set the invitation link if it has changed.
    if (props.match.params.invitation !== invitationId) {
      setInvitationId(props.match.params.invitation);
      validateInvitation(props.match.params.invitation);
    }
  }, [
    pageViewed,
    props.location.pathname,
    invitationId,
    props.match.params.invitation
  ]);

  /**
   * Performs a request to check if an invitation is valid.
   */
  const validateInvitation: (
    invitationId: string
  ) => void = (
    invitationId: string
  ): void => {
    API.requestAPI<ValidateInvitationResponse>(`invitation/${invitationId}`, {
      method: 'GET'
    })
    .then((response: ValidateInvitationResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setErrorMessage(response.title);
        return;
      } else {
        setInvitaiton(response.invitation);
        setValid(true);
        setErrorMessage('');
      }
    })
    .catch((error: Error) => {
      setErrorMessage(`We couldn't validate your invitation`);
    });
  }

  /**
   * Redirect to join waitlist.
   */
  const redirectToWaitlist: (
  ) => void = (
  ): void => {
    props.history.push('/apply');
  }

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
      >
        <Helmet>
          <title>Sign up to ravebox - ravebox</title>
          <meta name='description' content={`Create an account on Ravebox to share your video reviews of products and experiences.`} />
          <link rel='canonical' href='https://ravebox.io/about' />
        </Helmet>
        {valid ? (
          <React.Fragment>
            <PageTitle title='Sign up to Ravebox' />
            <SignupForm invitation={invitation}/>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {errorMessage ? (
              <React.Fragment>
                <Grid container direction='column' className={clsx(classes.ctaWrapper, {
                    [classes.ctaWrapperDesktop]: largeScreen
                  })}
                >
                  <Grid item xs={12}>
                    <Typography variant='h2'>
                      {errorMessage}
                    </Typography>
                    <Typography variant='body1' className={clsx(classes.paragraph)}>
                      If you believe there is a problem with your invitation, contact us and we'll help you sort it out. 
                    </Typography>
                    <Typography variant='body1' className={clsx(classes.paragraph)}>
                      If you don't have an invitaiton, what are you waiting for? Join our waitlist!
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction='column' alignItems='center' className={classes.ctaButton}>
                      <Grid item xs={12}>
                        <StyledButton
                          color='secondary'
                          clickAction={redirectToWaitlist}
                          submitting={false}
                          title='Join waitlist'
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ): (
              <Grid item xs={12} className={clsx(classes.loadingContainer)}>
                <Box className={clsx(classes.loadingBox)}>
                  <Grid
                    alignItems='center'
                    className={clsx(classes.loading)}
                    container
                    direction='row'
                  >
                    <Grid item xs={12}>
                      <CircularProgress />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}
          </React.Fragment>
        )}
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: SignupProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(Signup));
