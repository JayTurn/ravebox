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
import TabContainer from '../../tabs/TabContainer/TabContainer';
import TabMenu from '../../tabs/TabMenu/TabMenu';
import UserDescription from '../userDescription/UserDescription';
import UserLinks from '../userLinks/UserLinks';
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
import { PublicProfile } from '../../user/User.interface';
import {
  StreamReviewDetailsProps
} from './StreamReviewDetails.interface';
import { TabMenuItem } from '../../tabs/TabMenu/TabMenu.interface';
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
    card: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
    },
    cardContainer: {
      padding: theme.spacing(1, 1, 0)
    },
    coloredBackground: {
      paddingBottom: theme.spacing(3)
    },
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
    },
    tabContainer: {
    },
    tabPanel: {
      backgroundColor: `rgba(100, 106, 240, .1)`,
      position: 'absolute',
      top: 0,
      transition: 'transform 300ms ease-in-out'
    },
    tabPanelContainer: {
      overflow: 'hidden',
      padding: theme.spacing(1, 0),
      position: 'relative',
      width: '100%'
    },
    tabs: {
      flexWrap: 'nowrap'
    },
    userContainer: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(14, 1, 2)
    }
  })
);

/**
 * Returns a string or number based on the active tab.
 * 
 * @param { number } showing - the index of the current tab showing.
 * @param { number } count - the total number of tabs.
 *
 * @return string
 */
const setVisibleTab: (
  showing: number
) => (
  count: number
) => string = (
  showing: number
) => (
  count: number
): string => {
  let value: number = (100 / count) * showing;

  return `translate3d(calc(-${value}%), 0, 0)`;
};

/**
 * Builds the list of tab menu items.
 *
 * @param { Product } product - the product.
 * @param { RaveStream } raveStream - the rave stream.
 *
 * @return Array<TabMenuItem>
 */
const buildTabMenuItems: (
  user?: PublicProfile
) => Array<TabMenuItem> = (
  user?: PublicProfile
): Array<TabMenuItem> => {

  const menuItems: Array<TabMenuItem> = [{
    title: 'Raves',
    id: 'raves'
  }];

  if (user && (user.about || (user.links && user.links.length > 0))) {
    menuItems.push({
      title: 'About',
      id: 'about'
    });
  }

  return menuItems;
}

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

  const [selectedTab, setSelectedTab] = React.useState<number>(0);


  const [tabHeight, setTabHeight] = React.useState<number>(0);

  const tabMenuItems: Array<TabMenuItem> = buildTabMenuItems(user);

  const tabCount: number = tabMenuItems.length;

  const [userId, setUserId] = React.useState<string>('');

  const [triggerUpdate, setTriggerUpdate] = React.useState<boolean>(false);

  /**
   * Handles switching between tabs.
   *
   * @param { number } index - the selected tab index.
   */
  const handleTabSwitch: (
    value: number
  ) => void = (
    value: number
  ): void => {
    if (value === selectedTab) {
      return;
    }
    setSelectedTab(value);
  }

  /**
   * Updates the table height.
   *
   * @param { number } value - the height to be updated.
   */
  const handleTabHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setTabHeight(value);
  }

  /**
   * Handles triggering a height update from a tab container because a child
   * container has been modified.
   */
  const handleToggleUpdate: (
  ) => void = (
  ): void => {
    setTriggerUpdate(!triggerUpdate);
  }

  /**
   * Update the height on the first load.
   */
  React.useEffect(() => {
    if (user && user._id !== userId) {
      setUserId(user._id);
      setSelectedTab(0);
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
            <Grid item xs={12} className={clsx(classes.userContainer)}>
              <StreamUserProfile
                showFollow={true}
                user={{...user}}
                variant='large'
              />
            </Grid>
            <Grid item xs={12}>
              <TabMenu
                activeIndex={selectedTab}
                tabItems={tabMenuItems}
                updateActiveTab={handleTabSwitch}
              />
            </Grid>
            <Grid item xs={12}>
              <Box
                className={clsx(classes.tabPanelContainer)}
                style={{height: tabHeight}}
              >
                <Box
                  className={clsx(classes.tabPanel)}
                  style={{
                    height: tabHeight,
                    transform: `${setVisibleTab(selectedTab || 0)(tabCount)}`,
                    width: `${100 * tabCount}%`
                  }}
                >
                  <div
                    className={clsx(classes.tab)}
                    style={{width: `${100 / tabCount}%`}}
                  >
                    <TabContainer
                      activeIndex={selectedTab}
                      index={0}
                      updateHeight={handleTabHeightUpdate}
                      toggleUpdate={triggerUpdate}
                    >
                      <UserRaves
                        user={{...user}}
                        updateHeight={handleToggleUpdate}
                      />
                    </TabContainer>
                  </div>
                  <div
                    className={clsx(classes.tab)}
                    style={{width: `${100 / tabCount}%`}}
                  >
                    {user &&
                      <TabContainer
                        activeIndex={selectedTab}
                        index={1}
                        minDesktopHeight={500}
                        updateHeight={handleTabHeightUpdate}
                        toggleUpdate={triggerUpdate}
                      >
                        <Grid
                          justify='flex-start'
                          container
                          className={clsx(classes.coloredBackground)}
                        >
                          {user.about &&
                            <Grid item xs={12} md={6}
                              className={clsx(classes.cardContainer)}
                            >
                              <Grid container className={clsx(classes.card)}>
                                <Grid item xs={12}>
                                  <UserDescription
                                    alignMore='left'
                                    updateHeight={handleToggleUpdate}
                                    user={{...user}}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          }
                          {user.links && user.links.length > 0 && 
                            <Grid item xs={12} md={3}
                              className={clsx(classes.cardContainer)}
                            >
                              <Grid container className={clsx(classes.card)}>
                                <Grid item xs={12}>
                                  <UserLinks
                                    updateHeight={handleToggleUpdate}
                                    user={{...user}}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          }
                        </Grid>
                      </TabContainer>
                    }
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
