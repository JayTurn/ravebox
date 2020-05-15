/**
 * SearchField.tsx
 * Renders and autocomplete search component.
 */

// Modules.
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import SearchRoundedIcon from '@material-ui/icons/SearchRounded';
import Input from '@material-ui/core/Input';

// Components.
import SearchFieldResults from './SearchFieldResults';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Hooks.
import { useAutocompleteSearch } from './useAutocompleteSearch.hook';

// Interfaces.
import {
  AutocompleteSearchResponse,
  AutocompleteSearchResult
} from './SearchField.interface';
import { SearchFieldProps } from './SearchField.interface';

/**
 * Styles for the autocomplete element.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  field: {
  },
  fieldContainer: {
    zIndex: 2,
  },
  listContainer: {
    position: 'absolute',
    zIndex: 1,
    top: 48,
    width: '100%'
  },
  searchButton: {
    backgroundColor: `rgba(67,74,217, 0.05)`,
    borderBottom: `1px solid rgba(67,74,217, 0.15)`,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 4,
    borderTop: `1px solid rgba(67,74,217, 0.15)`,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 4,
    borderRight: `1px solid rgba(67,74,217, 0.15)`,
    height: `2.2rem`,
    lineHeight: `2.2rem`,
    marginTop: 10,
    padding: theme.spacing(0, 1),
    '&:hover': {
      backgroundColor: `rgba(67,74,217, 0.1)`,
    }
  },
  searchContainer: {
    position: 'relative',
    zIndex: 1
  },
  searchIcon: {
    color: theme.palette.primary.main,
    opacity: '0.8'
  },
  inputContainer: {
    flexGrow: 1,
  }
}));

/**
 * Styled search field.
 */
const StyledSearchField = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    border: `1px solid rgba(67,74,217, 0.15)`,
    color: `rgba(33,36,104, 0.7)`,
    fontSize: `.9rem`,
    height: `2.2rem`,
    lineHeight: `2.2rem`,
    marginTop: 10,
    padding: theme.spacing(.5, 2),
    width: '100%',
  },
  input: {
    '&::placeholder': {
      color: `rgba(33,36,104, 0.4)`,
      opacity: 1
    }
  }
}))(Input);

/**
 * Renders the search field.
 */
const SearchField: React.FC<SearchFieldProps> = (props: SearchFieldProps) => {

  // Define the component classes.
  const classes = useStyles();

  // Use the autocomplete search hook for search requests.
  const {
    closeSearchResults,
    delayedQuery,
    query,
    results,
    retrievalStatus
  } = useAutocompleteSearch();

  /**
   * Handles the change event on the product field.
   *
   * @param { React.ChangeEvent } e - the field's change event.
   */
  const handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    delayedQuery(e.target.value);
  }

  /**
   * Handles the closing of the search results.
   */
  const handleClose: (
  ) => void = (
  ): void => {
    closeSearchResults();
  }

  /**
   * Handle focus for text field.
   *
   * @param { React.FocusEvent } e - the input focus event.
   */
  const handleFocus: (
    e: React.FocusEvent<HTMLInputElement>
  ) => void = (
    e: React.FocusEvent<HTMLInputElement>
  ): void => {
  }

  const test: Array<AutocompleteSearchResult> = [{
    title: 'Hello'
  }];

  return (
    <Grid container direction='column' className={clsx(classes.searchContainer)}>
      <Grid item xs={12} className={clsx(classes.fieldContainer)}>
        <Grid
          container
          direction='row'
        >
          <Grid item className={clsx(classes.inputContainer)}>
            <StyledSearchField
              className={clsx(classes.field)}
              disableUnderline
              id='product-search'
              name='product_search'
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder='Search'
              type='text'
            />
          </Grid>
          <Grid item>
            <IconButton
              aria-label='Perform product search'
              disableRipple
              className={classes.searchButton}
            >   
              <SearchRoundedIcon className={classes.searchIcon}/>
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} className={clsx(classes.listContainer)}>
        <SearchFieldResults results={[...results]} query={query}/>
      </Grid>
    </Grid>
  );
}

export default SearchField;
