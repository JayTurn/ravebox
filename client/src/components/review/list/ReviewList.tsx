/**
 * ReviewList.tsx
 * The structured list of reviews.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Components.
import LoadingReviewList from '../../elements/loadingReviewList/LoadingReviewList';
import PrivateReviewCard from '../privateReviewCard/PrivateReviewCard';
import ReviewCard from '../reviewCard/ReviewCard';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { PrivateReview, Review } from '../Review.interface';
import { ReviewListProps } from './ReviewList.interface';

/**
 * Checks if the reviews are private or not.
 *
 * @param { Array<PrivateReview | Review>} reviews - the list of reviews.
 *
 * @return boolean
 */
const isPrivate: (
  review: PrivateReview | Review
) => review is PrivateReview = (
  review: PrivateReview | Review
): review is PrivateReview => {
  if ((review as PrivateReview).published) {
    return true;
  } else {
    return false;
  }
}

/**
 * Create styles for the review lists.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  ctaButton: {
    marginTop: theme.spacing(3)
  },
  ctaWrapper: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
    padding: theme.spacing(0, 2),
    textAlign: 'center'
  },
  ctaWrapperLarge: {
    padding: theme.spacing(6, 2),
  },
  listContainer: {
    padding: theme.spacing(0)
  },
  listContainerLarge: {
    padding: theme.spacing(0, 2)
  },
  listElementSmall: {
    borderBottom: `6px solid rgba(0,0,0,0.05)`,
    boxShadow: `inset 0 -1px 0 rgba(0,0,0,0.1)`
  }
}));

/**
 * Renders the review list.
 *
 * @param { ReviewListProps } props - the review list properties.
 */
const ReviewList: React.FC<ReviewListProps> = (props: ReviewListProps) => {
  // Determine if we're need to load private reviews.
  const isPrivateList: boolean = props.reviews.length > 0 && isPrivate(props.reviews[0]);
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  /**
   * Navigates to the post a review screen.
   */
  const postReview: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    props.history.push('/product/add');
  }

  return (
    <React.Fragment>
      {props.retrievalStatus === RetrievalStatus.SUCCESS ? (
        <React.Fragment>
          {props.reviews.length > 0 ? (
            <React.Fragment>
              {isPrivateList ? (
                <React.Fragment>
                  <Grid container direction='row' spacing={largeScreen ? 3 : 0} className={clsx(
                    classes.listContainer, {
                      [classes.listContainerLarge]: largeScreen
                    })}
                  >
                    {(props.reviews as Array<PrivateReview>).map((review: PrivateReview) => {
                      return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={review._id}
                          className={clsx({
                            [classes.listElementSmall]: !largeScreen
                          })}
                        >
                          <PrivateReviewCard {...review} context={props.context} />
                        </Grid>
                      );
                    })}
                  </Grid>
                  <Grid container direction='column' className={clsx(classes.ctaWrapper, { 
                      [classes.ctaWrapperLarge]: largeScreen
                    })}
                  >
                    <Grid item xs={12}>
                      <Typography variant='h2'>
                        Have something else to rave about?
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
                </React.Fragment>
              ) : (
                <Grid container direction='row' spacing={largeScreen ? 3 : 0}>
                  {(props.reviews as Array<Review>).map((review: Review) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={review._id}
                        className={clsx({
                          [classes.listElementSmall]: !largeScreen
                        })}
                      >
                        <ReviewCard {...review} context={props.context}/>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              No reviews found
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <LoadingReviewList columns={3} height={180} count={6} />
      )}
    </React.Fragment>
  );
}

export default withRouter(ReviewList);
