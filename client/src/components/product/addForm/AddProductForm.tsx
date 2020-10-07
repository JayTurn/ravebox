/**
 * AddProductForm.tsx
 * AddProduct form component.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import Backdrop from '@material-ui/core/Backdrop';
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
import LinearProgress from '@material-ui/core/LinearProgress';
import Modal from '@material-ui/core/Modal';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { VariantType, useSnackbar } from 'notistack';
import { withRouter } from 'react-router';

// Components.
import CategorySelection from '../../category/selection/CategorySelection';
import ErrorMessages from '../../forms/errorMessages/ErrorMessages';
import PaddedDivider from '../../elements/dividers/PaddedDivider';
import ProductSelection from '../select/ProductSelection';
import ProductTypeSelection from '../type/ProductTypeSelection';
import BrandSelection from '../../brand/select/BrandSelection';
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
import { Brand } from '../../brand/Brand.interface';
import { CategoryItem } from '../../category/Category.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../../product/Product.interface';
import {
  AddProductFormProps,
  AddProductFormResponse,
  AddProductStep
} from './AddProductForm.interface';
import { ValidationSchema } from '../../forms/validation/Validation.interface';

// Utilities.
import { emptyTag } from '../../tag/Tag.common';

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
  container: {
    backgroundColor: theme.palette.common.white,
    height: '100%',
    width: '100%'
  },
  contentContainer: {
    height: 'calc(100% - 100px)'
  },
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    outline: 0
  },
  padding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  stepCancelContainer: {
    alignSelf: 'center',
    flexGrow: 1,
    marginRight: theme.spacing(2)
  },
  stepCancelContainerLarge: {
    marginRight: 0
  },
  stepCircleContainer: {
    marginLeft: theme.spacing(2)
  },
  stepCircleContainerLarge: {
    marginLeft: 0
  },
  stepContainer: {
    margin: theme.spacing(1, 0, 2),
    flexWrap: 'nowrap'
  },
  stepCounterContainer: {
    marginLeft: theme.spacing(2)
  },
  stepCounter: {
    color: theme.palette.primary.main,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  stepCircleLabel: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 26,
    color: theme.palette.common.white,
    display: 'block',
    fontSize: '1.5em',
    fontWeight: 500,
    height: '50px',
    lineHeight: '50px',
    margin: '5px',
    textTransform: 'uppercase',
    textAlign: 'center',
    width: '50px'
  },
  stepCircleOutline: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 34,
    height: 62,
    width: 62
  },
  stepHelp: {
    fontSize: '.85rem',
  },
  stepTitle: {
    fontSize: '1.15rem',
    fontWeight: 600,
    marginBottom: 0,
    textTransform: 'uppercase'
  },
}));

/**
 * AddProduct validation schema.
 */
const brandValidation: ValidationSchema = {
  name: {
    errorMessage: '',
    rules: [
      isRequired
    ]
  }
};

/**
 * Defines the product creation steps.
 */
const retrieveSteps: (
) => Array<AddProductStep> = (
): Array<AddProductStep> => {
  return [{
    completed: false,
    help: 'Enter the brand name for the product you are raving about.',
    id: 'brand',
    title: 'Brand'
  }, {
    completed: false,
    help: `Enter the name of the product you are raving about. You don't need to include the brand.`,
    id: 'product',
    title: 'Product name'
  }, {
    completed: false,
    help: `Enter the type of product you are raving about. E.G. phone, moisturizer, earphones, televion etc.`,
    id: 'productType',
    title: 'Product type'
  }];
}

/**
 * Renders the product form component.
 */
