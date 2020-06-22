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
import ShareButton from '../../share/ShareButton';
import ThumbUpRoundedIcon from '@material-ui/icons/ThumbUpRounded';
import ThumbDownRoundedIcon from '@material-ui/icons/ThumbDownRounded';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { withRouter } from 'react-router';

// Actions.
import {
  updateActive,
  updateListByProduct
} from '../../../store/review/Actions';

// Components.
import FollowButton from '../../follow/button/FollowButton';
import ListByQuery from '../listByQuery/ListByQuery';
import ListTitle from '../../elements/listTitle/ListTitle';
import ProductPreview from '../../product/preview/ProductPreview';
import PublicProfilePreview from '../../user/publicProfilePreview/PublicProfilePreview';
import Rate from '../rate/Rate';
import RaveVideo from '../../raveVideo/RaveVideo';
import Recommendation from '../recommendation/Recommendation';
import RecommendationChip from '../recommendationChip/RecommendationChip';
import ReviewDescription from '../description/ReviewDescription';
import ReviewLinks from '../link/ReviewLinks';

// Enumerators.
import {
  FollowType
} from '../../follow/FollowType.enum';
import {
  PresentationType,
  ReviewListType
} from '../listByQuery/ListByQuery.enum';
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { ScreenContext } from '../Review.enum';

// Hooks.
import { useGenerateRatingToken } from '../rate/useGenerateRatingToken.hook';
import {
  useRetrieveListByQuery
} from '../listByQuery/useRetrieveListsByQuery.hook';

