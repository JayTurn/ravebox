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
import * as React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import LoadingReviewList from '../../elements/loadingReviewList/LoadingReviewList';
import PrivateReviewCard from '../privateReviewCard/PrivateReviewCard';
import ReviewCard from '../reviewCard/ReviewCard';

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
  mobileListElement: {
    borderBottom: `2px solid ${theme.palette.divider}`,
    margin: theme.spacing(0, 0, 2),
    padding: theme.spacing(0, 0, 2)
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
        mobile = useMediaQuery(theme.breakpoints.only('xs'));

  return (
    <React.Fragment>
      {props.retrievalStatus === RetrievalStatus.SUCCESS ? (
        <React.Fragment>
          {props.reviews.length > 0 ? (
            <React.Fragment>
              {isPrivateList ? (
                <Grid container direction='row' spacing={mobile ? 0 : 3}>
                  {(props.reviews as Array<PrivateReview>).map((review: PrivateReview) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={review._id}
                        className={clsx({
                          [classes.mobileListElement]: mobile
                        })}
                      >
                        <PrivateReviewCard {...review} />
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Grid container direction='row' spacing={3}>
                  {(props.reviews as Array<Review>).map((review: Review) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={review._id}
                        className={clsx({
                          [classes.mobileListElement]: mobile
                        })}
                      >
                        <ReviewCard {...review} />
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

export default ReviewList;
