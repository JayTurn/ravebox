/**
 * Watchlist.tsx
 * Displays the tv shows added to the watchlist.
 */

// Dependent modules.
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import Typography from '@material-ui/core/Typography';
import { styled } from '@material-ui/core/styles';

// Dependent components.
import TVShowList from '../../components/television/TVShowList';

// Dependent enumerators.
import { TVItemType } from '../../components/television/TVItemType.enum';

// Dependent interfaces.
import {
  WatchlistProps,
  WatchlistState
} from './Watchlist.interface';

// Dependent models.
import { showLogin } from '../../store/user/Actions';

// Create styled card media.
const StyledHeading = styled(Typography)({
  margin: '2rem 0 4rem',
  display: 'block',
  borderBottom: '2px solid #000'
});

const StyledBody = styled(Typography)({
  fontSize: '1.33rem'
});

/**
 * Renders the view of watchlist items.
 * @class Watchlist
 */
class Watchlist extends React.Component<
  WatchlistProps,
  WatchlistState
> {

  /**
   * Display the login prompt if the user isn't logged in.
   * @method componentDidMount
   */
  public componentDidMount(): void {
    // Display the login prompt.
    if (this.props.showLogin) {
      this.props.showLogin();
    }
  }

  /**
   * Renders the watchlist view.
   * @method render
   *
   * @return React.ReactNode
   */
  public render(): React.ReactNode {
    return (
      <div className="block block--watchlist-container">
        <StyledHeading variant="h1">
          Watchlist
        </StyledHeading>
        {this.props.list && this.props.list.length > 0 ? ( 
          <TVShowList
            display={TVItemType.PARTIAL}
            list={this.props.list}
            baseImageUrl=""
          />
        ) : (
          <StyledBody variant="body1">
            {`When you add items to your watchlist, they will appear here.`}
          </StyledBody>
        )}
      </div>
    );
  }
}

/**
 * Maps the redux stored items to the watchlist view.
 */
const mapStatetoProps = (state: any, ownProps: WatchlistProps): WatchlistProps => {
  // Sets the watchlist items in the component properties.
  return {
    ...ownProps,
    list: state.watchlist.watching
  };
};

/**
 * Map dispatch actions to the watchlist route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      showLogin: showLogin
    },
    dispatch
  );

export default connect(
  mapStatetoProps,
  mapDispatchToProps,
)(Watchlist);