// Interfaces.
import { Product } from '../../product/Product.interface';
import { RatingAcceptance } from '../rate/Rate.interface';
import {
  Review,
  ReviewGroup,
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
  followRow: {
    paddingRight: theme.spacing(2)
  },
  contentPadding: {
    padding: theme.spacing(0, 2)
  },
  columnLarge: {
    width: '100%',
    maxWidth: '100%'
  },
  descriptionContainer: {
    margin: theme.spacing(0)
  },
  descriptionContainerSmall: {
    borderTop: `1px solid rgba(0,0,0,0.1)`,
    backgroundColor: theme.palette.common.white
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
    padding: theme.spacing(1, 2, 2),
    backgroundColor: 'rgba(100, 106, 240, 0.1)',
    boxShadow: '0 1px 1px inset rgba(100,106,240, 0.2)'
  },
  profileRowContainer: {
    justifyContent: 'flex-end'
  },
  profileRow: {
    flexGrow: 1
  },
  publicProfileContainer: {
    paddingTop: theme.spacing(3),
    //backgroundColor: `rgba(0,0,0,.02)`,
    backgroundColor: theme.palette.common.white,
    //boxShadow: `0 1px 1px inset rgba(0,0,0,0.05)`
  },
  ratingContainer: {
    flexGrow: 1
  },
  recommendationContainer: {
    padding: theme.spacing(2, 1, 3, 2)
  },
  reviewIntroContainer: {
    backgroundColor: theme.palette.common.white
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
    borderBottom: `1px solid rgba(0,0,0,0.1)`,
    alignItems: 'baseline'
  },
  reviewTitleContainerLarge: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    justifyContent: 'space-between'
  },
  reviewTitleLarge: {
    fontSize: '1.1rem',
    fontWeight: 400
  },
  reviewTitleSection: {
    margin: theme.spacing(2, 0),
    flexGrow: 1
  },
  reviewTitleSectionSmall: {
    width: '100%'
  },
  sidebarContainer: {
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
    margin: theme.spacing(2, 0),
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

  const { review } = {...props};

  const productId: string = (review && review.product) ? review.product._id : '';

  const {
    listStatus
  } = useRetrieveListByQuery({
    queries: [productId],
    listType: ReviewListType.PRODUCT,
    update: props.updateListByProduct
  });

  const [reviewStatistics, setReviewStatistics] = React.useState({
    views: (review.statistics && review.statistics.views > 1) ? `${CommaSeparatedNumber(review.statistics.views)} views`: `1 view`
  });

  // Create a token to be used for video ratings.
  const {token, generateToken} = useGenerateRatingToken();

  // Define a property to support the rating of content after an allowable
  // duration has passed.
  const [ratingAcceptance, setRatingAcceptance] = React.useState<RatingAcceptance>({
    allowed: false,
    played: 0,
    playedSeconds: 0,
    videoDuration: 0
  });

  /**
   * Handles the updating of the allowable rating state.
   *
   * @param { boolean } allowed - the allowable rating state.
   */
  const handleRatingAcceptance: (
    acceptance: RatingAcceptance
  ) => void = (
    acceptance: RatingAcceptance
  ): void => {
    setRatingAcceptance(acceptance);
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
                  review={review} 
                />
              </Grid>
              <Grid container direction='column'>
                <Grid item xs={12} className={clsx(
                    classes.contentPadding,
                    classes.reviewIntroContainer
                  )}
                >
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
                      <Grid item className={clsx({
                        [classes.ratingContainer]: !largeScreen
                      })}>
                        <Rate review={review} token={token} acceptance={ratingAcceptance}/>
                      </Grid>
                    }
                    {review && review.product && review.user &&
                      <Grid item>
                        <ShareButton
                          title={`${review.product.brand} ${review.product.name} rave posted by ${review.user.handle}`}
                          url={`${process.env.RAZZLE_PUBLIC_URL}/review/${review.url}`}
                        />
                      </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>
              {review.user &&
                <Grid container direction='column' className={clsx(
                    classes.publicProfileContainer
                  )}
                >
                  <Grid item xs={12}>
                    <Grid container direction='row' className={clsx(
                        classes.profileRowContainer
                      )}
                    >
                      <Grid item className={clsx(
                          classes.profileRow
                        )}
                      >
                        <Grid item xs={12} className={clsx(
                            classes.columnLarge,
                          )}
                        >
                          <PublicProfilePreview {...review.user} />
                        </Grid>
                        <Grid item xs={12} className={clsx(classes.recommendationContainer)}>
                          <RecommendationChip recommended={review.recommended} />
                        </Grid>
                      </Grid>
                      <Grid item className={clsx(
                          classes.followRow
                        )}
                      >
                        <FollowButton
                          id={review.user._id}
                          handle={review.user.handle}
                          followType={FollowType.CHANNEL}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  {review.description && largeScreen &&
                    <Grid item xs={12} className={clsx(
                      classes.contentPadding,
                      classes.columnLarge,
                      classes.descriptionContainer
                    )}>
                      <ReviewDescription description={review.description} />
                    </Grid>
                  }
                </Grid>
              }
            </Grid>
          </Grid>
          {review.description && !largeScreen &&
            <Grid item xs={12} className={clsx(
              classes.contentPadding,
              classes.columnLarge,
              classes.descriptionContainer,
              classes.descriptionContainerSmall,
            )}>
              <ReviewDescription description={review.description} />
            </Grid>
          }
          <Grid item xs={12} md={5} lg={4} className={classes.sidebarContainer}>
            <Grid container direction='column'>
              <Grid item xs={12}>
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
                      {review.links && review.links[0].path && review.user &&
                        <ReviewLinks handle={review.user.handle} links={[...review.links]} />
                      }
                    </Grid>
                  </Grid>
                }
              </Grid>
              <Grid item xs={12} className={clsx(classes.sidebarMoreContainer)}>
                {props.productGroup && props.productGroup[productId] && review.product &&
                  <ListByQuery
                    context={ScreenContext.REVIEW_PRODUCT_LIST}
                    listType={ReviewListType.PRODUCT}
                    presentationType={largeScreen ? PresentationType.SIDEBAR : PresentationType.SCROLLABLE}
                    reviews={props.productGroup[productId]}
                    title={
                      <ListTitle
                        title={`More reviews for this product`}
                        url={`/product/${review.product.url}`}
                      />
                    }
                  />
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </React.Fragment>
  );
};

/**
 * Map dispatch actions to the home route.
 *
 * @param { Dispatch<AnyAction> } dispatch - the dispatch function to be mapped.
 */
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) =>
  bindActionCreators(
    {
      updateListByProduct
    },
    dispatch
  );

/**
 * Mapping the state updates to the properties from redux.
 */
const mapStateToProps = (state: any, ownProps: ReviewDetailsProps) => {
  // Retrieve the review from the active properties.
  const review: Review = state.review ? state.review.active : undefined,
        productGroup: ReviewGroup | undefined = state.review ? state.review.listByProduct : undefined;

  // Retrieve the xsrf token to be submitted with the request.
  const xsrf: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    productGroup,
    review,
    xsrf
  };
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewDetails));
