/**
 * ProductTypeSelection.tsx
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
import ProductTypeSelectList from './ProductTypeSelectList';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';
import { TagAssociation } from '../../tag/Tag.enum';

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
  AddProductTypeFormResponse,
  ProductTypeSearchResponse,
  ProductTypeSelectionProps,
  ProductTypeSelectionForm
} from './ProductTypeSelection.interface';
import { Tag } from '../../tag/Tag.interface';
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
  previousButton: {
    borderRadius: 0,
    lineHeight: '2.8rem'
  },
  nextButton: {
    borderRadius: 0,
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
  }
}));

/**
 * Assists the user in the selection of a product.
 */
const ProductTypeSelection: React.FC<ProductTypeSelectionProps> = (props: ProductTypeSelectionProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Match the mobile media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('sm'));

  // Define the product selection form state.
  const [values, setValues] = React.useState<ProductTypeSelectionForm>({
    name: ''
  });

  // Define the product selection state.
  const [selected, setSelected] = React.useState<boolean>(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  // Set's a submission state for updating a product type.
  const [updating, setUpdating] = React.useState<boolean>(false);

  // Set the product search query.
  const [query, setQuery] = React.useState<string>('');

  // Define the debounce function for search queries.
  const delayedQuery = React.useCallback(debounce((q: string) => searchProductTypes(q), 300), []);

  const [options, setOptions] = React.useState<Array<Tag>>([]);

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

    const updatedValues: ProductTypeSelectionForm = {
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
   * Performs a product update using the tag id.
   *
   * @param { Brand } brand - the selected brand.
   */
  const selectTag: (
    tag: Tag
  ) => void = (
    tag: Tag
  ): void => {

    const product: Product = {
      ...props.product,
      productType: tag
    };

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true)

    API.requestAPI<AddProductTypeFormResponse>('product/update/type', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        id: props.product._id,
        tagId: tag._id
      })
    })
    .then((response: AddProductTypeFormResponse) => {

      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar('Product type added successfully', { variant: 'success' });

      // Create the event object from the provided values.
      const eventData: EventObject = {
        'brand id': props.product.brand._id,
        'brand name': props.product.brand.name,
        'product id': props.product._id,
        'product name': props.product.name,
        'product type id': response.product.productType.name,
        'product type name': response.product.productType.name
      };

      analytics.trackEvent(`assign product type`)(eventData);

      setSubmitting(false);

      props.complete(product);

    })
    .catch((error: Error) => {
      enqueueSnackbar('There was a problem adding your product type', { variant: 'error'});
    })
  }
  
  /**
   * Handles adding a product type to the product.
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

    API.requestAPI<AddProductTypeFormResponse>('product/update/type', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        id: props.product._id,
        name: values.name
      })
    })
    .then((response: AddProductTypeFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar('Product type added successfully', { variant: 'success' });

      // Create the event object from the provided values.
      const eventData: EventObject = {
        'brand id': props.product.brand._id,
        'brand name': props.product.brand.name,
        'product id': props.product._id,
        'product name': props.product.name,
        'product type id': response.product.productType.name,
        'product type name': response.product.productType.name
      };

      analytics.trackEvent(`add new product type`)(eventData);

      props.complete(response.product);
    })
    .catch((error: Error) => {
      enqueueSnackbar('There was a problem adding your product type', { variant: 'error'});
    })
  }

  /**
   * Performs a search for similar product names.
   */
  const searchProductTypes: (
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
    API.requestAPI<ProductTypeSearchResponse>('tag/search/name', {
      method: RequestType.POST,
      body: JSON.stringify({
        association: TagAssociation.PRODUCT,
        name: query,
      })
    })
    .then((response: ProductTypeSearchResponse) => {

      if (response.errorCode) {
        // Set an empty list of options.
        setOptions([]);
      } else {
        // Set the options returned.
        setOptions(response.tags);
        analytics.trackEvent('search existing product types')({
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
      <Grid
        container
        direction='row'
        justify='center'
        alignItems='stretch'
      >
        <Grid item xs={12} className={clsx(classes.resultsContainer)}>
          {touched ? (
            <Grid
              container
              className={clsx(classes.results)}
            >
              <Grid item xs={12}>
                {searching ? (
                  <Fade in={searching}>
                    <LoadingTagsList />
                  </Fade>
                ) : (
                  <Fade in={!searching} timeout={300}>
                    {options.length > 0 ? (
                      <ProductTypeSelectList product={{...props.product}} tags={[...options]} select={selectTag} />
                    ) : (
                      <Grid
                        className={classes.noResultsContainer}
                        container
                        direction='row'
                        justify='center'
                        alignItems='center'
                      >
                        <Grid item className={clsx(classes.helpContent)}>
                          <Typography variant='h2' className={clsx(classes.helpTitle)}>
                            A new product type
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
              className={classes.helpContainer}
              container
              direction='row'
              justify='center'
              alignItems='center'
            >
              <Grid item className={clsx(classes.helpContent)}>
                <Typography variant='h2' className={clsx(classes.helpTitle)}>
                  What type of product is this?
                </Typography>
                <Typography variant='subtitle1' className={clsx(classes.helpSubtitle)}>
                  By entering the product type, it will ensure your rave is displayed with similar products. Example product types are "moisturizer", "mascara", "phone", "gaming console", "television".
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Box className={clsx(classes.inputContainer)}>
        <Grid container>
          <Grid item className={clsx(classes.input)}>
            <Input
              className={classes.inputField}
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
              className={classes.nextButton}
              clickAction={submit}
              title='Next'
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  /*
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
  */
}

/**
 * Map the redux state to the product form properties.
 *
 */
function mapStateToProps(state: any, ownProps: ProductTypeSelectionProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStateToProps
)(ProductTypeSelection);
