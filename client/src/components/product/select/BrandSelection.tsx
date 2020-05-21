/**
 * BrandSelection.tsx
 * Provides assistance to users adding a brand to rave.
 */

// Modules.
import * as React from 'react';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from '@material-ui/core/styles';

// Components.
import Input from '../../forms/input/Input';
import StyledButton from '../../elements/buttons/StyledButton';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { InputData } from '../../forms/input/Input.interface';
import {
  BrandSelectionProps,
  BrandSelectionForm
} from './BrandSelection.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Validation rules.
import {
  isRequired
} from '../../forms/validation/ValidationRules';

/**
 * Brand selection form schema.
 */
const formValidation: ValidationSchema = {
  brand: {
    errorMessage: '',
    rules: [
      isRequired
    ]
  }
};

/**
 * Assists the user in the selection of a product.
 */
const BrandSelection: React.FC<BrandSelectionProps> = (props: BrandSelectionProps) => {

  // Define the product selection form state.
  const [values, setValues] = React.useState<BrandSelectionForm>({
    brand: ''
  });

  // Define the state for checking if values have changed.
  const [changed, setChanged] = React.useState<boolean>(false);

  // Define the product selection state.
  const [selected, setSelected] = React.useState<boolean>(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

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
  const updateForm: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {

    // Reset the form errors based on field input.
    setFormErrorMessages(['']);

    const updatedValues: BrandSelectionForm = {
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

    props.update({key: 'brand', value: data.value});
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

  return (
    <Grid
      container
      direction='column'
    >
      <Grid item xs={12} lg={6} style={{marginBottom: '1.5rem', marginTop: '1rem'}}>
        <Typography variant='h3'>
          Product details
        </Typography>
      </Grid>
      <Grid item xs={12} lg={6} style={{marginBottom: '2rem'}}>
        <Typography variant='subtitle1'>
          Enter the brand and product names separately. We'll try to match them with known products to make the process as quick as possible.
        </Typography>
      </Grid>
      <Grid item xs={12} lg={6} style={{marginBottom: '2rem'}}>
        <Input
          handleBlur={updateForm}
          handleFocus={handleFocus}
          name='brand'
          type='text'
          title="Brand name"
          validation={validation.brand}
        />
      </Grid>
    </Grid>
  );
}

export default BrandSelection;
