/**
 * ProductSelection.tsx
 * Provides assistance to users adding a product to rave.
 */

// Modules.
import * as React from 'react';
import API from '../../../utils/api/Api.model';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';
import debounce from 'lodash/debounce';

// Components.
import Input from '../../forms/input/Input';
import ProductSelectList from './ProductSelectList';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../Product.interface';
import {
  ProductSearchResponse,
  ProductSelectionProps,
  ProductSelectionForm
} from './ProductSelection.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  isRequired
} from '../../forms/validation/ValidationRules';

/**
 * Product selection form schema.
 */
const formValidation: ValidationSchema = {
  name: {
    errorMessage: '',
    rules: [
      isRequired
    ]
  }
};

/**
 * Assists the user in the selection of a product.
 */
const ProductSelection: React.FC<ProductSelectionProps> = (props: ProductSelectionProps) => {

  // Define the product selection form state.
  const [values, setValues] = React.useState<ProductSelectionForm>({
    name: ''
  });

  // Define the state for checking if values have changed.
  const [changed, setChanged] = React.useState<boolean>(false);

  // Define the product selection state.
  const [selected, setSelected] = React.useState<boolean>(false);

  const [showButton, setShowButton] = React.useState<boolean>(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  // Set the product search query.
  const [query, setQuery] = React.useState<string>('');

  const [options, setOptions] = React.useState<Array<Product>>([]);

  // Define the debounce function for search queries.
  const delayedQuery = React.useCallback(debounce((q: string) => searchProducts(q), 300), []);

  React.useEffect(() => {
    if (changed && query !== '') {
      setShowButton(true);
    }
  }, [changed, query]);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: formValidation
  });

  /**
   * Handles updates to the profile form.
   *
   * @param { InputData } data - the field data.
   */
  const handleBlur: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {

    // Reset the form errors based on field input.
    setFormErrorMessages(['']);

    const updatedValues: ProductSelectionForm = {
      ...values,
      [data.key]: data.value
    };

    // Validate the field if it has rules associated with it.
    if (validation[data.key]) {
      validateField(data.key)(data.value);
    }

    setValues({
      ...values,
      [data.key]: data.value
    });
  }

  /**
   * When focusing on the field.
   */
  const handleFocus: (
    e: React.SyntheticEvent
  ) => void = (
    e: React.SyntheticEvent
  ): void => {
    setChanged(true);
  }

  /**
   * Handles the change event on the product field.
   *
   * @param { React.ChangeEvent } fieldEvent - the react event.
   */
  const handleChange: (
    fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void = (
    fieldEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const term: string = fieldEvent.target.value;

    setQuery(term);
    delayedQuery(term);
  }

  /**
   * Performs a search for similar product names.
   */
  const searchProducts: (
    query: string
  ) => Promise<void> = async (
    query: string
  ): Promise<void> => {

    // Set the submission state.
    setSubmitting(true)

    // Performt he product name search.
    API.requestAPI<ProductSearchResponse>('product/search/name', {
      method: RequestType.POST,
      body: JSON.stringify({name: query})
    })
    .then((response: ProductSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setOptions([]);
      } else {
        // Set the options returned.
        setOptions(response.products);
      }

      // Set the submission state.
      setSubmitting(false)
    })
    .catch((error: Error) => {
    });
  }

  /**
   * Updates the selected value for the product.
   */
  const updateProductName: (
  ) => void = (
  ): void => {
    // Set an empty list of options.
    setOptions([]);
    props.update({key: 'name', value: values.name});
    setSelected(true);
    setChanged(false);
  }

  return (
    <React.Fragment>
      <Grid
        container
        direction='column'
      >
        <Grid item xs={12} lg={6}>
          <Input
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleFocus={handleFocus}
            name='name'
            type='text'
            title="Product name"
            validation={validation.name}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ProductSelectList products={options} />
        </Grid>
        {showButton &&
          <Grid item xs={12} style={{marginTop: '.5rem'}}>
            <StyledButton
              clickAction={updateProductName}
              disabled={!changed}
              submitting={submitting}
              title={selected ? 'Update' : 'Add new'}
            />
          </Grid>
        }
      </Grid>
    </React.Fragment>
  );
}

export default ProductSelection;
