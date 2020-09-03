/**
 * Login.tsx
 * Login route component.
 */

// Modules.
import AccessType from '../../../components/user/accessType/AccessType';
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
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import Link from '@material-ui/core/Link';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import LinkElement from '../../../components/elements/link/Link';
import LoginForm from '../../../components/user/loginForm/LoginForm';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { AccessOptions } from '../../../components/user/accessType/AccessType.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  LoginProps,
} from './Login.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      flexWrap: 'nowrap',
      overflowX: 'hidden'
    },
    padding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    paragraph: {
      margin: theme.spacing(2, 0)
    }
  })
);

/**
 * Login component.
 */
const Login: React.FC<LoginProps> = (props: LoginProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: props.location.pathname,
          title: 'Log in'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed]);

  return (
    <div style={{flexGrow: 1}}>
      <Grid
        container
        direction='column'
        className={clsx(classes.container)}
      >
        <Helmet>
          <title>Log in - ravebox</title>
          <meta name='description' content={`Log in to Ravebox and start sharing your video reviews of products and unique experiences.`} />
          <link rel='canonical' href='https://ravebox.io/user/login' />
        </Helmet>
        {/*<AccessType selected={AccessOptions.LOGIN} />*/}
        <PageTitle title='Log in to Ravebox' />
        <LoginForm />
        <Grid container direction='column'>
          <Typography variant='body1' className={clsx(classes.padding, classes.paragraph)}>
            Don't have an account? <LinkElement title='Join the waitlist' path='/apply'/>
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: LoginProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(Login));
