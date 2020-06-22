/**
 * ProductForm.tsx
 * Product form component.
 */

// Modules.
import API from '../../../utils/api/Api.model';
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
import Fade from '@material-ui/core/Fade';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { VariantType, useSnackbar } from 'notistack';
import { withRouter } from 'react-router';

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
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
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
 * Create styles for the page title.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  padding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

/**
 * Product validation schema.
 */
const productValidation: ValidationSchema = {
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

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Match the mobile media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

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

  React.useEffect(() => {
  }, [product]);

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: productValidation
  });

  /**
   * Updates the categories with the selected field.
   *
   * @param { Array<string> } selected - the selected categories.
   */
  const updateCategories: (
    categoryType: string
  ) => (
    selected: Array<CategoryItem>
  ) => void = (
    categoryType: string
  ) => (
    selected: Array<CategoryItem>
  ): void => {

    // Reset the form errors based on field input.
    setFormErrorMessages(['']);

    setProduct({
      ...product,
      categories: selected
    });

    // Create the event object from the provided values.
    const eventData: EventObject = {
      'brand name': product.brand,
      'product name': product.name
    };

    if (categoryType === 'category') {
      eventData['product category'] = selected[0].key;
      analytics.trackEvent(`add category`)(eventData);
    }

    if (categoryType === 'sub-category') {
      eventData['product category'] = selected[0].key;
      eventData['product sub-category'] = selected[1].key;
      analytics.trackEvent(`add sub-category`)(eventData);
    }
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

    // Create the event object from the provided values.
    const eventData: EventObject = {
      'brand name': product.brand,
      'product name': product.name
    };

    if (product.categories && product.categories.length > 0) {
      eventData['product category'] = product.categories[0].key;

      if (product.categories.length > 1) {
        eventData['product sub-category'] = product.categories[1].key;
      }
    }

    if (data.key === 'brand') {
      eventData['brand name'] = data.value;
    }

    if (data.key === 'name') {
      eventData['product name'] = data.value;
    }

    analytics.trackEvent(`add ${data.key}`)(eventData);
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
    e: React.MouseEvent<HTMLButtonElement>
  ) => Promise<void> = async (
    e: React.MouseEvent<HTMLButtonElement>
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

      // Create the event object from the provided values.
      const eventData: EventObject = {
        'brand name': response.product.brand,
        'product id': response.product._id,
        'product name': response.product.name
      };

      if (response.product.categories && response.product.categories.length > 0) {
        eventData['product category'] = response.product.categories[0].key;

        if (response.product.categories.length > 1) {
          eventData['product sub-category'] = response.product.categories[1].key;
        }
      }

      analytics.trackEvent(`add new product`)(eventData);

      // Redirect to the add review screen.
      props.history.push(`/product/${response.product._id}/review`);

    })
    .catch((error: Error) => {
      console.error(error);
    })
  };

  return (
    <form noValidate autoComplete='off'>
      <Grid
        container
        direction='column'
      >
        <Box className={clsx(classes.padding)}
        >
          <BrandSelection update={updateInputs} />
          <ProductSelection update={updateInputs} brand={product.brand} />
          <CategorySelection
            update={updateCategories}
            visible={product.name !== ''}
          />
          <Grid item xs={12} md={6} style={{marginTop: '2rem'}}>
            <ErrorMessages errors={formErrorMessages} />
          </Grid>
          <Fade in={product.categories.length > 1} timeout={300}>
            <Grid item xs={12}>
              <StyledButton
                clickAction={submit}
                color='secondary'
                disabled={submitting}
                submitting={submitting}
                title='Next'
              />
            </Grid>
          </Fade>
        </Box>
      </Grid>
    </form>
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
