/**
 * AdminProductRow.tsx
 * Renders the component displaying a product row.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import clsx from 'clsx';
import Collapse from '@material-ui/core/Collapse';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import * as React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  useSnackbar,
  VariantType
} from 'notistack';

// Components.
import AdminAutoCompleteField from '../autocompleteField/AdminAutoCompleteField';
import Input from '../../forms/input/Input';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RequestType } from '../../../utils/api/Api.enum';
import { TagAssociation } from '../../tag/Tag.enum';

// Hooks.
import { useValidation } from '../../forms/validation/useValidation.hook';
import { useAutocompleteBrandSearch } from '../../brand/search/useAutocompleteBrandSearch.hook';
import { useAutocompleteTagSearch } from '../../tag/search/useAutocompleteTagSearch.hook';

// Interfaces.
import { AddBrandFormResponse } from '../../brand/select/BrandSelection.interface'; 
import { AddTagFormResponse } from '../../tag/Tag.interface';
import {
  AdminProductRowProps,
  UpdateProductFormResponse
} from './AdminProductRow.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../../product/Product.interface';

// Validation rules.
import {
  isRequired
} from '../../forms/validation/ValidationRules';

/**
 * Create styles for the admin products screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  collapsibleCell: {
    paddingBottom: 0,
    paddingTop: 0
  },
  formContainer: {
    padding: theme.spacing(4, 0),
    position: 'relative'
  },
  tableCell: {
    backgroundColor: 'transparent',
    padding: theme.spacing(1, 2)
  },
  tableRow: {
    '&:hover': {
      backgroundColor: `rgba(250, 250, 250)`
    }
  }
}));

/**
 * Renders the product row for the admin screen.
 */
const AdminProductRow: React.FC<AdminProductRowProps> = (props: AdminProductRowProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Define the state of the collapsible form.
  const [open, setOpen] = React.useState<boolean>(false); 

  // Set a form submission state, used to inform the user their form has been
  // submitted and to prevent duplicate submissions.
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  // Set the product state to be updated using the edit form.
  const [product, setProduct] = React.useState<Product>({...props.product});

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // Use the autocomplete search hook for search requests.
  const {
    brandQuery,
    brandResultNames,
    brandResults,
    brandRetrievalStatus,
    closeBrandSearchResults,
    delayedBrandQuery
  } = useAutocompleteBrandSearch();

  // Use the autocomplete search hook for product type search requests.
  const productType = useAutocompleteTagSearch({
    association: TagAssociation.PRODUCT
  });

  /**
   * Handles the brand selection.
   */
  const handleBrandSelect: (
    index: number
  ) => void = (
    index: number
  ): void => {
    setProduct({
      ...product,
      brand: {...brandResults[index]}
    });
  }

  /**
   * Handles the product type selection.
   */
  const handleProductTypeSelect: (
    index: number
  ) => void = (
    index: number
  ): void => {
    setProduct({
      ...product,
      productType: {...productType.tagResults[index]}
    });
  }

  /**
   * Handles a new brand creation.
   *
   * @param { string } name - the name of the brand to create.
   */
  const handleBrandCreate: (
    name: string
  ) => void = (
    name: string
  ): void => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<AddBrandFormResponse>('brand/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        name: name
      })
    })
    .then((response: AddBrandFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar(`${response.brand.name} created successfully`, { variant: 'success' });

      // Update the product with the brand details.
      setProduct({
        ...product,
        brand: {...response.brand}
      });
      setSubmitting(false);
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${product.name}`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles a new product type creation.
   *
   * @param { string } name - the name of the product type to create.
   */
  const handleProductTypeCreate: (
    name: string
  ) => void = (
    name: string
  ): void => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<AddTagFormResponse>('tag/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        name: name,
        association: TagAssociation.PRODUCT
      })
    })
    .then((response: AddTagFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar(`${response.tag.name} created successfully`, { variant: 'success' });

      // Update the product with the product type details.
      setProduct({
        ...product,
        productType: {...response.tag}
      });
      setSubmitting(false);
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${product.name}`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles updates to the product form field.
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
   * Handles updates to the brand field.
   *
   * @param { InputData } data - the field data.
   */
  const updateBrand: (
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
   * Saves the product data.
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

    // Set the submission state.
    setSubmitting(true)

    API.requestAPI<UpdateProductFormResponse>('product/update', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        product: {
          _id: product._id,
          name: product.name,
          brand: product.brand ? product.brand._id : '',
          productType: product.productType ? product.productType._id : ''
        }
      })
    })
    .then((response: UpdateProductFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar(`${product.name} updated successfully`, { variant: 'success' });

      props.update(response.product)(props.index);

      setOpen(false);
      setSubmitting(false);
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${product.name}`, { variant: 'error'});
      setSubmitting(false);
    });

  }

  return (
    <React.Fragment>
      <TableRow className={clsx(classes.tableRow)}>
        <TableCell component='th' scope='row' className={clsx(classes.tableCell)}>
          {props.product.brand ? props.product.brand.name : 'N/A'}
        </TableCell>
        <TableCell className={clsx(classes.tableCell)}>
          {props.product.name}
        </TableCell>
        <TableCell className={clsx(classes.tableCell)}>
          {props.product.productType ? props.product.productType.name : 'N/A'}
        </TableCell>
        <TableCell align='right' className={clsx(classes.tableCell)}>
          <IconButton
            onClick={() => setOpen(!open)}
            title={`Edit ${props.product.name}`}
          >
            {open ? (
              <CancelRoundedIcon color='primary' />
            ): (
              <EditRoundedIcon color='primary' />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={clsx(classes.collapsibleCell)} colSpan={4}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <form noValidate autoComplete='off'>
              <Grid
                className={clsx(classes.formContainer)}
                container 
                spacing={2}
              >
                <Grid item xs={12} lg={6} style={{zIndex: 99}}>
                  <AdminAutoCompleteField
                    addEnabled={true}
                    addNew={handleBrandCreate}
                    close={closeBrandSearchResults}
                    defaultValue={product.brand ? product.brand.name : ''}
                    fieldTitle={'Brand'}
                    search={delayedBrandQuery}
                    select={handleBrandSelect}
                    options={[...brandResultNames]}
                  /> 
                </Grid>
                <Grid item xs={12} lg={6} style={{zIndex: 98}}>
                  <Input
                    defaultValue={product.name}
                    handleBlur={updateInputs}
                    name='name'
                    required={true}
                    type='text'
                    title="Product name"
                  />
                </Grid>
                <Grid item xs={12} lg={6} style={{zIndex: 98}}>
                  <AdminAutoCompleteField
                    addEnabled={true}
                    addNew={handleProductTypeCreate}
                    close={productType.closeTagSearchResults}
                    defaultValue={product.productType ? product.productType.name : ''}
                    fieldTitle={'Product type'}
                    search={productType.delayedTagQuery}
                    select={handleProductTypeSelect}
                    options={[...productType.tagResultNames]}
                  /> 
                </Grid>
                <Grid item xs={12}>
                  <StyledButton
                    title='Save'
                    clickAction={submit}
                  />
                </Grid>
              </Grid>
            </form>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

/**
 * Map the redux state to the product form properties.
 *
 */
const mapStateToProps = (state: any, ownProps: AdminProductRowProps): AdminProductRowProps => {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStateToProps
)(AdminProductRow);
