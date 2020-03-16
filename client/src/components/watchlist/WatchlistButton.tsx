/**
 * WatchlistButton.tsx
 * Button to add and remove items from the watchlist store.
 */

// Dependent modules.
import * as React from 'react';
import Button from '@material-ui/core/Button';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

// Dependent models.
import { TVItem } from '../television/Television.interface';
import {
  addToWatchlist,
  removeFromWatchlist
} from '../../store/watchlist/Actions';
import { showLogin } from '../../store/user/Actions';

/**
 * Dependent interfaces.
 */
import {
  WatchlistButtonProps,
  WatchlistButtonState
} from './Watchlist.interface';

/**
 * Component to manage the adding and removing of watchlist items.
 * @class WatchlistButton
 */
class WatchlistButton extends React.Component<
  WatchlistButtonProps,
  WatchlistButtonState
> {

  /**
   * Handles the adding and removal of the item from the watchlist.
   * @method onClick
   *
   */
  public handleClick(): void {
    // Exit if we don't have the redux actions available to manage the watchlist
    // behaviours.
    if (!this.props.addItem || !this.props.removeItem) {
      return;
    }

    // Prompt the login if the user is unauthenticated.
    if (!this.props.allowed) {
      if (this.props.promptLogin) {
        this.props.promptLogin();
      }
      return;
    }

    // If this item isn't in the watchlist, add it.
    if (!this.props.watching) {
      this.props.addItem(this.props.item);
    } else {
      this.props.removeItem(this.props.item);
    }
  }

  /**
   * Renders the watchlist button.
   * @method render
   *
   * @return React.ReactNode
   */
  public render(): React.ReactNode {

    // Define the text to be displayed for the button.
    return (
      <React.Fragment>
        {this.props.watching ? (
          <Button
            color="secondary"
            variant="outlined"
            onClick={
              () => this.handleClick() 
            }
          >
            Remove from watchlist
          </Button>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={
              () => this.handleClick() 
            }
          >
            Add to watchlist
          </Button>
        )}
      </React.Fragment>
    );
  }
}

/**
 * Map dispatch actions to properties on the application.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      addItem: addToWatchlist,
      removeItem: removeFromWatchlist,
      promptLogin: showLogin
    },
    dispatch
  );

/**
 * Maps the current item with the items stored in the redux watchlist.
 */
const mapStatetoProps = (state: any, ownProps: WatchlistButtonProps): WatchlistButtonProps => {
  // Find the watchlist item.
  const watched: Array<TVItem> = state.watchlist.watching.find((item: TVItem) => {
    return item.id === ownProps.item.id;
  });
  const watching: boolean = !watched ? false : true;

  // Determine if a user is logged in and allowed to add items.
  let allowed: boolean = false;
  if (state.user.profile.id) {
    allowed = true;
  }

  return {
    ...ownProps,
    watching: watching,
    allowed: allowed
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchToProps
)(WatchlistButton);