const AddProductForm: React.FC<AddProductFormProps> = (
  props: AddProductFormProps
) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Match the mobile media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // Validation hook.
  const {
    validation,
    validateField,
    validateAllFields
  } = useValidation({
    validation: brandValidation
  });

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Set the open state of the modal.
  const [open, setOpen] = React.useState<boolean>(true);

  // Create the steps to be used for creating a product.
  const [step, setStep] = React.useState<number>(0);

  // Define the step information.
  const [steps, setSteps] = React.useState<Array<AddProductStep>>(retrieveSteps());

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  const [backButtonLabel, setBackButtonLabel] = React.useState<string>('Cancel');

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState(false);

  const [brand, setBrand] = React.useState<Brand>({
    _id: '',
    logo: '',
    name: '',
    url: ''
  });

  // Define the product details.
  const [product, setProduct] = React.useState<Product>({
    _id: '',
    brand: brand,
    category: emptyTag(),
    competitors: [],
    complementary: [],
    description: '',
    name: '',
    productType: emptyTag(),
    tags: [],
    url: ''
  });

  const [brandChanged, setBrandChanged] = React.useState<boolean>(false);

  /**
   * Handles the display for creating a new user.
   */
  const handleOverlay: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setOpen(!open);
  }

  /**
   * Handles going back a step.
   */
  const handleBack: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {

    // If we're on the first step we should cancel and redirect to the 
    // users reviews. If we we're on any other step, ensure the button
    // handles as a backward step.
    if (step === 0) {

      setOpen(false);
      props.history.push('/user/reviews');

    } else {

      // Define the updated step to be set using the back button.
      const updatedStep: number = step > 0 ? step - 1 : step;

      const label: string = step === 0 ? 'Cancel' : 'Back';

      setBackButtonLabel(label);

      setStep(updatedStep);

    }
  }

  /**
   * Updates the selected brand.
   *
   * @param { Brand } brand - the selected brand.
   */
  const updateBrand: (
    brand: Brand
  ) => void = (
    brand: Brand
  ): void => {
    setProduct({
      ...product,
      brand: {...brand}
    });

    setBackButtonLabel('Back');

    setStep(1);
  }

  /**
   * Updates the selected product.
   *
   * @param { Product } product - the selected product.
   */
  const updateProduct: (
    data: Product
  ) => void = (
    data: Product
  ): void => {
    setProduct({
      ...product,
      name: data.name
    });

    setStep(2);
  }

  /**
   * Completes the new product process.
   *
   * @param { Product } product - the selected product.
   */
  const complete: (
    data: Product
  ) => void = (
    data: Product
  ): void => {
    setOpen(false);
    props.history.push(`/product/${data._id}/review`);
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

  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300
      }}
      className={clsx(classes.modal)}
      closeAfterTransition
      open={open}
      onClose={handleOverlay}
    >
      <Box className={clsx(classes.container)}>
        <Grid
          container
          direction='row'
          justify='center'
          alignItems='stretch'
        >
          <Grid item xs={12} className={clsx(classes.stepContainer)}>
            <Grid
              container
              justify='center'
            >
              <Grid item xs={12} lg={6}>
                <Grid
                  container
                  className={clsx(classes.stepContainer)} 
                  alignItems='center'
                >
                  <Grid item className={clsx(
                    classes.stepCircleContainer, {
                      [classes.stepCircleContainerLarge]: largeScreen
                    }
                  )}>
                    <Box className={clsx(classes.stepCircleOutline)}>
                      <Typography variant='body1' className={clsx(classes.stepCircleLabel)}>
                        {(step + 1)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Grid container className={clsx(classes.stepCounterContainer)}>
                      <Grid item xs={12}>
                        <Typography variant='body1' className={clsx(classes.stepCounter)}>
                          Step {(step + 1)} of {steps.length}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant='h2' className={clsx(classes.stepTitle)}>
                          {steps[step].title}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    className={clsx(classes.stepCancelContainer)}
                    item
                  >
                    <StyledButton
                      align='right'
                      title={backButtonLabel}
                      clickAction={handleBack}
                      variant='outlined'
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <LinearProgress variant='determinate' value={(((step + 1) / steps.length) * 100)} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} className={clsx(classes.contentContainer)}>
            <Grid
              container
              justify='center'
            >
              <Grid item xs={12} lg={6}>
                {step === 0 &&
                  <Fade in={step === 0}>
                    <BrandSelection
                      completed={steps[0].completed}
                      update={updateBrand}
                    />
                  </Fade>
                }
                {step === 1 &&
                  <Fade in={step === 1}>
                    <ProductSelection
                      brand={product.brand}
                      complete={complete}
                      update={updateProduct}
                    />
                  </Fade>
                }
                {step === 2 &&
                  <Fade in={step === 2}>
                    <ProductTypeSelection
                      product={product}
                      complete={complete}
                    />
                  </Fade>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

/**
 * Map the redux state to the product form properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AddProductFormProps) {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default withRouter(connect(
  mapStatetoProps
)(AddProductForm));
