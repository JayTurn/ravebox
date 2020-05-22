/**
 * PrivateReviews.tsx
 * Component rendering the authenticated user's reviews.
 */

// Modules.
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import ReviewList from '../../review/list/ReviewList';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { PrivateReviewsProps } from './PrivateReviews.interface';

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
      padding: theme.spacing(0, 2),
      textAlign: 'center'
    },
    ctaWrapperDesktop: {
      padding: theme.spacing(6, 2),
    }
  }),
);

/**
 * Private reviews component.
 */
const PrivateReviews: React.FC<PrivateReviewsProps> = (props: PrivateReviewsProps) => {
  // Define the style classes.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));


  let foundReviews: boolean = false;

  if (props.retrievalStatus === RetrievalStatus.SUCCESS && props.reviews.length > 0) {
    foundReviews = true;
  }

  /**
   * Navigates to the post a review screen.
   */
  const postReview: (
  ) => void = (
  ): void => {
    props.history.push('/product/add');
  }

  return (
    <React.Fragment>
      {props.retrievalStatus === RetrievalStatus.SUCCESS && props.reviews.length < 0 ? (
        <ReviewList reviews={props.reviews} retrievalStatus={props.retrievalStatus}/>
      ) : (
        <Grid container direction='column' className={clsx(classes.ctaWrapper, { 
            [classes.ctaWrapperDesktop]: largeScreen
          })}
        >
          <Grid item xs={12}>
            <Typography variant='h2'>
              Get started with your first rave
            </Typography>
            <Typography variant='body1'>
              When you post a rave it will be displayed here. What are you waiting for?
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction='column' alignItems='center' className={classes.ctaButton}>
              <Grid item xs={12}>
                <StyledButton
                  color='secondary'
                  clickAction={postReview}
                  submitting={false}
                  title='Post a rave'
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

/**
 * Maps the store properties to the private reviews component.
 */
const mapStatetoProps = (state: any, ownProps: PrivateReviewsProps): PrivateReviewsProps => {
  return {
    ...ownProps,
  };
};

export default withRouter(connect(
  mapStatetoProps,
)(PrivateReviews));
