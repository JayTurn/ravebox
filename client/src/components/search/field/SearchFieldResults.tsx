/**
 * SearchFieldResults.tsx
 * Renders a list of results from a search field query.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import LinkElement from '../../elements/link/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { StyleType } from '../../elements/link/Link.enum';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import { AnalyticsContextProps } from '../../analytics/Analytics.interface';
import {
  SearchFieldResult,
  SearchFieldResultsProps
} from './SearchFieldResults.interface';

/**
 * Styles for the search results list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  listContainer: {
    backgroundColor: theme.palette.common.white,
    border: `1px solid rgba(67,74,217, 0.25)`,
    borderRadius: 4,
    boxShadow: `0 1px 3px rgba(100,106,240, 0.25)`,
    padding: theme.spacing(1)
  },
  listContainerScrollable: {
    height: `calc(100vh - 50px)`,
    overflowY: 'scroll'
  },
  listItemContainer: {
    padding: 0
  },
  listItemQueryContainer: {
    borderTop: `1px solid rgba(0,0,0,0.05)`,
  },
  listIcon: {
    color: theme.palette.secondary.main
  },
  listIconContainer: {
    marginLeft: theme.spacing(1),
    minWidth: 'auto',
  }
}));

/**
 * Styled list item text.
 */
const StyledListItemText = withStyles(theme => ({
  root: {
    margin: theme.spacing(1)
  },
  primary: {
    color: `rgba(33,36,104, 0.8)`
  }
}))(ListItemText);

/**
 * Renders the list of search field results.
 */
const SearchFieldResults: React.FC<SearchFieldResultsProps> = (props: SearchFieldResultsProps) => {
  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Define the component classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  /**
   * Handles the navigation of the result item.
   *
   * @param { SearchFieldResult } item - the search result item selected.
   */
  const handleResultNavigation: (
    item: SearchFieldResult
  ) => void = (
    item: SearchFieldResult
  ): void => {
    if (item.url) {
      props.closeSearchResults();

      // Track the select event.
      analytics.trackEvent('select search result')({
        'product id': item.id,
        'title': item.title
      });

      props.history.push(`/${item.resultType}/${item.url}`);
    }
  }

  /**
   * Handles the navigation to generic search results based on the query.
   */
  const handleQueryNavigation: (
    term: string
  ) => void = (
    term: string
  ): void => {
    props.closeSearchResults();
    props.history.push(`/discover/${term}`);
  }

  return (
    <Fade in={props.retrievalStatus !== RetrievalStatus.NOT_REQUESTED}>
      <List className={clsx(
          classes.listContainer,
          {
            [classes.listContainerScrollable]: !largeScreen
          }
        )}
      >
        {
          props.results.map((result: SearchFieldResult, index: number) => {
            return (
              <ListItem button
                key={index}
                className={clsx(classes.listItemContainer)}
                onClick={() => handleResultNavigation(result)}
              >
                
                <StyledListItemText>
                  {result.title}
                </StyledListItemText>
              </ListItem>
            );
          })
        }
        {props.query &&
          <ListItem button
            className={clsx(
              classes.listItemContainer,
              {
                [classes.listItemQueryContainer]: props.results.length > 0
              }
            )}
            onClick={() => handleQueryNavigation(props.query)}
          >
            <ListItemIcon className={clsx(classes.listIconContainer)}>
              <SearchRoundedIcon className={clsx(classes.listIcon)}/>
            </ListItemIcon>
            <StyledListItemText>
              {props.query}
            </StyledListItemText>
          </ListItem>
        }
      </List>
    </Fade>
  )
};

export default withRouter(SearchFieldResults);
