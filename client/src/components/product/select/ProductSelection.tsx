/**
 * ProductSelection.tsx
 * Provides assistance to users adding a product to rave.
 */

// Modules.
import * as React from 'react';
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
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import debounce from 'lodash/debounce';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  useSnackbar,
  VariantType
} from 'notistack';

// Components.
import Input from '../../forms/input/Input';
import LoadingTagsList from '../../placeholders/loadingTagsList/LoadingTagsList';
import ProductSelectList from './ProductSelectList';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';

// Hooks.
import { useAnalytics } from '../../../components/analytics/Analytics.provider';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../../components/analytics/Analytics.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../Product.interface';
import {
  AddProductFormResponse,
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
 * Create styles product selection.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  brandTitle: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(0, 2),
    fontWeight: 600
  },
  buttonContainer: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(6)
  },
  centerAlignContent: {
    textAlign: 'center'
  },
  centerItem: {
    alignSelf: 'center'
  },
  container: {
    height: 'calc(100vh - 100px)',
    position: 'absolute',
    left: 0,
    top: '100px',
    width: '100%'
  },
  helpContainer: {
    height: '100%'
  },
  helpContent: {
    textAlign: 'center',
    padding: theme.spacing(2)
  },
  helpTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(2)
  },
  helpSubtitle: {
    fontSize: '0.85rem',
    lineHeight: '1rem',
    marginBottom: theme.spacing(2)
  },
  input: {
    flexGrow: 1
  },
  inputContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    width: '100%',
  },
  inputContainerLarge: {
    width: '75%',
    margin: `24px auto 16px`
  },
  inputContainerExtraLarge: {
    width: '50%',
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderBottom: 'none',
      borderLeft: 'none',
      borderRight: 'none'
    }
  },
  inputFieldLarge: {
    '& .MuiOutlinedInput-root': {
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRight: 'none'
    }
  },
  nextButton: {
    borderRadius: 0,
    lineHeight: '2.8rem'
  },
  nextButtonLarge: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    lineHeight: '2.8rem'
  },
  noResultsContainer: {
    height: '100%'
  },
  results: {
    height: '100%'
  },
  resultsContainer: {
    height: 'calc(100vh - 160px)',
    overflowY: 'auto'
  },
  resultsContainerLarge: {
    marginTop: theme.spacing(2)
  },
  stepNumber: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 25,
    color: theme.palette.common.white,
    display: 'block',
    lineHeight: '50px',
    marginBottom: theme.spacing(6),
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 50
  },
  previousButton: {
    borderRadius: 0,
    lineHeight: '2.8rem'
  }
}));

/**
 * Assists the user in the selection of a product.
 */
