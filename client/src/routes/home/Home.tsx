/**
 * Home.tsx
 * Home screen route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import API from '../../utils/api/Api.model';
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
import Divider from '@material-ui/core/Divider';
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import LinkElement from '../../components/elements/link/Link';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  updateCategoryList,
} from '../../store/raveStream/Actions';

// Components.
import CategoryStreamTabMenu from '../../components/raveStream/categoryTabMenu/CategoryTabMenu';
import CategoryTabs from '../../components/raveStream/categoryTabs/CategoryTabs';
import ContentBlock from '../../components/elements/contentBlock/ContentBlock';
import DesktopCardHolder from '../../components/desktopStream/cardHolder/DesktopCardHolder'
import Logo from '../../components/logo/Logo';
import LoadingRaveStream from '../../components/placeholders/loadingRaveStream/LoadingRaveStream';
import SwipeCardHolder from '../../components/swipeStream/cardHolder/SwipeCardHolder';

// Enumerators.
import { ColorStyle } from '../../components/elements/contentBlock/ContentBlock.enum';
import { LogoColor } from '../../components/logo/Logo.enum';
import { RaveStreamType } from '../../components/raveStream/RaveStream.enum';
import { RequestType } from '../../utils/api/Api.enum';
import { StyleType } from '../../components/elements/link/Link.enum';
import { ViewState } from '../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../components/analytics/Analytics.provider';
import {
  useRetrieveRaveStreamByList
} from '../../components/raveStream/useRetrieveRaveStreamsByList.hook';
import {
  useRetrieveRaveStreamCategoryList
} from '../../components/raveStream/useRetrieveRaveStreamsCategoryList.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';
import { HomeProps } from './Home.interface';
import {
  RaveStream,
  RaveStreamCategoryList,
  RaveStreamCategoryListResponse,
  RaveStreamListItem
} from '../../components/raveStream/RaveStream.interface';

// Utilities.
import {
  getHomeStreamList
} from '../../components/raveStream/RaveStream.common';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    aboutContainer: {
      backgroundColor: theme.palette.secondary.dark,
      padding: theme.spacing(6, 4),
    },
    aboutContainerLarge: {
      padding: theme.spacing(8, 4, 12)
    },
    aboutText: {
      color: theme.palette.common.white,
      fontSize: '1.8rem',
      fontWeight: 400,
      marginBottom: theme.spacing(6),
      marginTop: theme.spacing(0),
      textAlign: 'center',
      textShadow: `0 1px 1px rgba(0,32,27,0.2)`
    },
    aboutTextLarge: {
      fontSize: '2.5rem',
      marginTop: theme.spacing(6),
    },
    cardBackground: {
      backgroundColor: theme.palette.background.paper,
      //backgroundColor: '#f4f4f4',
      '&:first-child': {
        paddingTop: theme.spacing(.5)
      },
      '&:last-child': {
        paddingBottom: theme.spacing(.5)
      }
    },
    categoryMenuContainer: {
      backgroundColor: theme.palette.background.paper
    },
    categoryMenuContainerLarge: {
      padding: theme.spacing(0, 2)
    },
    container: {
    },
    containerLarge: {
    },
    containerPadding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    divider: {
      color: 'rgba(200, 200, 200)',
      margin: theme.spacing(0, 2, 0),
      width: 'calc(100% - 32px)'
    },
    heavy: {
      fontWeight: 700
    },
    introContainer: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(4, 4, 0),
    },
    introContainerLarge: {
      padding: theme.spacing(6, 4, 0)
    },
    introText: {
      color: theme.palette.text.secondary,
      fontSize: '1.6rem',
      fontWeight: 300,
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    introTextLarge: {
      fontSize: '2.5rem',
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
    },
    spaceAbove: {
      paddingTop: theme.spacing(.5)
    },
    spaceBelow: {
      paddingBottom: theme.spacing(.5)
    },
    tempCategorySmall: {
      marginBottom: theme.spacing(-2.5)
    }
  })
);

/**
 * Loads the home content from the api for server side rendering.
 * 
 * @param { HomeProps } props - the home properties.
 */
