/**
 * ProductTabs.tsx
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

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import { Product } from '../Product.interface';
import { ProductTabsProps } from './ProductTabs.interface';
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
      backgroundColor: theme.palette.background.default,
      borderRadius: 20,
      margin: theme.spacing(1)
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
 * Builds the list of tab menu items.
 *
 * @param { Product } product - the product.
 * @param { RaveStream } raveStream - the rave stream.
 *
 * @return Array<TabMenuItem>
 */
const buildTabMenuItems: (
  product: Product
) => (
  raveStream: RaveStream
) => Array<TabMenuItem> = (
  product: Product
) => (
  raveStream: RaveStream
): Array<TabMenuItem> => {
  const menuItems: Array<TabMenuItem> = [];

  if (raveStream.reviews && raveStream.reviews.length > 0) {
    menuItems.push({
      title: 'Raves',
      id: 'raves'
    });
  }

  if (product.description) {
    menuItems.push({
      title: 'Product details',
      id: 'details'
    });
  }

  return menuItems;
}

/**
 * Renders the tabs for category streams.
 */
const ProductTabs: React.FC<ProductTabsProps> = (props: ProductTabsProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const {
    product,
    raveStream
  } = {...props};

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [selectedTab, setSelectedTab] = React.useState<number>(0);

  const [tabHeight, setTabHeight] = React.useState<number>(0);

  const tabCount: number = 3;

  const [triggerUpdate, setTriggerUpdate] = React.useState<boolean>(false);

  const tabMenuItems: Array<TabMenuItem> = buildTabMenuItems(product)(raveStream);

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
      {props.product &&
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
                className={clsx(classes.tabPanel)}
                style={{
                  height: tabHeight,
                  transform: `${setVisibleTab(selectedTab || 0)(tabCount)}`,
                  width: `${100 * 3}%`
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
                    {largeScreen ? (
                      <DesktopCardHolder
                        hideStreamTag={true}
                        hideProductTitles={true}
                        overrideTitle={true}
                        reviews={[...props.raveStream.reviews]}
                        streamType={props.raveStream.streamType}
                        title={'Raves'}
                      />
                    ) : (
                      <SwipeCardHolder
                        title={props.raveStream.title}
                        streamType={props.raveStream.streamType}
                        reviews={[...props.raveStream.reviews]}
                      />
                    )}
                  </TabContainer>
                </div>
                <div
                  className={clsx(classes.tab)}
                  style={{width: `${100 / tabCount}%`}}
                >
                  <TabContainer
                    activeIndex={selectedTab}
                    index={1}
                    updateHeight={handleTabHeightUpdate}
                    toggleUpdate={triggerUpdate}
                  >
                    <React.Fragment>
                      {product.description &&
                        <Grid item xs={12} className={clsx({
                          [classes.descriptionContainerLarge]: largeScreen
                        })}>
                          <Grid container>
                            <Grid item xs={12} md={6} className={clsx(
                              classes.cardContainer
                            )}>
                              <ProductSpecifications
                                description={props.product.description}
                                updateHeight={handleToggleUpdate}
                                website={props.product.website}
                              />
                            </Grid>
                            {product.images && product.images.length > 0 &&
                              <Grid item xs={12} className={clsx({
                                [classes.cardContainer]: largeScreen
                              })}>
                                {largeScreen ? (
                                  <DesktopProductImages 
                                    images={[...product.images]}
                                    md={4}
                                    lg={2}
                                  />
                                ) : (
                                  <ProductImages images={[...product.images]} />
                                )}
                              </Grid>
                            }
                          </Grid>
                        </Grid>
                      }
                    </React.Fragment>
                  </TabContainer>
                </div>
              </Box>
            </Box>
          </Grid>
        </Grid>
      }  
    </React.Fragment>
  );
}

export default ProductTabs;
