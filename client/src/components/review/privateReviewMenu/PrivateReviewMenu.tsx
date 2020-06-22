/**
 * PrivateReviewMenu.tsx
 * Menu for signed in users.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import API from '../../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import {
  VariantType,
  useSnackbar
} from 'notistack';
import { withRouter } from 'react-router';

// Actions.
import { setReviews } from '../../../store/user/Actions';

// Components.
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Interfaces.
import { PrivateReview } from '../Review.interface';
import {
  PrivateReviewMenuProps,
  RemoveReviewResponse
} from './PrivateReviewMenu.interface';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

/**
 * Create the theme styles to be used for the display.
 */
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuIcon: {
      paddingRight: 0,
      paddingBottom: 0,
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  })
);

/**
 * Removes a review from the list based on the given id.
 *
 * @param { Array<PrivateReview> } reviews - the list of reviews.
 * @param { string } id - the id of the review to be removed.
 *
 * @return Array<PrivateReview>
 */
const removeReviewById: (
  reviews: Array<PrivateReview>
) => (
  id: string
) => Array<PrivateReview> = (
  reviews: Array<PrivateReview>
) => (
  id: string
): Array<PrivateReview> => {

  // Define the current index.
  let i: number = 0;

  // Define a new list to be returned.
  const updated: Array<PrivateReview> = [];

  // Loop through the reviews and add the items that don't match the id of
  // the review to be removed.
  do {
    const current: PrivateReview = reviews[i];

    if (current._id !== id) {
      updated.push({...current});
    }

    i++;
  } while (i < reviews.length);

  return updated;
}

/**
 * Renders private review options for authenticated users.
 */
const PrivateReviewMenu: React.FC<PrivateReviewMenuProps> = (props: PrivateReviewMenuProps) => {
  // Define the style classes.
  const classes = useStyles();
  // Define the snackbar to be used for updating the user.
  const { enqueueSnackbar } = useSnackbar();

  // Define the menu anchor.
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  // Define the confirmation option.
  const [openConfirmation, setOpenConfirmation] = React.useState<boolean>(false);

  // Define the submission state for review removal.
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  /**
   * Handles the opening of the private review menu.
   */
  const handleClick: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (e.currentTarget) {
      setAnchorEl(e.currentTarget);
    }
  }

  /**
   * Handles the closing of the private review menu.
   */
  const handleClose: () => void = (): void => {
    setAnchorEl(null);
  }

  /**
   * Handles the navigation to the review edit screen.
   */
  const edit: () => void = (): void => {

    // Close the menu.
    handleClose();

    // Redirect to the home screen.
    props.history.push(props.paths.edit);
  }

  /**
   * Displays the confirmation dialog to remove a review.
   */
  const displayConfirmation: (
  ) => void = (
  ): void => {
    // Close the popup menu.
    handleClose();
    setOpenConfirmation(true);
  }

  /**
   * Closes the confirmation dialog.
   */
  const closeConfirmation: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setOpenConfirmation(false);
  }

  /**
   * Handles the removal of a review.
   */
  const remove: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    // Perform the request to remove the review
    API.requestAPI<RemoveReviewResponse>(`review/remove/${props.reviewId}`, {
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      method: RequestType.DELETE
    })
    .then((response: RemoveReviewResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setSubmitting(false);
        return;
      }

      // Remove the current review from the list of reviews in the redux
      // store.
      if (props.setReviews && props.reviews) {
        const reviews: Array<PrivateReview> = removeReviewById(
          props.reviews)(props.reviewId);

        props.setReviews([...reviews]);
      }

      // Set the submission state.
      setSubmitting(false);

      enqueueSnackbar('Review removed', { variant: 'success' });
    })
    .catch((error: Error) => {
      console.log(error);
      // Set the submission state.
      setSubmitting(false);
    });

    // Close the menu.
    handleClose();
  }
  
  return (
    <React.Fragment>
      <IconButton
        aria-label="settings"
        className={classes.menuIcon}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={edit}>
          <Typography color='textPrimary' variant="inherit">
            Edit
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={displayConfirmation}>
          <Typography color='textPrimary' variant="inherit">
            Remove
          </Typography>
        </MenuItem>
      </StyledMenu>
      <Dialog
        open={openConfirmation}
        onClose={closeConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Confirm removal`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove your {props.productTitle} review?
          </DialogContentText>   
        </DialogContent>
        <DialogActions>
          <StyledButton
            color='primary'
            clickAction={remove}
            size='large'
            submitting={submitting}
            title='Yes'
            variant='outlined'
          />
          <StyledButton
            color='primary'
            clickAction={closeConfirmation}
            size='large'
            submitting={submitting}
            title='No'
            variant='contained'
          />
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

/**
 * Map dispatch actions to properties on the verification.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      setReviews
    },
    dispatch
  );

/**
 * Map the private review to the naigation menu.
 *
 */
function mapStatetoProps(state: any, ownProps: PrivateReviewMenuProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrf: string = state.xsrf ? state.xsrf.token : undefined;
  // Retrieve the reviews from the redux store.
  const reviews: Array<PrivateReview> = state.user ? state.user.reviews : [];

  return {
    ...ownProps,
    reviews,
    xsrf
  };

}

export default withRouter(
  connect(
    mapStatetoProps,
    mapDispatchToProps
  )(PrivateReviewMenu)
);
