/**
 * ProductForm.tsx
 * Product form component.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { connect } from 'react-redux';

// Components.
import CategorySelection from '../../category/selection/CategorySelection';
import Input from '../../forms/input/Input'; 

// Enumerators.
import {
  RequestType
} from '../../../utils/api/Api.enum';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../../product/Product.interface';
import {
  ProductFormProps,
  ProductFormResponse
} from './ProductForm.interface';

/**
 * Renders the product form component.
 */
const ProductForm: React.FC<ProductFormProps> = (
  props: ProductFormProps
) => {

  // Define the product details.
  const [product, setProduct] = React.useState({
    brand: '',
    categories: [{
      key: '',
      label: ''
    }],
    name: '',
  });

  /**
   * Updates the categories with the selected field.
   *
   * @param { Array<string> } selected - the selected categories.
   */
  const updateCategories: (
    selected: Array<CategoryItem>
  ) => void = (
    selected: Array<CategoryItem>
  ): void => {

    setProduct({
      ...product,
      categories: selected
    });
  }

  /**
   * Updates the text values for the relevant product field.
   *
   * @param { InputData } data - the field data.
   */
  const updateInputs: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {

    setProduct({
      ...product,
      [data.key]: data.value
    });

  }

  /**
   * Submits the product for creation.
   */
  const submit: () => void = (): void => {
    API.requestAPI<ProductFormResponse>('product/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify(product)
    })
    .then((response: ProductFormResponse) => {
      console.log(response);
    })
    .catch((error: Error) => {
      console.error(error);
    })
  };

  return (
    <Grid
      container
      direction='column'
    >
      <CategorySelection
        update={updateCategories}
      />
      {product.categories.length > 1 &&
        <Grid item xs={12}>
          <Typography variant='h3' gutterBottom>Enter the product details</Typography>
          <Input
            handleChange={updateInputs}
            hasError={''}
            name='name'
            required={true}
            type='text'
            title="Name" 
          />
          <Input
            handleChange={updateInputs}
            hasError={''}
            name='brand'
            required={true}
            type='text'
            title="Brand" 
          />
        </Grid>
      }
      <Grid item xs={12}>
        <Button
          variant='contained' 
          color='primary'
          onClick={submit}
        >
          Create
        </Button>
      </Grid>
    </Grid>
  );
};

/**
 * Map the redux state to the product form properties.
 *
 */
function mapStatetoProps(state: any, ownProps: ProductFormProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(mapStatetoProps)(ProductForm);
