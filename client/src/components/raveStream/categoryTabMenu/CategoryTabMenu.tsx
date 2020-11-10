/**
 * CategoryStreamTabMenu.tsx
 * TabMenu for the category streams.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Box from '@material-ui/core/Box';
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

// Components.
import CategoryTab from '../categoryTab/CategoryTab';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import { CategoryStreamTabMenuProps } from './CategoryTabMenu.interface';
import { RaveStreamCategoryList } from '../RaveStream.interface';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.primary.light,
    height: 4
  },
  root: {
    //boxShadow: `inset 0 -2px 0 ${theme.palette.primary.light}`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white
  }
}))(Tabs);

// Override the admin tabs.
const StyledTabsDesktop = withStyles(theme => ({
  indicator: {
    //backgroundColor: `rgba(255,255,255,.5)`,
    backgroundColor: theme.palette.primary.main,
    height: 4
  },
  root: {
    backgroundColor: theme.palette.background.paper,
    //color: theme.palette.common.white
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
const CategoryStreamTabMenu: React.FC<CategoryStreamTabMenuProps> = (props: CategoryStreamTabMenuProps) => {

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

    if (props.updateActiveCategory) {
      props.updateActiveCategory(value);
    }
  }

  return (
    <Grid container className={clsx(classes.container)}>
      {props.categoryList && props.categoryList.length > 0 &&
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={12} className={classes.tabMenu}>
                {largeScreen ? (
                  <StyledTabsDesktop
                    value={props.activeIndex}
                  >
                    {props.categoryList.map((listItem: RaveStreamCategoryList, index: number) => (
                      <Tab
                        disableRipple
                        id={`tab-category-${listItem.url}`}
                        key={listItem.url}
                        label={listItem.title}
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
                    {props.categoryList.map((listItem: RaveStreamCategoryList, index: number) => (
                      <Tab
                        disableRipple
                        id={`tab-category-${listItem.url}`}
                        key={listItem.url}
                        label={listItem.title}
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

/**
 * Map dispatch actions to properties on the product.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateActiveCategory: updateActiveCategory
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: CategoryStreamTabMenuProps) => {
  // Retrieve the current stream from the active properties.
  const categoryList: Array<RaveStreamCategoryList> = state.raveStream ? state.raveStream.categoryList : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.activeCategory : 0;

  return {
    ...ownProps,
    activeIndex,
    categoryList
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryStreamTabMenu);
