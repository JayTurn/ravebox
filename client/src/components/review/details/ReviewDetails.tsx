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
import RaveVideo from '../../raveVideo/RaveVideo';

// Enumerators.
import {
  PresentationType,
  ReviewListType
} from '../listByQuery/ListByQuery.enum';

// Interfaces.
import { Product } from '../../product/Product.interface';
import { Review } from '../Review.interface';
import { ReviewDetailsProps } from './ReviewDetails.interface';
import { PublicProfile } from '../../user/User.interface';

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
    width: '100%'
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
    borderBottom: `1px solid rgba(0,0,0,0.15)`,
    padding: theme.spacing(1, 2, 2)
  },
  publicProfileContainer: {
    backgroundColor: `rgba(0,0,0,.03)`
  },
  reviewTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
    margin: 0
  },
  reviewTitleLarge: {
    fontSize: '1.25rem',
    fontWeight: 400
  },
  reviewTitleSection: {
    marginTop: theme.spacing(2)
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

  React.useEffect(() => {
    if (props.review) {
      if (props.review._id !== review._id) {
        setReview({...props.review});
      }
    }
  }, [review, props.review]);

  /*
  // Retrieve the product details from the props.
  const product: Product | undefined = props.review ? props.review.product : undefined;

  // Retrieve the user details from the props.
  const user: PublicProfile | undefined = props.review ? props.review.user : undefined;
  */

  return (
    <React.Fragment>
      {props.review &&
        <React.Fragment>
          { largeScreen ? (
            <Grid container direction='row'>
              <Grid item xs={7} lg={8}>
                <Grid container direction='column' alignItems='flex-start'>
                  <Grid item className={classes.columnLarge}>
                    {review.videoURL &&
                      <RaveVideo url={review.videoURL} />
                    }
                  </Grid>
                  <Grid item xs={12} className={clsx(
                      classes.contentPadding,
                      classes.columnLarge,
                      classes.reviewTitleSection
                    )}
                  >
                    <Typography variant='h1' className={classes.reviewTitle}>
                      { review.title }
                    </Typography>
                  </Grid>
                  {review.product &&
                    <Grid item xs={12} className={clsx(
                        classes.columnLarge,
                        classes.productPreviewContainer
                      )}
                    >
                      {review.user &&
                        <ProductPreview {...review.product} recommendation={{handle: review.user.handle, recommended: review.recommended}}/>
                      }
                    </Grid>
                  }
                  {review.user &&
                    <Grid item xs={12} className={clsx(
                        classes.columnLarge,
                        classes.publicProfileContainer
                      )}
                    >
                      <PublicProfilePreview {...review.user} />
                    </Grid>
                  }
                </Grid>
              </Grid>
              <Grid item xs={5} lg={4} className={classes.sidebarContainer}>
                {review.product &&
                  <ListByQuery
                    listType={ReviewListType.PRODUCT}
                    query={review.product._id} 
                    presentationType={PresentationType.SIDEBAR}
                    title={
                      <ListTitle title={`More reviews for this product`} />
                    }
                  />
                }
              </Grid>
            </Grid>
          ) : (
            <Box className={classes.fixedContainer}>
              <Box className={classes.fixedVideo}>
                {props.review.videoURL &&
                  <RaveVideo url={review.videoURL || ''} />
                }
              </Box>
              <Grid container direction='column'>
                <Grid item xs={12} className={clsx(
                  classes.contentPadding,
                  classes.reviewTitleSection
                )}>
                  <Typography variant='h1' className={classes.reviewTitle}>
                    { props.review.title }
                  </Typography>
                </Grid>
                {review.product &&
                  <Grid item xs={12} className={clsx(
                      classes.productPreviewContainer,
                      classes.contentPadding
                    )}
                  >
                    {review.user &&
                      <ProductPreview {...review.product} recommendation={{handle: review.user.handle, recommended: props.review.recommended}}/>
                    }
                  </Grid>
                }
                {review.user &&
                  <Grid item xs={12} className={clsx(
                      classes.publicProfileContainer
                    )}
                  >
                    <PublicProfilePreview {...review.user} />
                  </Grid>
                }
                {review.product &&
                  <Grid item xs={12}>
                    <ListByQuery
                      listType={ReviewListType.PRODUCT}
                      query={review.product._id} 
                      presentationType={PresentationType.SCROLLABLE}
                      title={
                        <ListTitle title={`More reviews for this product`} />
                      }
                    />
                  </Grid>
                }
              </Grid>
            </Box>
          )}
        </React.Fragment>
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

  return {
    ...ownProps,
    review
  };
};

export default withRouter(connect(
  mapStateToProps
)(ReviewDetails));
