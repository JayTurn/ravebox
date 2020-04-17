/**
 * ProductForm.tsx
 * Product form component.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import { VariantType, useSnackbar } from 'notistack';

// Components.
import CategorySelection from '../../category/selection/CategorySelection';
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import ProductSelection from '../select/ProductSelection';
import BrandSelection from '../select/BrandSelection';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import {
  RequestType
} from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../../product/Product.interface';
import {
  ProductFormProps,
  ProductFormResponse
} from './ProductForm.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  isEmail,
  allowedCharacters,
  isPassword,
  isRequired,
  handleAvailable,
  minLength
} from '../../forms/validation/ValidationRules';

/**
 * Product validation schema.
 */
const signupValidation: ValidationSchema = {
  name: {
    errorMessage: '',
    rules: [
      isRequired
    ]
  },
  brand: {
    errorMessage: '',
    rules: [isRequired]
  },
  category: {
    errorMessage: '',
    rules: [isRequired]
  },
  'sub-category': {
    errorMessage: '',
    rules: [isRequired]
  }
};

/**
 * Renders the product form component.
 */
const ProductForm: React.FC<ProductFormProps> = (
  props: ProductFormProps
) => {
  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  // Define the product details.
  const [product, setProduct] = React.useState({
    brand: '',
    categories: [{
      key: '',
      label: ''
    }],
    name: '',
  });

  const [brandChanged, setBrandChanged] = React.useState<boolean>(false);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: signupValidation
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

    // Reset the form errors based on field input.
    setFormErrorMessages(['']);

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
    
    // Reset the form errors based on field input.
    setFormErrorMessages(['']);

    setProduct({
      ...product,
      [data.key]: data.value
    });
  }

  /**
   * Handle brand focus.
   */
  const handleBrandFocus: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    setBrandChanged(true);
  }

  /**
   * Submits the product for creation.
   */
  const submit: (
  ) => Promise<void> = async (
  ): Promise<void> => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Define the selected category.
    const category: string = product.categories.length > 0 ? product.categories[0].label : '',
          subCategory: string = product.categories.length > 1 ? product.categories[1].label : '';

    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields({
      'name': product.name,
      'brand': product.brand,
      'category': category,
      'sub-category': subCategory
    });

    // If we have any errors, set the messages on the form and prevent the
    // submission.
    if (errors.length > 0) {
      setFormErrorMessages(errors);
      setSubmitting(false)
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    API.requestAPI<ProductFormResponse>('product/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify(product)
    })
    .then((response: ProductFormResponse) => {

      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar('Product added successfully', { variant: 'success' });

      props.history.push(`/product/${response.product._id}/review`);
    })
    .catch((error: Error) => {
      console.error(error);
    })
  };

  return (
    <Grid
      container
      direction='column'
      alignItems='stretch'
      style={{marginTop: '3rem', marginBottom: '3rem'}}
    >
      <Grid item xs={12}>
        <Typography variant='h1' color='textPrimary'>
          Post a rave
        </Typography>
        <PaddedDivider />
      </Grid>
      <ProductSelection update={updateInputs} />
      {product.name &&
        <React.Fragment>
          <BrandSelection update={updateInputs} visible={product.name !== ''} handleFocus={handleBrandFocus}/>
          <CategorySelection
            update={updateCategories}
            visible={brandChanged}
          />
          <Grid item xs={12} md={6} style={{marginTop: '2rem'}}>
            <ErrorMessages errors={formErrorMessages} />
          </Grid>
          <Fade in={product.categories.length > 1} timeout={300}>
            <Grid item xs={12}>
              <StyledButton
                disabled={submitting}
                title='Next'
                clickAction={submit}
                submitting={submitting}
              />
            </Grid>
          </Fade>
        </React.Fragment>
      }
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

export default withRouter(connect(
  mapStatetoProps
)(ProductForm));
