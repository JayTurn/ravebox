/**
 * Search.tsx
 * Search screen route component.
 */

// Dependent modules.
import * as React from 'react';

// Dependent components.
import Input from '../forms/input/Input';
import API from '../../utils/api/Api.model';
import TVShowList from '../television/TVShowList';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { styled } from '@material-ui/core/styles';

// Dependent enumerators.
import { TVItemType } from '../television/TVItemType.enum';

// Dependent interfaces.
import { InputData } from '../forms/input/Input.interface';
import {
  SearchProps,
  SearchState
} from './Search.interface';
import { RequestInterface } from '../../utils/api/Api.interface';
import { TVSearch } from '../television/Television.interface';

// Define the styles for the search container grid.
const SearchFieldGrid = styled(Grid)({
  margin: '3rem 0'
});

/**
 * Search field for movie and tv program requests.
 * @class Search
 */
class Search extends React.Component<
  SearchProps,
  SearchState
  > {
  
  // Private properties.
  private _searchRequest: RequestInterface<TVSearch>;
  
  /**
   * Define the class state.
   *
   * @param { SearchProps } props - the search properties.
   */
  constructor(props: SearchProps) {
    super(props);

    this.state = {
      query: ''
    };

    // Set the default search request to the latest tv shows for the default
    // view.
    const defaultQuery: string = `tv/popular${API.appendAPIKey()}`;
    this._searchRequest = API.request(API.requestAPI(defaultQuery));
  }

  /**
   * When the component is mounted, set the latest tv shows as the default.
   * @method onComponentDidMount
   */
  public componentDidMount(): void {
    const instance: Search = this;

    // Update the list of tv shows based on the default search.
    this._searchRequest.promise
      .then((response: TVSearch) => {
        // Update the results on the search state.
        instance.setState({
          results: {...response}
        });
      })
      .catch((error: Error) => {
        // @ToDo: Register the errors with an error store in redux.
      });
  }

  /**
   * Handles changes based on user search queries.
   * @method handleChange
   *
   * @param { HTMLInputElement } field - the input field.
   */
  public handleChange = (data: InputData): void => {
    // Retrieve the search query from the field and save its state.
    const query: string = data.value;
    this.setState({
      query: query
    });
  }

  /**
   * Handles search submission.
   * @method handleClick
   */
  public handleClick = (): void => {
    // Perform the search request using debounce to limit the api requests.
    this.searchForTVShows(this.state.query);
  }

  /**
   * Performs a request to find tv shows.
   * @method searchForTVShows
   *
   * @param { string } query - the query string.
   */
  public searchForTVShows(query: string): void {
    // Define the request string using the search query, the api key and the
    // page.
    const requestString: string = `search/tv${API.appendAPIKey()}&query=${query}&page=1`,
          instance: Search = this;

    // Update the request and listen for responses.
    this._searchRequest = API.request(API.requestAPI(requestString));

    this._searchRequest.promise
      .then((response: TVSearch) => {
        // Update the results on the search state.
        instance.setState({
          results: {...response}
        });

      })
      .catch((error: Error) => {
        // @ToDo: Register the errors with an error store in redux.
      });
  }

  /**
   * Render the search field.
   * @method render
   *
   * @return React.ReactNode
   */
  public render(): React.ReactNode {
    return (
      <div className="block block--search-container">
          <form noValidate autoComplete="off">
            <SearchFieldGrid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={2}
              >
              <Grid item xs={12} sm={9}>
                <Input
                  name="search"
                  type="text"
                  title="Search for your favourite TV shows"
                  handleChange={this.handleChange}
                  hasError={``}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => this.handleClick()}
                >Search</Button>  
              </Grid>
          </SearchFieldGrid>
        </form>
        <div className="block block--search-results">
          {this.state.results &&
            <TVShowList
              list={this.state.results.results}
              display={TVItemType.FULL}
              baseImageUrl=""
            />
          }
        </div>
      </div>
    );
  }
}

export default Search;
