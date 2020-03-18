/**
 * AddProduct.tsx
 * AddProduct route component.
 */

// Modules.
import * as React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators, Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';

// Components.
import ProductForm from '../../../components/product/form/ProductForm';

// Interfaces.
import { AddProductProps } from './AddProduct.interface';

/**
 * AddProduct component.
 */
const AddProduct: React.FC<AddProductProps> = (props: AddProductProps) => {

  return (
    <div className="block block--profile-container">
      <ProductForm />
    </div>
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
