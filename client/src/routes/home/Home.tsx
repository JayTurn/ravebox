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
import { frontloadConnect } from 'react-frontload';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import LinkElement from '../../components/elements/link/Link';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  updateList,
} from '../../store/raveStream/Actions';

// Components.
import ContentBlock from '../../components/elements/contentBlock/ContentBlock';
import Logo from '../../components/logo/Logo';
import ListByQuery from '../../components/review/listByQuery/ListByQuery';
import ListTitle from '../../components/elements/listTitle/ListTitle';
import StreamCardHolder from '../../components/raveStream/cardHolder/StreamCardHolder';

// Enumerators.
import { ColorStyle } from '../../components/elements/contentBlock/ContentBlock.enum';
import { LogoColor } from '../../components/logo/Logo.enum';
import {
  PresentationType,
  ReviewListType
} from '../../components/review/listByQuery/ListByQuery.enum';
import {
  QueryPath 
} from '../../components/review/listByQuery/ListByQuery.enum';
import { RequestType } from '../../utils/api/Api.enum';
import { ScreenContext } from '../../components/review/Review.enum';
import { StyleType } from '../../components/elements/link/Link.enum';
import { ViewState } from '../../utils/display/view/ViewState.enum';

// Hooks.
import { useAnalytics } from '../../components/analytics/Analytics.provider';
import {
  useRetrieveRaveStreamByList
} from '../../components/raveStream/useRetrieveRaveStreamsByList.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';
import { HomeProps } from './Home.interface';
import {
  RaveStream,
  RaveStreamList,
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
      backgroundColor: `rgba(100,106,240, .1)`,
      //backgroundColor: '#f4f4f4',
      '&:first-child': {
        paddingTop: theme.spacing(.5)
      },
      '&:last-child': {
        paddingBottom: theme.spacing(.5)
      }
    },
    container: {
    },
    containerPadding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    heavy: {
      fontWeight: 700
    },
    introContainer: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(4, 4, 4),
    },
    introContainerLarge: {
      padding: theme.spacing(8, 4, 12)
    },
    introText: {
      color: theme.palette.text.secondary,
      fontSize: '1.8rem',
      fontWeight: 300,
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    introTextLarge: {
      fontSize: '2.5rem',
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
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

  /*
  // Perform the API request to get the review group.
  await API.requestAPI<RetrieveListByQueryResponse>(QueryPath.CATEGORY, {
    method: RequestType.POST,
    body: JSON.stringify({
      queries: queries
    })
  })
  .then((response: RetrieveListByQueryResponse) => {
    if (response.reviews && props.updateListByCategory) {
      props.updateListByCategory(response.reviews);
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
  */
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
  } = useRetrieveRaveStreamByList({
    queries: list,
    name: 'home',
    updateList: props.updateList
  });

  /*
  const {
    listStatus
  } = useRetrieveListByQuery({
    queries: queries,
    listType: ReviewListType.CATEGORY,
    update: props.updateListByCategory
  });
  */

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
      className={clsx(classes.container)}
      container
    >
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
              fullWidth={largeScreen ? '270px' : '200px'}
              iconOnly={false}
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
              A new way to discover and compare products.
            </Typography>
          </Grid>
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
        </Grid>
      </Grid>
      {raveStreamsStatus === ViewState.WAITING &&
        <Grid item xs={12}>
          Add loading state here...
        </Grid>
      }
      {raveStreamsStatus === ViewState.FOUND &&
        <React.Fragment>
          {props.raveStreamList && props.raveStreamList.raveStreams.length > 0 &&
            <React.Fragment>
              {props.raveStreamList.raveStreams.map((raveStream: RaveStream, index: number) => (
                <Grid item xs={12}
                  className={clsx(
                    classes.cardBackground, {
                      [classes.spaceAbove]: index === 0,
                      [classes.spaceBelow]: props.raveStreamList && index === props.raveStreamList.raveStreams.length - 1  
                    }
                  )}
                  key={index}
                >
                  <StreamCardHolder
                    title={raveStream.title}
                    streamType={raveStream.streamType}
                    reviews={[...raveStream.reviews]}
                  />
                </Grid>
              ))}
            </React.Fragment>
          }
        </React.Fragment>
      }
      {/*
      <Grid item xs={12} className={clsx({
        [classes.tempCategorySmall]: !largeScreen
      })}>
        {props.categoryGroup && props.categoryGroup[queries[0]] &&
          <ListByQuery
            context={ScreenContext.HOME}
            listType={ReviewListType.CATEGORY}
            presentationType={PresentationType.GRID}
            reviews={props.categoryGroup[queries[0]]}
            title={
              <ListTitle
                title={`Featured`}
                url={`/categories/${categoryList[0].key}`}
                presentationType={PresentationType.GRID} 
              />
            }
          />
        }
      </Grid>
      */}
      {/*
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup[queries[0]] &&
          <ListByQuery
            context={ScreenContext.HOME}
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup[queries[0]]}
            title={
              <ListTitle
                title={`${categoryList[0].label} raves`}
                url={`/categories/${categoryList[0].key}`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
      <Grid item xs={12}>
        {props.categoryGroup && props.categoryGroup[queries[1]] &&
          <ListByQuery
            context={ScreenContext.HOME}
            listType={ReviewListType.CATEGORY}
            presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
            reviews={props.categoryGroup[queries[1]]}
            title={
              <ListTitle
                title={`${categoryList[1].label} raves`}
                url={`/categories/${categoryList[1].key}`}
                presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
              />
            }
          />
        }
      </Grid>
      */}
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
  const raveStreamList: RaveStreamList | undefined = state.raveStream ? state.raveStream.raveStreamList : undefined;
  return {
    ...ownProps,
    raveStreamList 
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
      updateList,
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
