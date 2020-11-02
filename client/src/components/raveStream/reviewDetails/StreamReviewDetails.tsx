/**
 * StreamReviewDetails.tsx
 * ReviewDetails for the stream component.
 */

// Modules.
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

// Enumerators.
import { StreamReviewDetailsSection } from './StreamReviewDetails.enum';

// Components.
import FollowButton from '../../follow/button/FollowButton';
import StreamUserProfile from '../userProfile/StreamUserProfile';
import UserAbout from '../userAbout/UserAbout';
import UserRaves from '../userRaves/UserRaves';

// Enumerators.
import {
  FollowType
} from '../../follow/FollowType.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  StreamReviewDetailsProps
} from './StreamReviewDetails.interface';
import { Review } from '../../review/Review.interface';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main
  },
  root: {
    //borderBottom: `1px solid ${theme.palette.secondary.main}`
  }
}))(Tabs);


/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: theme.palette.background.default,
      height: 'calc(100vh)',
      overflowY: 'auto',
    },
    followContainer: {
      marginTop: theme.spacing(2)
    },
    tab: {
      float: 'left',
      width: 'calc(100% / 2)'
    },
    tabPanel: {
      position: 'absolute',
      top: 0,
      transition: 'transform 300ms ease-in-out',
      width: `200%`
    },
    tabPanelContainer: {
      boxShadow: `inset 0px -1px 3px rgba(100,106,240,.25), inset 0px 1px 1px rgba(100,106,240,.15)`,
      backgroundColor: `rgba(100,106,240, .1)`,
      overflow: 'hidden',
      padding: theme.spacing(1, 0),
      position: 'relative',
      width: '100%'
    },
    tabs: {
      flexWrap: 'nowrap'
    },
    userContainer: {
      //backgroundColor: `rgba(0,0,0,0.04)`,
      padding: theme.spacing(14, 1, 2)
    }
  })
);

/**
 * Returns a string or number based on the active tab.
 *
 * @param { StreamReviewDetailsSection } showing
 *
 * @return string
 */
const setTabSection: (
  showing: StreamReviewDetailsSection
) => string = (
  showing: StreamReviewDetailsSection
): string => {
  let value: number = 0;
  switch (showing) {
    case StreamReviewDetailsSection.RAVES:
      return 'translate3d(0, 0, 0)';
    case StreamReviewDetailsSection.DETAILS:
      value = 100 / 2;
      return `translate3d(calc(-${value}%), 0, 0)`;
    default:
      return 'translate3d(0, 0, 0)';
  }
};

/**
 * Renders the video in the stream.
 */
const StreamReviewDetails: React.FC<StreamReviewDetailsProps> = (props: StreamReviewDetailsProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const { user } = {...props.review};

  const [activeTab, setActiveTab] = React.useState<StreamReviewDetailsSection>(
    StreamReviewDetailsSection.RAVES);

  const [tabHeight, setTabHeight] = React.useState<number>(0);

  const [userId, setUserId] = React.useState<string>('');

  const [raveHeight, setRaveHeight] = React.useState<number | null>(null);
  const [detailsHeight, setDetailsHeight] = React.useState<number | null>(null);

  /**
   * Handles switching between tabs.
   *
   * @param { StreamReviewDetailsSection } value - the selected review section.
   */
  const handleTabSwitch: (
    value: StreamReviewDetailsSection
  ) => void = (
    value: StreamReviewDetailsSection
  ): void => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
    updateTabHeight(value);
  }

  /**
   * Handles updates to the container height.
   *
   * @param { number } - the height to set the container.
   */
  const updateTabHeight: (
    value: StreamReviewDetailsSection
  ) => void = (
    value: StreamReviewDetailsSection
  ): void => {

    switch (value) {
      case StreamReviewDetailsSection.RAVES:
        if (raveHeight) {
          setTabHeight(raveHeight);
        }
        break;
      case StreamReviewDetailsSection.DETAILS:
        if (detailsHeight) {
          setTabHeight(detailsHeight);
        }
        break;
      default:
    }
  }

  /**
   * Handles updating the raves tab height.
   */
  const handleRaveHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setRaveHeight(value);

    if (activeTab === StreamReviewDetailsSection.RAVES) {
      setTabHeight(value);
    }
  }

  /**
   * Handles updating the details tab height.
   */
  const handleAboutHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setDetailsHeight(value);

    if (activeTab === StreamReviewDetailsSection.DETAILS) {
      setTabHeight(value);
    }
  }

  /**
   * Update the height on the first load.
   */
  React.useEffect(() => {
    if (user && user._id !== userId) {
      setUserId(user._id);
      setActiveTab(StreamReviewDetailsSection.RAVES);
    }
  }, [user, userId]);

  return (
    <Grid
      alignItems='stretch'
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        {user &&
          <Grid container>
            <Grid item xs={12}>
              <Grid
                alignItems='center'
                className={classes.userContainer}
                container 
                justify='space-between'
              >
                <Grid item xs={12}>
                    <StreamUserProfile user={user} />
                </Grid>
                <Grid className={clsx(classes.followContainer)} item xs={12}>
                  <FollowButton
                    id={user._id}
                    handle={user.handle}
                    followType={FollowType.CHANNEL}
                  />
                </Grid> 
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <StyledTabs
                  value={activeTab}
                  variant='scrollable'
                >
                  <Tab
                    disableRipple
                    id={`review-section-${StreamReviewDetailsSection.RAVES}`}
                    label='Raves'
                    onClick={(e: React.SyntheticEvent) => 
                      handleTabSwitch(StreamReviewDetailsSection.RAVES)
                    }
                    value={StreamReviewDetailsSection.RAVES}
                  />
                  <Tab
                    disableRipple
                    id={`review-section-${StreamReviewDetailsSection.DETAILS}`}
                    label={`About`}
                    onClick={(e: React.SyntheticEvent) => 
                      handleTabSwitch(StreamReviewDetailsSection.DETAILS)
                    }
                    value={StreamReviewDetailsSection.DETAILS}
                  />
                </StyledTabs>
              </Grid>
              <Box
                className={clsx(classes.tabPanelContainer)}
                style={{height: tabHeight}}
              >
                <Box
                  className={clsx(classes.tabPanel)}
                  style={{
                    height: tabHeight,
                    transform: `${setTabSection(activeTab)}`
                  }}
                >
                  <div
                    className={clsx(classes.tab)}
                  >
                    <UserRaves
                      user={user}
                      updateHeight={handleRaveHeightUpdate}
                    />
                  </div>
                  <div
                    className={clsx(classes.tab)}
                  >
                    <UserAbout
                      updateHeight={handleAboutHeightUpdate}
                      user={user}
                    />
                  </div>
                </Box>
              </Box>
            </Grid>
          </Grid>
        }
      </Grid>
    </Grid>
  );
}

export default StreamReviewDetails;
