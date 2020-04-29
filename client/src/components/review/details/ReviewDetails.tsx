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
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Actions.
import { updateActive } from '../../../store/review/Actions';

// Components.
import ProductPreview from '../../product/preview/ProductPreview';
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
  },
  mobilePadding: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }, 
  recommendationContainer: {
    margin: theme.spacing(1, 0),
    paddingLeft: theme.spacing(1),
    paddingBottom: '1px'
  },
  recommendedContainer: {
    borderLeft: `8px solid ${theme.palette.secondary.main}`,
  },
  notRecommendedContainer: {
    borderLeft: `8px solid ${theme.palette.grey.A400}`,
  },
  recommendationText: {
    display: 'block',
    fontSize: '.8rem',
    fontWeight: 600
  },
  recommendedText: {
    color: theme.palette.secondary.dark
  },
  notRecommendedText: {
    color: theme.palette.grey.A400
  },
  reviewTitle: {
    fontSize: '1rem',
    fontWeight: 500,
    margin: theme.spacing(1, 0, 1)
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
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Retrieve the product details from the props.
  const product: Product | undefined = props.review ? props.review.product : undefined;

  // Retrieve the user details from the props.
  const user: PublicProfile | undefined = props.review ? props.review.user : undefined;

  return (
    <React.Fragment>
      {props.review &&
        <React.Fragment>
          { largeScreen ? (
            <React.Fragment>
              <Box style={{maxWidth: '66%'}}>
                  {props.review.videoURL &&
                    <RaveVideo url={props.review.videoURL} />
                  }
              </Box>
              <Grid container direction='column'>
                <Grid item xs={12}>
                  {product &&
                    <ProductPreview {...product} />
                  }
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='h1'>
                    { props.review.title }
                  </Typography>
                  {user &&
                    <Typography variant='body1'>
                      {user.handle}
                    </Typography>
                  }
                </Grid>
              </Grid>
            </React.Fragment>
          ) : (
            <Box className={classes.fixedContainer}>
              <Box className={classes.fixedVideo}>
                {props.review.videoURL &&
                  <RaveVideo url={props.review.videoURL} />
                }
              </Box>
              <Grid container direction='column'>
                <Grid item xs={12} className={classes.mobilePadding}>
                  <Typography variant='h1' className={classes.reviewTitle}>
                    { props.review.title }
                  </Typography>
                </Grid>
                {props.review && user &&
                  <Grid item xs={12} className={clsx(
                      classes.recommendationContainer, {
                        [classes.recommendedContainer]: props.review.recommended,
                        [classes.notRecommendedContainer]: !props.review.recommended
                      }
                    )}
                  >
                    {props.review.recommended ? (
                      <Typography variant='body1' className={clsx(
                          classes.recommendationText,
                          classes.recommendedText
                        )}
                      >
                        {user.handle} recommends this product
                      </Typography>
                    ) : (
                      <Typography variant='body1' className={clsx(
                        classes.recommendationText,
                        classes.notRecommendedText
                        )}
                      >
                        {user.handle} doesn't recommend this product
                      </Typography>
                    )}
                  </Grid>
                }
                {product &&
                  <Grid item xs={12}>
                    <ProductPreview {...product} />
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

export default connect(mapStateToProps)(ReviewDetails);
