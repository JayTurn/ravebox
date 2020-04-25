/**
 * AddReview.tsx
 * AddReview route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

// Components.
import AddReviewForm from '../../../components/review/addForm/AddReviewForm';
import ProductPreview from '../../../components/product/preview/ProductPreview';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

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

  const [displayProduct, setDisplayProduct] = React.useState<boolean>(true);

  /**
   * Toggles the display of the product details.
   */
  const toggleProduct: (
    visible: boolean
  ) => void = (
    visible: boolean
  ): void => {
    setDisplayProduct(visible);
  }

  return (
    <Grid
      container
      direction='column'
      alignItems='stretch'
      style={{marginBottom: '3rem'}}
    >
      {productStatus === RetrievalStatus.SUCCESS &&
        <React.Fragment>
          <PageTitle title='Post a rave' />
          {displayProduct &&
            <ProductPreview {...product} />
          }
          <AddReviewForm productId={product._id} toggleProduct={toggleProduct}/>
        </React.Fragment>
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
