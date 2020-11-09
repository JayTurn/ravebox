/**
 * DesktopStreamTabs.tsx
 * Rave actions for the desktop stream.
 */

// Modules.
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

// Actions.
import {
  updateActive,
  updateProduct
} from '../../../store/raveStream/Actions';

// Components.
import DesktopProductTab from '../productTab/DesktopProductTab';
import DesktopRaveTab from '../raveTab/DesktopRaveTab';
import DesktopSimilarTab from '../similarTab/DesktopSimilarTab';
import SimilarProducts from '../../raveStream/similarProducts/SimilarProducts';

// Enumerators.
import { TabOptions } from './DesktopStreamTabs.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  DesktopStreamTabsProps
} from './DesktopStreamTabs.interface';
import { Product } from '../../product/Product.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

// Override the admin tabs.
const StyledTabs = withStyles(theme => ({
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
      backgroundColor: theme.palette.background.default,
      paddingBottom: theme.spacing(9)
    },
    rateContainer: {
      margin: theme.spacing(0, 2)
    },
    tab: {
      float: 'left',
      width: 'calc(100% / 3)'
    },
    tabContainer: {
    },
    tabPanel: {
      position: 'absolute',
      top: 0,
      transition: 'transform 300ms ease-in-out',
      width: `300%`
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
    titleContainer: {
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
  showing: TabOptions
) => string = (
  showing: TabOptions
): string => {
  let value: number = 0;
  switch (showing) {
    case TabOptions.RAVES:
      return 'translate3d(0, 0, 0)';
    case TabOptions.DETAILS:
      value = 100 / 3;
      return `translate3d(calc(-${value}%), 0, 0)`;
    case TabOptions.SIMILAR:
      value = (100 / 3) * 2;
      return `translate3d(calc(-${value}%), 0, 0)`;
    default:
      return 'translate3d(0, 0, 0)';
  }
};

/**
 * Renders the controller which holds the videos in the stream.
 */
const DesktopStreamTabs: React.FC<DesktopStreamTabsProps> = (props: DesktopStreamTabsProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme();

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  const [activeTab, setActiveTab] = React.useState<TabOptions>(
    TabOptions.RAVES);

  const [tabHeight, setTabHeight] = React.useState<number>(0);

  const [reviewId, setReviewId] = React.useState<string>('');

  const [raveInfoHeight, setRaveInfoHeight] = React.useState<number | null>(null);
  const [productDetailsHeight, setProductDetailsHeight] = React.useState<number | null>(null);
  const [similarProductsHeight, setSimilarProductsHeight] = React.useState<number | null>(null);

  /**
   * Handles switching between tabs.
   *
   * @param { TabOptions } value - the selected tab.
   */
  const handleTabSwitch: (
    value: TabOptions
  ) => void = (
    value: TabOptions
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
    value: TabOptions
  ) => void = (
    value: TabOptions
  ): void => {

    switch (value) {
      case TabOptions.RAVES:
        if (raveInfoHeight) {
          setTabHeight(raveInfoHeight);
        }
        break;
      case TabOptions.DETAILS:
        if (productDetailsHeight) {
          setTabHeight(productDetailsHeight);
        }
        break;
      case TabOptions.SIMILAR:
        if (similarProductsHeight) {
          setTabHeight(similarProductsHeight);
        }
        break;
      default:
    }
  }

  /**
   * Handles updating the rave information height.
   */
  const handleRaveInfoHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setRaveInfoHeight(value);

    if (activeTab === TabOptions.RAVES) {
      setTabHeight(value);
    }
  }

  /**
   * Handles updating the product details height.
   */
  const handleProductDetailsHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setProductDetailsHeight(value);

    if (activeTab === TabOptions.DETAILS) {
      setTabHeight(value);
    }
  }

  /**
   * Handles updating the similar products height.
   */
  const handleSimilarProductsHeightUpdate: (
    value: number
  ) => void = (
    value: number
  ): void => {
    setSimilarProductsHeight(value);

    if (activeTab === TabOptions.SIMILAR) {
      setTabHeight(value);
    }
  }

  /**
   * Update the height on the first load.
   */
  React.useEffect(() => {
    if (props.review && props.review._id !== reviewId) {
      setReviewId(props.review._id);
      setActiveTab(TabOptions.RAVES);
    }
  }, [props.review, reviewId]);

  return (
    <Grid
      className={clsx(classes.container)}
      container
    >
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={12}>
            <StyledTabs
              value={activeTab}
            >
              <Tab
                disableRipple
                id={`tab-section-${TabOptions.RAVES}`}
                label='Rave Details'
                onClick={(e: React.SyntheticEvent) => 
                  handleTabSwitch(TabOptions.RAVES)
                }
                value={TabOptions.RAVES}
              />
              <Tab
                disableRipple
                id={`tab-section-${TabOptions.DETAILS}`}
                label='Product Details'
                onClick={(e: React.SyntheticEvent) => 
                  handleTabSwitch(TabOptions.DETAILS)
                }
                value={TabOptions.DETAILS}
              />
              <Tab
                disableRipple
                id={`product-section-${TabOptions.SIMILAR}`}
                label='Similar products'
                onClick={(e: React.SyntheticEvent) => 
                  handleTabSwitch(TabOptions.SIMILAR)
                }
                value={TabOptions.SIMILAR}
              />
            </StyledTabs>
          </Grid>
        </Grid>
        <Box
          className={clsx(classes.tabPanelContainer)}
          style={{height: tabHeight}}
        >
          <Box
            className={clsx(classes.tabPanel)}
            style={{
              height: tabHeight,
              transform: `${setVisibleTab(activeTab)}`
            }}
          >
            <div
              className={clsx(classes.tab)}
            >
              <DesktopRaveTab
                product={props.product}
                updateHeight={handleRaveInfoHeightUpdate}
              />
            </div>
            <div
              className={clsx(classes.tab)}
            >
              <DesktopProductTab
                updateHeight={handleProductDetailsHeightUpdate}
              />
            </div>
            <div
              className={clsx(classes.tab)}
            >
              <DesktopSimilarTab
                product={props.product}
                updateHeight={handleSimilarProductsHeightUpdate}
              />
            </div>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: DesktopStreamTabsProps) => {
  // Retrieve the current stream from the active properties.
  const raveStream: RaveStream = state.raveStream ? state.raveStream.raveStream : undefined,
        activeIndex: number = state.raveStream ? state.raveStream.active : 0;

  let review: Review | undefined;

  if (raveStream && raveStream.reviews.length > 0) {
    review = {...raveStream.reviews[activeIndex]};
  }

  return {
    ...ownProps,
    activeIndex,
    raveStream,
    review
  };
};

export default connect(
  mapStateToProps,
)(DesktopStreamTabs);
