/**
 * ReviewDetails.tsx
 * Renders the component displaying the review.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import Box from '@material-ui/core/Box';
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
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import { updateActive } from '../../../store/review/Actions';

// Components.
import ListByQuery from '../listByQuery/ListByQuery';
import ListTitle from '../../elements/listTitle/ListTitle';
import ProductPreview from '../../product/preview/ProductPreview';
import PublicProfilePreview from '../../user/publicProfilePreview/PublicProfilePreview';
import Rate from '../rate/Rate';
import RaveVideo from '../../raveVideo/RaveVideo';
import Recommendation from '../recommendation/Recommendation';
import RecommendationChip from '../recommendationChip/RecommendationChip';

// Enumerators.
import {
  PresentationType,
  ReviewListType
} from '../listByQuery/ListByQuery.enum';

// Hooks.
import { useGenerateRatingToken } from '../rate/useGenerateRatingToken.hook';

// Interfaces.
import { Product } from '../../product/Product.interface';
import {
  Review,
  ReviewStatistics
} from '../Review.interface';
import { ReviewDetailsProps } from './ReviewDetails.interface';
import { PublicProfile } from '../../user/User.interface';

// Utilities.
import { CommaSeparatedNumber } from '../../../utils/display/numeric/Numeric';

/**
 * Create styles for the review screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  fixedVideo: {
  },
  fixedContainer: {
    width: '100%'
  },
  contentPadding: {
    padding: theme.spacing(0, 2)
  },
  columnLarge: {
    width: '100%',
    maxWidth: '100%'
  },
  moreReviewsTitle: {
    margin: theme.spacing(2),
    fontSize: '.8rem',
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  productBrand: {
    fontSize: '.9rem',
    fontWeight: 600
  },
  productListTitleContainer: {
    padding: theme.spacing(0, 2),
    margin: theme.spacing(2, 0)
  },
  productName: {
    fontSize: '1.1rem',
    fontWeight: 600
  },
  productPreviewContainer: {
    padding: theme.spacing(1, 2, 2, 9)
  },
  publicProfileContainer: {
    paddingTop: theme.spacing(3)
    //backgroundColor: `rgba(0,0,0,.01)`
  },
  ratingContainerLarge: {
  },
  recommendationContainer: {
    padding: theme.spacing(1, 1, 3, 9)
  },
  reviewStatisticsText: {
    color: theme.palette.grey.A700,
    fontSize: '.75rem',
    fontWeight: 600,
    marginTop: theme.spacing(.5),
    marginBottom: 0,
    textTransform: 'uppercase'
  },
  reviewTitle: {
    fontSize: '1.2rem',
    fontWeight: 500,
    margin: 0
  },
  reviewTitleContainer: {
    borderBottom: `1px solid rgba(0,0,0,0.15)`,
  },
  reviewTitleContainerLarge: {
    alignItems: 'flex-end',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  reviewTitleLarge: {
    fontSize: '1.1rem',
    fontWeight: 400
  },
  reviewTitleSection: {
    margin: theme.spacing(2, 0, 1),
    flexGrow: 1
  },
  reviewTitleSectionSmall: {
    width: '100%'
  },
  sidebarContainer: {
    //backgroundColor: theme.palette.common.white,
    //padding: theme.spacing(2)
  },
  sidebarMidLine: {
    backgroundColor: theme.palette.secondary.main,
    height: 1,
    position: 'absolute',
    top: '50%',
    width: '100%',
    zIndex: 0
  },
  sidebarMoreContainer: {
    margin: theme.spacing(0, 0, 2),
    position: 'relative',
    width: '100%',
    zIndex: 1
  },
  sidebarMoreText: {
    display: 'block',
    position: 'relative',
    textAlign: 'center',
    zIndex: 1,
  },
  sidebarMoreTextSpan: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.secondary.dark,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  userHandle: {
    fontSize: '.8rem',
    fontWeight: 600
  }
}));

/**
 * Renders the review details.
 */
