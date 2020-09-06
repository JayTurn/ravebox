/**
 * Account.tsx
 * Account route component.
 */

// Dependent modules.
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
  styled,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  withRouter
} from 'react-router';

// Components.
import ContactSettings from '../../../components/user/settings/contactSettings/ContactSettings';
import ProfileSettings from '../../../components/user/settings/profileSettings/ProfileSettings';
import SecuritySettings from '../../../components/user/settings/securitySettings/SecuritySettings';
import Settings from '../../../components/user/settings/Settings';

// Enumerators.
import { SettingsScreen } from '../../../components/user/settings/Settings.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import {
  AccountProps,
} from './Account.interface';
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';

const AccessTabs = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.secondary.main}`
  }
}))(Tabs);

/**
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(0, 2),
    marginBottom: theme.spacing(2)
  },
  desktopContainer: {
    marginBottom: theme.spacing(3)
  },
  formContainer: {
    marginTop: theme.spacing(4)
  },
  titleContainer: {
    margin: theme.spacing(3, 0, 2)
  }
}));

/**
 * Returns the search query parameters.
 *
 * @return URLSearchParams
 */
const getQueryParams: (
) => URLSearchParams = (
): URLSearchParams => {
  return new URLSearchParams(useLocation().search);
}

/**
 * Matches the query parameter with the setting enumerator.
 *
 * @param { SettingsScreen } selected - the selected settings screen.
 */
const selectedScreen: (
  selected: string | null
) => SettingsScreen = (
  selected: string | null
): SettingsScreen => {
  let settingsScreen: SettingsScreen = SettingsScreen.PROFILE;

  switch (selected) {
    case SettingsScreen.CONTACT: 
      settingsScreen = SettingsScreen.CONTACT;
      break;
    case SettingsScreen.SECURITY: 
      settingsScreen = SettingsScreen.SECURITY;
      break;
    default:
  }

  return settingsScreen;
}

/**
 * Account component.
 */
const Account: React.FC<AccountProps> = (props: AccountProps) => {
  // Define the theme and classes.
  const theme = useTheme(),
        classes = useStyles();

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  // Get the search parameters from the url.
  const searchParams: URLSearchParams = getQueryParams();

  // Define the selected settings screen.
  const [selectedSetting, setSelectedSetting] = React.useState<SettingsScreen>(selectedScreen(searchParams.get('settings')));

  // Match the small media query size.
  const largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  /**
   * Navigates to the selected screen based on the chosen option.
   *
   * @param { SettingsScreen } selected - the selected screen.
   */
  const navigate: (
    selected: SettingsScreen
  ) => void = (
    selected: SettingsScreen
  ): void => {
    setSelectedSetting(selected);

    // Update the query in the url.
    props.history.push(`/account?settings=${selected}`);
  }

  /**
   * Set the reviews based on their sub-category groupings.
   */
  React.useEffect(() => {
    // Track the category list page view.
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: props.location.pathname,
          title: 'Account settings'
        }
      });
      setPageViewed(true);
    }

  }, [pageViewed]);


  return (
    <div style={{flexGrow: 1, marginTop: '3rem' }}>
      <Grid
        container
        direction='column'
        justify='flex-start'
      >
        <Helmet>
          <title>Account settings - Ravebox</title>
          <link rel='canonical' href='https://ravebox.io/account' />
        </Helmet>
        <AccessTabs
          value={selectedSetting}
          variant={largeScreen ? 'standard' : 'fullWidth'}
        >
          <Tab
            disableRipple
            label={'Profile'}
            onClick={(e: React.SyntheticEvent) => {
              navigate(SettingsScreen.PROFILE)
            }}
            value={SettingsScreen.PROFILE}
          />
          <Tab
            disableRipple
            label={'Contact details'}
            onClick={(e: React.SyntheticEvent) => {
              navigate(SettingsScreen.CONTACT)
            }}
            value={SettingsScreen.CONTACT}
          />
          <Tab
            disableRipple
            label={'Security'}
            onClick={(e: React.SyntheticEvent) => {
              navigate(SettingsScreen.SECURITY)
            }}
            value={SettingsScreen.SECURITY}
          />
        </AccessTabs>
        <Grid item xs={12} className={clsx(classes.formContainer)}>
          {selectedSetting === SettingsScreen.PROFILE &&
              <ProfileSettings />  
          }
          {selectedSetting === SettingsScreen.CONTACT &&
              <ContactSettings />
          }
          {selectedSetting === SettingsScreen.SECURITY &&
              <SecuritySettings />
          }
        </Grid>
      </Grid>
    </div>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: {}, ownProps: AccountProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
  mapStatetoProps
)(Account));
