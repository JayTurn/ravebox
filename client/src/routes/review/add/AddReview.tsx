/**
 * AddReview.tsx
 * AddReview route component.
 */

// Modules.
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

// Components.
import ReviewForm from '../../../components/review/form/ReviewForm';
import ProductPreview from '../../../components/product/preview/ProductPreview';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { AddReviewProps } from './AddReview.interface';

// Hooks.
import { useRetrieveProductById } from '../../../components/product/useRetrieveProduct.hook';

/**
 * AddReview component.
 */
const AddReview: React.FC<AddReviewProps> = (props: AddReviewProps) => {

  const {
    product,
    productStatus
  } = useRetrieveProductById({id: props.match.params.id});

  return (
    <Grid container direction='column'>
      {productStatus === RetrievalStatus.SUCCESS &&
        <Grid item xs={12}>
          <ProductPreview {...product} />
          <ReviewForm productId={product._id}/>
        </Grid>
      }
    </Grid>
  );
}

/**
 * Map the redux state to the add review properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AddReviewProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(AddReview));