const ReviewDetails: React.FC<ReviewDetailsProps> = (props: ReviewDetailsProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [review, setReview] = React.useState<Review>({
    _id: '',
    created: new Date(),
    title: '',
    recommended: 0,
    url: '',
    videoURL: ''
  });

  const [reviewStatistics, setReviewStatistics] = React.useState({
    views: ''
  });

  // Create a token to be used for video ratings.
  const {token, generateToken} = useGenerateRatingToken();

  // Define a property to support the rating of content after an allowable
  // duration has passed.
  const [ratingAllowed, setRatingAllowed] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (props.review) {
      if (props.review._id !== review._id) {
        setReview({...props.review});

        if (props.review.statistics) {
          const statistics: ReviewStatistics = {...props.review.statistics};
          if (statistics.views) {
            const views: string = (statistics.views > 1) ? `${CommaSeparatedNumber(statistics.views)} views`: `1 view`; 
            setReviewStatistics({
              ...reviewStatistics,
              views: views
            });
          }
        }
      }
    }
  }, [review, props.review]);

  /**
   * Handles the updating of the allowable rating state.
   *
   * @param { boolean } allowed - the allowable rating state.
   */
  const handleRatingAcceptance: (
    allowed: boolean
  ) => void = (
    allowed: boolean
  ): void => {
    setRatingAllowed(allowed);
  }

  return (
    <React.Fragment>
      {review && review._id &&
        <Grid container direction='row' key={review._id}>
          <Grid item xs={12} md={7} lg={8}>
            <Grid container direction='column' alignItems='flex-start'>
              <Grid item className={classes.columnLarge}>
                <RaveVideo
                  generateToken={generateToken}
                  makeRatingAllowable={handleRatingAcceptance}
                  reviewId={review._id} 
                  url={review.videoURL || ''}
                />
              </Grid>
              <Grid container direction='column'>
                <Grid item xs={12} className={classes.contentPadding}>
                  <Grid container direction='row' className={clsx(
                      classes.reviewTitleContainer,
                      {
                        [classes.reviewTitleContainerLarge]: largeScreen
                      }
                    )}
                  >
                    <Grid item className={clsx(
                        classes.reviewTitleSection,
                        {
                          [classes.reviewTitleSectionSmall]: !largeScreen
                        }
                      )}
                    >
                      <Grid container direction='column'>
                        <Grid item className={clsx(
                            classes.columnLarge
                          )}
                        >
                          <Typography variant='h1' className={classes.reviewTitle}>
                            { review.title }
                          </Typography>
                          {reviewStatistics.views &&
                            <Typography variant='body1' className={classes.reviewStatisticsText}>
                              {reviewStatistics.views}
                            </Typography>
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                    {review &&
                      <Grid item className={classes.ratingContainerLarge}>
                        <Rate reviewId={review._id} token={token} allowed={ratingAllowed}/>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
              {review.user &&
                <Grid item xs={12} className={clsx(
                    classes.columnLarge,
                    classes.publicProfileContainer
                  )}
                >
                  <PublicProfilePreview {...review.user} />
                </Grid>
              }
              <Grid item xs={12} className={clsx(classes.recommendationContainer)}>
                <RecommendationChip recommended={review.recommended} />
              </Grid>
              {review.product &&
                <Grid container direction='row'>
                  <Grid item xs={12} className={clsx(
                      classes.columnLarge,
                      classes.productPreviewContainer
                    )}
                  >
                    {review.user &&
                      <ProductPreview {...review.product} recommendation={{handle: review.user.handle, recommended: review.recommended}}/>
                    }
                  </Grid>
                </Grid>
              }
            </Grid>
          </Grid>
          <Grid item xs={12} md={5} lg={4} className={classes.sidebarContainer}>
            {review.product &&
              <ListByQuery
                listType={ReviewListType.PRODUCT}
                query={review.product._id} 
                presentationType={largeScreen ? PresentationType.SIDEBAR : PresentationType.SCROLLABLE}
                title={
                  <ListTitle title={`More reviews for this product`} />
                }
              />
            }
          </Grid>
        </Grid>
      }
    </React.Fragment>
  );
};

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ReviewDetailsProps) => {
  // Retrieve the review from the active properties.
  const review: Review = state.review ? state.review.active : undefined;

  // Retrieve the xsrf token to be submitted with the request.
  const xsrf: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    review,
    xsrf
  };
};

export default withRouter(connect(
  mapStateToProps
)(ReviewDetails));
