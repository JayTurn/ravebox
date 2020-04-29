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
import ProductPreview from '../../product/preview/ProductPreview';
import PublicProfilePreview from '../../user/publicProfilePreview/PublicProfilePreview';
import RaveVideo from '../../raveVideo/RaveVideo';

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
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  columnLarge: {
    width: '100%'
  },
  productPreviewContainer: {
    borderBottom: `1px solid rgba(0,0,0,0.15)`
  },
  publicProfileContainer: {
    backgroundColor: `rgba(0,0,0,.03)`
  },
  reviewTitle: {
    fontSize: '1.1rem',
    fontWeight: 500,
    margin: theme.spacing(1, 0, 3)
  },
  reviewTitleLarge: {
    fontSize: '1.25rem',
    fontWeight: 400
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

  // Retrieve the product details from the props.
  const product: Product | undefined = props.review ? props.review.product : undefined;

  // Retrieve the user details from the props.
  const user: PublicProfile | undefined = props.review ? props.review.user : undefined;

  return (
    <React.Fragment>
      {props.review &&
        <React.Fragment>
          { largeScreen ? (
            <Grid container direction='row'>
              <Grid item xs={8}>
                <Grid container direction='column' alignItems='flex-start'>
                  <Grid item className={classes.columnLarge}>
                    {props.review.videoURL &&
                      <RaveVideo url={props.review.videoURL} />
                    }
                  </Grid>
                  <Grid item xs={12} className={clsx(
                      classes.contentPadding,
                      classes.columnLarge
                    )}
                  >
                    <Typography variant='h1' className={classes.reviewTitle}>
                      { props.review.title }
                    </Typography>
                  </Grid>
                  {product &&
                    <Grid item xs={12} className={clsx(
                        classes.columnLarge,
                        classes.productPreviewContainer
                      )}
                    >
                      {user &&
                        <ProductPreview {...product} recommendation={{handle: user.handle, recommended: props.review.recommended}}/>
                      }
                    </Grid>
                  }
                  {user &&
                    <Grid item xs={12} className={clsx(
                        classes.columnLarge,
                        classes.publicProfileContainer
                      )}
                    >
                      <PublicProfilePreview {...user} />
                    </Grid>
                  }
                </Grid>
              </Grid>
              <Grid item xs={4}>
                Recommendations
              </Grid>
            </Grid>
          ) : (
            <Box className={classes.fixedContainer}>
              <Box className={classes.fixedVideo}>
                {props.review.videoURL &&
                  <RaveVideo url={props.review.videoURL} />
                }
              </Box>
              <Grid container direction='column'>
                <Grid item xs={12} className={classes.contentPadding}>
                  <Typography variant='h1' className={classes.reviewTitle}>
                    { props.review.title }
                  </Typography>
                </Grid>
                {product &&
                  <Grid item xs={12} className={clsx(
                      classes.productPreviewContainer
                    )}
                  >
                    {user &&
                      <ProductPreview {...product} recommendation={{handle: user.handle, recommended: props.review.recommended}}/>
                    }
                  </Grid>
                }
                {user &&
                  <Grid item xs={12} className={clsx(
                      classes.publicProfileContainer
                    )}
                  >
                    <PublicProfilePreview {...user} />
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
