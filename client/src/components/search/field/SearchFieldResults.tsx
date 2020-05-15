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
  Theme
} from '@material-ui/core/styles';
import LinkElement from '../../elements/link/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as React from 'react';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { StyleType } from '../../elements/link/Link.enum';

// Interfaces.
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
  listItemContainer: {
    padding: 0
  }
}));

/**
 * Styled list item text.
 */
const StyledListItemText = withStyles(theme => ({
  root: {
  },
  primary: {
    color: `rgba(33,36,104, 0.8)`
  }
}))(ListItemText);

/**
 * Renders the list of search field results.
 */
const SearchFieldResults: React.FC<SearchFieldResultsProps> = (props: SearchFieldResultsProps) => {

  // Define the component classes.
  const classes = useStyles();

  return (
    <List className={clsx(classes.listContainer)}>
      {
        props.results.map((result: SearchFieldResult, index: number) => {
          return (
            <ListItem
              key={index}
              className={clsx(classes.listItemContainer)}
            >
              
              <StyledListItemText>
                <LinkElement
                  path={'/'}
                  styleType={StyleType.SEARCH_RESULT_ITEM}
                  title={result.title}
                />
              </StyledListItemText>
            </ListItem>
          );
        })
      }
      {props.query &&
        <ListItem
          className={clsx(classes.listItemContainer)}
        >
          
          <StyledListItemText>
            <LinkElement
              path={'/'}
              styleType={StyleType.SEARCH_RESULT_ITEM}
              title={props.query}
            />
          </StyledListItemText>
        </ListItem>
      }
    </List>
  )
};

export default SearchFieldResults;
