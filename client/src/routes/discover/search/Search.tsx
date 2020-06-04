/**
 * Search.tsx
 * Discover search results route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
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
import { Helmet } from 'react-helmet';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { updateGroups } from '../../../store/discover/Actions';

// Components.
import PageTitle from '../../../components/elements/pageTitle/PageTitle';
import ListByQuery from '../../../components/review/listByQuery/ListByQuery';
import ListTitle from '../../../components/elements/listTitle/ListTitle';
import LoadingReviewList from '../../../components/placeholders/loadingReviewList/LoadingReviewList';
import ProductPreview from '../../../components/product/preview/ProductPreview';
import StyledButton from '../../../components/elements/buttons/StyledButton';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import {
  PresentationType,
  ReviewListType
} from '../../../components/review/listByQuery/ListByQuery.enum';
import { ScreenContext } from '../../../components/review/Review.enum';
import { StyleType } from '../../../components/elements/link/Link.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import {
  useRetrieveDiscoverGroups
} from '../../../components/discover/useRetrieveDiscoverGroups.hook';

// Interfaces.
import { AnalyticsContextProps } from '../../../components/analytics/Analytics.interface';
import {
  DiscoverGroup,
  DiscoverProductGroup,
  DiscoverGroupsResponse,
  DiscoverSubGroup
} from '../../../components/discover/Discover.interface';
import {
  Review,
  ReviewList
} from '../../../components/review/Review.interface';
import { SearchProps } from './Search.interface';

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ctaButton: {
      marginTop: theme.spacing(3)
    },
    ctaWrapper: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2),
      padding: theme.spacing(0, 1),
      textAlign: 'center'
    },
    ctaWrapperDesktop: {
      padding: theme.spacing(6, 2),
    },
    listContainer: {
      padding: 0
    },
    listContainerLarge: {
      padding: theme.spacing(0, 2)
    }
  })
);

/**
 * Loads the search results from the api before rendering.
 * 
 * @param { SearchResultsProps } props - the search results properties.
 */
const frontloadReviewDetails = async (props: SearchProps) => {

  // Format the api request path.
  const {
    term,
  } = {...props.match.params};

  // Perform the request to the discover routes.
  await API.requestAPI<DiscoverGroupsResponse>(`search/discover/${term}`, {
    method: RequestType.GET
  })
  .then((response: DiscoverGroupsResponse) => {
    if (response.groups) {
      if (props.updateGroups) {
        props.updateGroups([...response.groups]);
      }
    }
  })
  .catch((error: Error) => {
    console.log(error);
  });
};

/**
 * Route to request and render search results.
 *
 * @param { SearchProps } props - the search properties.
 */
const Search: React.FC<SearchProps> = (props: SearchProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  const groups: Array<DiscoverGroup> | undefined = props.discoverGroups && props.discoverGroups.length > 0 ?
    props.discoverGroups : undefined;

  // Invoke the discover groups hook to perform requests and set content.
  const {
    lists,
    loading,
    retrievalStatus
  } = useRetrieveDiscoverGroups({
    existing: [...props.discoverGroups || []],
    term: props.match.params.term,
    updateGroups: props.updateGroups
  });

  // Create a page viewed state to avoid duplicate views.
  const [pageViewed, setPageViewed] = React.useState<boolean>(false);

  /**
   * On updates, check if we need to track the page view.
   */
  React.useEffect(() => {
    if (!pageViewed && lists && lists.length > 0) {
      // Count the number of results.
      let resultCount: number = 0;

      for (let i = 0; i < lists.length;i++) {
        resultCount += lists[i].reviews.length;
      }

      analytics.trackPageView({
        properties: {
          path: props.location.pathname,
          title: 'Search'
        },
        data: {
          'term': props.match.params.term,
          'result count': resultCount
        },
        amplitude: {
          label: 'view search results'
        }
      });

      setPageViewed(true);
    }
  }, [pageViewed, props, lists, retrievalStatus]);

  /**
   * Navigates to the discover screen.
   */
  const navigateToAlternative: (
  ) => void = (
  ): void => {
    props.history.push('/discover');
  }

  return (
    <Grid container direction='column' key={props.match.params.term}>
      <Helmet>
        <title>Search for reviews - Ravebox</title>
      </Helmet>
      {loading ? (
        <Grid item xs={12}>
          <LoadingReviewList presentationType={PresentationType.GRID} />  
        </Grid>
      ) : (
        <React.Fragment>
          {lists && lists.length > 0 ? (
            <React.Fragment> 
              {lists.map((list: ReviewList) => {
                return (
                  <Grid item key={list.id} xs={12}>
                    <ListByQuery
                      context={ScreenContext.SEARCH}
                      listType={ReviewListType.CATEGORY}
                      presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
                      reviews={[...list.reviews]}
                      title={
                        <ListTitle
                          title={`${list.title} raves`}
                          url={list.url}
                          presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
                        />
                      }
                    />
                  </Grid>
                )
              })}
            </React.Fragment>
          ) : (
            <Grid container direction='column' className={clsx(classes.ctaWrapper, { 
                [classes.ctaWrapperDesktop]: largeScreen
              })}
            >
              <Grid item xs={12}>
                <Typography variant='h2'>
                  It seems we don't have exactly what you're looking for 
                </Typography>
                <Typography variant='body1'>
                  You can visit the discover screen to find all of our raves listed by their categories or try searching for something else. You never know what you might discover.    
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction='column' alignItems='center' className={classes.ctaButton}>
                  <Grid item xs={12}>
                    <StyledButton
                      color='secondary'
                      clickAction={navigateToAlternative}
                      submitting={false}
                      title='Discover raves'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </React.Fragment>
      )}
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
      updateGroups
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: SearchProps) => {
  // Retrieve the review from the active properties.
  const discoverGroups: Array<DiscoverGroup> = state.discover ? state.discover.groups : undefined;

  return {
    ...ownProps,
    discoverGroups
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(frontloadConnect(
  frontloadReviewDetails,
  {
    noServerRender: false,     
    onMount: true,
    onUpdate: false
  })(Search)
));
