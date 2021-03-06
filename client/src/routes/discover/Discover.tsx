/**
 * Discover.tsx
 * Discover screen route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch,
} from 'redux';
import API from '../../utils/api/Api.model';
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
import {
  updateListByCategory,
  updateListByProduct
} from '../../store/review/Actions';

// Components.
import ListByQuery from '../../components/review/listByQuery/ListByQuery';
import ListTitle from '../../components/elements/listTitle/ListTitle';
import PageTitle from '../../components/elements/pageTitle/PageTitle';

// Enumerators.
import {
  PresentationType,
  QueryPath,
  ReviewListType
} from '../../components/review/listByQuery/ListByQuery.enum';
import { RequestType } from '../../utils/api/Api.enum';
import { ScreenContext } from '../../components/review/Review.enum';
import { StyleType } from '../../components/elements/link/Link.enum';

// Hooks.
import {
  useRetrieveListByQuery
} from '../../components/review/listByQuery/useRetrieveListsByQuery.hook';
import { useAnalytics } from '../../components/analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../components/analytics/Analytics.interface';
import { Category, CategoryItem } from '../../components/category/Category.interface';
import { DiscoverProps } from './Discover.interface';
import {
  RetrieveListByQueryResponse
} from '../../components/review/listByQuery/ListByQuery.interface';
import { ReviewGroup } from '../../components/review/Review.interface';

// Utilities.
import { getTopLevelCategories } from '../../utils/structures/Category';

// Retrieve the list of categories.
const categoryList: Array<Category> = require('../../components/category/categories.json').ontology;

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    aboutContainer: {
      backgroundColor: theme.palette.secondary.dark,
      padding: theme.spacing(4, 2, 4),
    },
    aboutContainerLarge: {
      padding: theme.spacing(8, 2, 12)
    },
    aboutText: {
      color: theme.palette.common.white,
      fontSize: '2rem',
      fontWeight: 400,
      marginBottom: theme.spacing(6),
      marginTop: theme.spacing(6),
      textAlign: 'center',
      textShadow: `0 1px 1px rgba(0,32,27,0.2)`
    },
    aboutTextLarge: {
      fontSize: '2.5rem'
    },
    container: {
      maxWidth: '100%',
      overflowX: 'hidden'
    },
    containerPadding: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    },
    introContainer: {
      backgroundColor: theme.palette.common.white,
      padding: theme.spacing(4, 2, 4),
    },
    introContainerLarge: {
      padding: theme.spacing(8, 2, 12)
    },
    introText: {
      color: theme.palette.text.secondary,
      fontSize: '2rem',
      fontWeight: 300,
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      textAlign: 'center'
    },
    introTextLarge: {
      fontSize: '2.5rem'
    }
  })
);

/**
 * Loads the discover content from the api for server side rendering.
 * 
 * @param { HomeProps } props - the home properties.
 */
const frontloadDiscover = async (props: DiscoverProps) => {
  // Capture the category queries to.
  const queries: Array<string> = getTopLevelCategories(categoryList); 

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
};

/**
 * Discover route component.
 */
const Discover: React.FC<DiscoverProps> = (props: DiscoverProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm')),
        queries: Array<string> = getTopLevelCategories(categoryList); 

  const {
    listStatus
  } = useRetrieveListByQuery({
    queries: queries,
    listType: ReviewListType.CATEGORY,
    update: props.updateListByCategory
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
          title: 'Discover'
        },
        amplitude: {
          label: 'view discover'
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
      direction='column'
    >
      <Helmet>
        <title>Discover reviews - Ravebox</title>
        <meta name='description' content={`Discover authentic reviews for ${categoryList[0].label}, ${categoryList[1].label.replace('&', 'and')}, ${categoryList[2].label} and ${categoryList[3].label}, shared by everday people with real product experiences.`} />
        <link rel='canonical' href='https://ravebox.io/discover' />
      </Helmet>
      <PageTitle title='Discover raves' />
      {props.categoryGroup &&
        <Grid item xs={12}>
          {
            queries.map((query: string, index: number) => {
              return (
                <React.Fragment key={query}>
                  {props.categoryGroup && props.categoryGroup[query] &&
                    <ListByQuery
                      context={ScreenContext.DISCOVER}
                      listType={ReviewListType.CATEGORY}
                      presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE}
                      reviews={props.categoryGroup[query]}
                      title={
                        <ListTitle
                          title={categoryList[index].label}
                          url={`/categories/${query}`}
                          presentationType={largeScreen ? PresentationType.GRID : PresentationType.SCROLLABLE} 
                        />
                      }
                    />
                  }
                </React.Fragment>
              )
            })
          }
        </Grid>
      }
    </Grid>
  );
}

/**
 * Map the redux state to the discover properties.
 *
 */
function mapStatetoProps(state: any, ownProps: DiscoverProps) {
  const categoryGroup: ReviewGroup | undefined = state.review ? state.review.listByCategory : undefined;
  return {
    ...ownProps,
    categoryGroup
  };
}

/**
 * Map dispatch actions to the discover route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateListByCategory
    },
    dispatch
  );

export default withRouter(connect(
    mapStatetoProps,
    mapDispatchToProps
)(frontloadConnect(
  frontloadDiscover, {
    noServerRender: false,
    onMount: true,
    onUpdate: false
  })(Discover)
));
