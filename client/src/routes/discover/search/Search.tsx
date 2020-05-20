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
import ProductPreview from '../../../components/product/preview/ProductPreview';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import {
  PresentationType,
  ReviewListType
} from '../../../components/review/listByQuery/ListByQuery.enum';
import { StyleType } from '../../../components/elements/link/Link.enum';

// Hooks.
import {
  useRetrieveDiscoverGroups
} from '../../../components/discover/useRetrieveDiscoverGroups.hook';

// Interfaces.
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

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Invoke the discover groups hook to perform requests and set content.
  const {
    lists,
    retrievalStatus
  } = useRetrieveDiscoverGroups({
    existing: props.discoverGroups && props.discoverGroups[0].category.key ? props.discoverGroups : undefined,
    term: props.match.params.term,
    updateGroups: props.updateGroups
  });

  return (
    <Grid container direction='column'>
      {lists && lists.length > 0 &&
        <React.Fragment> 
          {lists.map((list: ReviewList) => {
            return (
              <Grid item key={list.id} xs={12}>
                <ListByQuery
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