const ProductSelection: React.FC<ProductSelectionProps> = (props: ProductSelectionProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Match the mobile media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm')),
        extraLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // Define the product selection form state.
  const [values, setValues] = React.useState<ProductSelectionForm>({
    name: '',
    brandId: props.brand._id,
    brandName: props.brand.name
  });

  // Define the product selection state.
  const [selected, setSelected] = React.useState<boolean>(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  // Set the product search query.
  const [query, setQuery] = React.useState<string>('');

  // Define the debounce function for search queries.
  const delayedQuery = React.useCallback(debounce((q: string) => searchProducts(q), 300), []);

  const [options, setOptions] = React.useState<Array<Product>>([]);

  // Set the touched state of the form so the help content can be removed.
  const [touched, setTouched] = React.useState<boolean>(false);

  // Set a searching flag to show placeholders when attempting to find matches.
  const [searching, setSearching] = React.useState<boolean>(false)


  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: formValidation
  });

  /**
   * Handles updates to the product name.
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
   * Performs the update for the product selection.
   *
   * @param { Product } product - the selected product.
   */
  const selectProduct: (
    product: Product
  ) => void = (
    product: Product
  ): void => {
    props.complete(product);
  }
  
  /**
   * Handles creating a new product and navigating to the next step.
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
    
    // Validate all of the fieds in the form.
    const errors: Array<string> = await validateAllFields({
      'name': values.name,
      'brand': props.brand.name
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

    API.requestAPI<AddProductFormResponse>('product/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify(values)
    })
    .then((response: AddProductFormResponse) => {
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
        'id': response.product._id,
        'name': response.product.name,
        'brand name': props.brand.name,
        'brand id': props.brand._id
      };

      analytics.trackEvent(`add new product`)(eventData);

      props.update(response.product);
    })
    .catch((error: Error) => {
      enqueueSnackbar('There was a problem adding your product', { variant: 'error'});
    })
  }

  /**
   * Performs a search for similar product names.
   */
  const searchProducts: (
    query: string
  ) => Promise<void> = async (
    query: string
  ): Promise<void> => {

    // Remove the help text if it's currently being displayed.
    if (!touched) {
      setTouched(true);
    }

    // Set the submission state.
    setSearching(true)

    // Performt he product name search.
    API.requestAPI<ProductSearchResponse>('product/search/name', {
      method: RequestType.POST,
      body: JSON.stringify({
        name: query,
        brand: props.brand._id
      })
    })
    .then((response: ProductSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setOptions([]);
      } else {
        // Set the options returned.
        setOptions(response.products);
        analytics.trackEvent('search existing product')({
          'term': query
        });
      }

      // Set the submission state.
      setSearching(false)
    })
    .catch((error: Error) => {
      console.log(error);
    });
  }

  return (
    <Box className={clsx(classes.container)}>
      <Box className={clsx({
        [classes.inputContainer]: !largeScreen,
        [classes.inputContainerLarge]: largeScreen,
        [classes.inputContainerExtraLarge]: extraLargeScreen
      })}>
        <Grid container>
          <Grid item className={clsx(classes.input)}>
            <Input
              className={clsx({
                [classes.inputField]: !largeScreen,
                [classes.inputFieldLarge]: largeScreen
              })}
              handleBlur={handleBlur}
              handleChange={handleChange}
              name='name'
              type='text'
              title="Product name"
              validation={validation.name}
            />
          </Grid>
          <Grid item>
            <StyledButton
              align='right'
              className={clsx({
                [classes.nextButton]: !largeScreen,
                [classes.nextButtonLarge]: largeScreen
              })}
              clickAction={submit}
              title='Next'
            />
          </Grid>
        </Grid>
      </Box>
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='stretch'
      >
        <Grid item xs={12} className={clsx(
          classes.resultsContainer, {
            [classes.resultsContainerLarge]: largeScreen
        })}>
          {touched ? (
            <Grid
              container
              className={clsx({
                [classes.results]: !largeScreen
              })}
              justify='center'
            >
              <Grid item xs={12} sm={9} lg={6}>
                {searching ? (
                  <Fade in={searching}>
                    <LoadingTagsList />
                  </Fade>
                ) : (
                  <Fade in={!searching} timeout={300}>
                    {options.length > 0 ? (
                      <React.Fragment>
                        <Typography variant='h2' className={clsx(classes.brandTitle)}>
                          {props.brand.name}
                        </Typography>
                        <ProductSelectList products={[...options]} select={selectProduct} />
                      </React.Fragment>
                    ) : (
                      <Grid
                      className={clsx({
                        [classes.noResultsContainer]: !largeScreen
                      })}
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Grid item className={clsx(classes.helpContent)}>
                          <Typography variant='h2' className={clsx(classes.helpTitle)}>
                            A new {props.brand.name} product
                          </Typography>
                          <Typography variant='subtitle1' className={clsx(classes.helpSubtitle)}>
                            Looks like you're the first to rave about this product on Ravebox. That's great!
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Fade>
                )}
              </Grid>
            </Grid>
          ) : (
            <Grid
              className={clsx({
                [classes.helpContainer]: !largeScreen
              })}
              container
              direction='row'
              justify='center'
              alignItems='center'
            >
              <Grid item className={clsx(classes.helpContent)}>
                <Typography variant='h2' className={clsx(classes.helpTitle)}>
                  Enter the name of your {props.brand.name} product
                </Typography>
                <Typography variant='subtitle1' className={clsx(classes.helpSubtitle)}>
                  If we already know this {props.brand.name} product, you'll be able to select it from the list. Otherwise, enter the product name (don't include the {props.brand.name} brand name) and hit next.
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Map the redux state to the product form properties.
 *
 */
function mapStateToProps(state: any, ownProps: ProductSelectionProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStateToProps
)(ProductSelection);
