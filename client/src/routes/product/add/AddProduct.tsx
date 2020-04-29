/**
 * AddProduct.tsx
 * AddProduct route component.
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
import { withRouter } from 'react-router';

// Components.
import PageTitle from '../../../components/elements/pageTitle/PageTitle';
import ProductForm from '../../../components/product/form/ProductForm';

// Interfaces.
import { AddProductProps } from './AddProduct.interface';

/**
 * AddProduct component.
 */
const AddProduct: React.FC<AddProductProps> = (props: AddProductProps) => {
  return (
    <Grid
      container
      direction='column'
      style={{marginBottom: '3rem'}}
    >
      <PageTitle title='Post a rave' />
      <ProductForm />
    </Grid>
  );
}

/**
 * Map the redux state to the add product properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AddProductProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(AddProduct));
