/**
 * TabMenu.tsx
 * TabMenu component.
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

// Actions.
import {
  updateActiveCategory,
  updateCategoryList
} from '../../../store/raveStream/Actions';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import {
  TabMenuProps,
  TabMenuItem
} from './TabMenu.interface';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main
  },
  root: {
    boxShadow: `0 -2px 0 ${theme.palette.background.paper}, 0 1px 3px rgba(100, 106, 240, .25)`,
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(1)
  }
}))(Tabs);

// Override the admin tabs.
const StyledTabsDesktop = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.main
  },
  root: {
    boxShadow: `inset 0 -2px 0 rgba(100, 106, 240, .1)`
  }
}))(Tabs);

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
    },
    tab: {
      float: 'left',
    },
    tabContainer: {
    },
    tabMenu: {
      //boxShadow: `0 1px 3px rgba(67, 74, 217, .25)`,
    },
    tabPanel: {
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
 * Renders the tabs for category streams.
 */
const TabMenu: React.FC<TabMenuProps> = (props: TabMenuProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));
        

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

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
    if (value === props.activeIndex) {
      return;
    }

    if (props.updateActiveTab) {
      props.updateActiveTab(value);
    }
  }

  return (
    <Grid container className={clsx(classes.container)}>
      {props.tabItems && props.tabItems.length > 0 &&
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} className={classes.tabMenu}>
                {largeScreen ? (
                  <StyledTabsDesktop
                    value={props.activeIndex}
                  >
                    {props.tabItems.map((tabMenuItem: TabMenuItem, index: number) => (
                      <Tab
                        disableRipple
                        id={`tab-item-${index}`}
                        key={index}
                        label={tabMenuItem.title}
                        onClick={(e: React.SyntheticEvent) => 
                          handleTabSwitch(index)
                        }
                        value={index}
                      />
                    ))}
                  </StyledTabsDesktop>
                ) : (
                  <StyledTabs
                    value={props.activeIndex}
                  >
                    {props.tabItems.map((tabMenuItem: TabMenuItem, index: number) => (
                      <Tab
                        disableRipple
                        id={`tab-item-${index}`}
                        key={index}
                        label={tabMenuItem.title}
                        onClick={(e: React.SyntheticEvent) => 
                          handleTabSwitch(index)
                        }
                        value={index}
                      />
                    ))}
                  </StyledTabs>
                )}
            </Grid>
          </Grid>
        </Grid>
      }  
    </Grid>
  );
}

export default TabMenu;
