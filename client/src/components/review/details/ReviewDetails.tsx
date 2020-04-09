/**
 * ReviewDetails.tsx
 * Renders the component displaying the review.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';

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
 * Renders the review details.
 */
const ReviewDetails: React.FC<ReviewDetailsProps> = (props: ReviewDetailsProps) => {
  // Retrieve the product details from the props.
  const product: Product | undefined = props.review ? props.review.product : undefined;

  // Retrieve the user details from the props.
  const user: PublicProfile | undefined = props.review ? props.review.user : undefined;

  return (
    <Grid container direction='column'>
      {props.review && 
        <Grid item xs={12}>
          <Typography variant='h1'>
            { props.review.title } 
          </Typography>
          {props.review.videoURL &&
            <RaveVideo url={props.review.videoURL} />
          }
          {user &&
            <Typography variant='body1'>
              {user.handle}
            </Typography>
          }
          {product &&
            <ProductPreview {...product} />
          }
        </Grid>
      }
    </Grid>
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
