/**
 * UserTabs.tsx
 * Tabs for the category streams.
 */

// Modules.
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
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import DesktopCardHolder from '../../desktopStream/cardHolder/DesktopCardHolder';
import DesktopProductImages from '../../desktopStream/productImages/DesktopProductImages';
import ProductImages from '../../raveStream/productImages/ProductImages';
import ProductSpecifications from '../../raveStream/productSpecifications/ProductSpecifications';
import SwipeCardHolder from '../../swipeStream/cardHolder/SwipeCardHolder';
import TabContainer from '../../tabs/TabContainer/TabContainer';
import TabMenu from '../../tabs/TabMenu/TabMenu';
import UserDescription from '../../raveStream/userDescription/UserDescription';
import UserLinks from '../../raveStream/userLinks/UserLinks';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import { PublicProfile } from '../User.interface';
import { UserTabsProps } from './UserTabs.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { TabMenuItem } from '../../tabs/TabMenu/TabMenu.interface';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: `rgba(255,255,255,.5)`,
    height: 4
  },
  root: {
    boxShadow: `inset 0 -2px 0 ${theme.palette.primary.main}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  }
}))(Tabs);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardContainer: {
      //backgroundColor: theme.palette.background.default,
      padding: theme.spacing(1)
    },
    card: {
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
    },
    coloredBackground: {
      //background: `rgba(100,106,240, .1)`
      paddingBottom: theme.spacing(3)
    },
    container: {
    },
    descriptionContainerLarge: {
      backgroundColor: `rgba(100, 106, 240, .1)`,
      padding: theme.spacing(1)
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
    tabPanelSwipe: {
      backgroundColor: `rgba(100, 106, 240, .1)`,
    },
    tabPanelContainer: {
      overflow: 'hidden',
      padding: theme.spacing(1, 0),
      position: 'relative',
      width: '100%'
    },
    tabs: {
      flexWrap: 'nowrap'
    }
  })
);


/**
 * Returns a string or number based on the active tab.
 *
 * @param { TabOptions } showing
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
  user: PublicProfile
) => (
  raveStreams?: Array<RaveStream>
) => Array<TabMenuItem> = (
  user: PublicProfile
) => (
  raveStreams?: Array<RaveStream>
): Array<TabMenuItem> => {
  const menuItems: Array<TabMenuItem> = [];

  if (raveStreams && raveStreams.length > 0) {
    menuItems.push({
      title: 'Raves',
      id: 'raves'
    });
  }

  if (user.about || (user.links && user.links.length > 0)) {
    menuItems.push({
      title: 'About',
      id: 'about'
    });
  }

  return menuItems;
}

/**
 * Renders the tabs for category streams.
 */
const UserTabs: React.FC<UserTabsProps> = (props: UserTabsProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    user,
    raveStreams
  } = {...props};

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [selectedTab, setSelectedTab] = React.useState<number>(0);

  const [tabHeight, setTabHeight] = React.useState<number>(0);

  const [triggerUpdate, setTriggerUpdate] = React.useState<boolean>(false);

  const tabMenuItems: Array<TabMenuItem> = buildTabMenuItems(user)(raveStreams);

  const tabCount: number = tabMenuItems.length;

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

  return (
    <React.Fragment>
      {user &&
        <Grid container className={clsx(classes.container)}>
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
                className={clsx(
                  classes.tabPanel, {
                    [classes.tabPanelSwipe]: !largeScreen
                  }
                )}
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
                  {raveStreams && raveStreams.length > 0 &&
                    <TabContainer
                      activeIndex={selectedTab}
                      index={0}
                      updateHeight={handleTabHeightUpdate}
                      toggleUpdate={triggerUpdate}
                    >
                      {raveStreams.map((raveStream: RaveStream, index: number) => {
                        return(
                          <React.Fragment key={index}>
                            {largeScreen ? (
                              <DesktopCardHolder
                                hideStreamTag={true}
                                reviews={[...raveStream.reviews]}
                                streamType={raveStream.streamType}
                                title={raveStream.title}
                              />
                            ) : (
                              <SwipeCardHolder
                                title={raveStream.title}
                                streamType={raveStream.streamType}
                                reviews={[...raveStream.reviews]}
                              />
                            )}
                          </React.Fragment>
                        )
                      })}
                    </TabContainer>
                  }
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
                        <Grid item xs={12} md={6}
                          className={clsx(classes.cardContainer)}
                        >
                          <Grid container className={clsx(classes.card)}>
                            <Grid item xs={12}>
                              <UserDescription
                                alignMore='left'
                                updateHeight={handleToggleUpdate}
                                user={props.user}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={3}
                          className={clsx(classes.cardContainer)}
                        >
                          <Grid container className={clsx(classes.card)}>
                            <Grid item xs={12}>
                              <UserLinks
                                align={largeScreen ? 'center' : 'left'}
                                updateHeight={handleToggleUpdate}
                                user={props.user}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TabContainer>
                  }
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      }  
    </React.Fragment>
  );
}

export default UserTabs;