const frontloadHome = async (props: HomeProps) => {
  // Capture the category queries to.
  const list: Array<RaveStreamListItem> = getHomeStreamList(); 

  // Perform the API request to get the review group.
  await API.requestAPI<RaveStreamCategoryListResponse>('/stream/category_list', {
    method: RequestType.GET
  })
  .then((response: RaveStreamCategoryListResponse) => {
    if (response.raveStreams && props.updateCategoryList) {
      props.updateCategoryList(response.raveStreams);
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};

/**
 * Home route component.
 */
const Home: React.FC<HomeProps> = (props: HomeProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm')),
        list: Array<RaveStreamListItem> = getHomeStreamList(); 

  const {
    raveStreamsStatus
  } = useRetrieveRaveStreamCategoryList({
    name: 'home',
    updateList: props.updateCategoryList,
    existing: props.categoryList
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * On updates, check if we need to track the page view.
   */
  React.useEffect(() => {
    if (!pageViewed) {
      analytics.trackPageView({
        properties: {
          path: `${props.location.pathname}${props.location.search}`,
          title: 'Home'
        },
        amplitude: {
          label: 'view home'
        }
      });
      setPageViewed(true);
    }
  }, [pageViewed]);

  /**
   * Render the home route component.
   */
  return (
    <Grid
      className={clsx(classes.container, {
        [classes.containerLarge]: largeScreen
      })}
      container
    >
      {raveStreamsStatus === ViewState.WAITING &&
        <React.Fragment>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
          <Grid item xs={12} sm={6} md={3} className={clsx(
            classes.cardBackground
          )}>
            <LoadingRaveStream />
          </Grid>
        </React.Fragment>
      }
      {raveStreamsStatus === ViewState.FOUND &&
        <React.Fragment>
          <Grid item xs={12} className={clsx(
              classes.introContainer,
              {
                [classes.introContainerLarge]: largeScreen
              }
            )}
          >
            <Grid
              container
              direction='column'
              alignItems='center'
            >
              <Grid item xs={12}>
                <Logo
                  color={LogoColor.MAIN}
                  fullWidth={largeScreen ? '170px' : '100px'}
                  iconOnly={false}
                  stacked={true}
                /> 
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h1' className={clsx(
                    classes.introText,
                    {
                      [classes.introTextLarge]: largeScreen
                    }
                  )}
                >
                  Where it's ok to talk about products.
                </Typography>
              </Grid>
              {/*
              <Grid item xs={12}>
                <LinkElement
                  path={'/about'}
                  styleType={StyleType.BUTTON_PRIMARY}
                  title='Tell me more'
                  track={{
                    context: 'home',
                    targetScreen: 'about'
                  }}
                />
              </Grid>
              */}
            </Grid>
          </Grid>
          <Grid item xs={12} className={clsx(
            classes.categoryMenuContainer, {
              [classes.categoryMenuContainerLarge]: largeScreen
            }
          )}>
            <CategoryStreamTabMenu />
          </Grid>
          <CategoryTabs />
        </React.Fragment>
      }
      {/*
      <ContentBlock
        background={ColorStyle.SECONDARY}
        title={
          <React.Fragment>
            <Box component='span' className={clsx(
              classes.heavy
            )}>Where it's ok to talk about products.</Box>
          </React.Fragment>
        }
        bodyFirst={
          <React.Fragment>
            Keep all of your product conversations and recommendations in one place.
          </React.Fragment>
        }
        bodySecond={
          <React.Fragment>
            <Box component='span' className={clsx(
              classes.heavy
            )}>...Where people want to hear about them.</Box>
          </React.Fragment>
        }
        action={{
          path: '/apply',
          title: 'Join waitlist',
          track: {
            context: 'home',
            targetScreen: 'join waitlist',
          }
        }}
      />
      */}
    {/*<Grid item xs={12} className={clsx(
          classes.aboutContainer,
          {
            [classes.aboutContainerLarge]: largeScreen
          }
        )}
      >
        <Grid
          container
          direction='column'
          alignItems='center'
        >
          <Grid item xs={12} md={9}>
            <Typography variant='h2' className={clsx(
                classes.aboutText,
                {
                  [classes.aboutTextLarge]: largeScreen
                }
              )}
            >
              A way to discover products and share your experiences with the world.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinkElement
              path={'/about'}
              styleType={StyleType.BUTTON_SECONDARY_INVERSE}
              title='About ravebox'
            />
          </Grid>
        </Grid>
      </Grid>*/}
      {/*
        if (index < 2) {
          return;
        }
        if (!props.categoryGroup || !props.categoryGroup[queries[index]]) {
          return;
        }

        return (
          <Grid item xs={12} key={query}>
            <ListByQuery
              context={ScreenContext.HOME}
              listType={ReviewListType.CATEGORY}
              presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
              reviews={props.categoryGroup[queries[index]]}
              title={
                <ListTitle
                  presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
                  title={`${categoryList[index].label} raves`}
                  url={`/categories/${categoryList[index].key}`}
                />
              }
            />
          </Grid>
        );
        */}
    </Grid>
  );
}

/**
 * Map the api image configuration state to the properties.
 *
 */
function mapStatetoProps(state: any, ownProps: HomeProps) {
  const categoryList: Array<RaveStreamCategoryList> = state.raveStream ? state.raveStream.categoryList : [];
  return {
    ...ownProps,
    categoryList: categoryList 
  };
}

/**
 * Map dispatch actions to the home route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateCategoryList,
    },
    dispatch
  );

export default withRouter(connect(
    mapStatetoProps,
    mapDispatchToProps
)(frontloadConnect(
  frontloadHome, {
    noServerRender: false,
    onMount: true,
    onUpdate: false
  }
)(Home)
));
