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
import AdminProductImageGroup from './AdminProductImageGroup';
import ImageUpload from '../../forms/imageUpload/ImageUpload';
import Input from '../../forms/input/Input';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { ImageUploadPaths } from '../../forms/imageUpload/ImageUpload.enum';
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
import { ImageAndTitle } from '../../elements/image/Image.interface';
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
  },
  verticalMargin: {
    margin: theme.spacing(2, 0)
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
   * Handles the submit button event.
   */
  const handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    submit(true);
  }

  /**
   * Handles the updates to the product images.
   *
   * @param { string } path - the path to the poster image.
   */
  const addImage: (
    path: string
  ) => void = (
    path: string
  ): void => {

    const images: Array<ImageAndTitle> = product.images || [];
    const updatedProduct: Product = {...product};

    images.push({
      title: `${product.brand.name} ${product.name} photo ${images.length}`,
      url: path
    });

    updatedProduct.images = images;

    setProduct({...updatedProduct});

    // Save the form so we don't orphan images.
    submit(false)(updatedProduct);
  }

  /**
   * Updates the images in the product and saves the changes.
   *
   * @param { Array<ImageAndTitle> } images - the images to be updated.
   */
  const updateImages: (
    images: Array<ImageAndTitle>
  ) => void = (
    images: Array<ImageAndTitle>
  ): void => {
    const updatedProduct: Product= {...product};

    updatedProduct.images = [...images];

    // Update the images in the product.
    setProduct({...updatedProduct});

    // Save the form.
    submit(false)(updatedProduct);
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
    closeOnSave: boolean
  ) => (
    data: Product
  ) => Promise<void> = (
    closeOnSave: boolean
  ) => async (
    data: Product
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
          _id: data._id,
          name: data.name,
          brand: data.brand ? data.brand._id : '',
          description: data.description,
          images: data.images,
          productType: data.productType ? data.productType._id : ''
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
      enqueueSnackbar(`${data.name} updated successfully`, { variant: 'success' });

      props.update(response.product)(props.index);

      setSubmitting(false);

      if (closeOnSave) {
        setOpen(false);
      }

    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem updating ${data.name}`, { variant: 'error'});
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
                <Grid item xs={12} style={{zIndex: 98}}>
                  <Input
                    defaultValue={product.description}
                    handleBlur={updateInputs}
                    multiline
                    name='description'
                    required={false}
                    rows={4}
                    type='text'
                    title="Product description"
                  />
                </Grid>
                <Grid item xs={12}>
                  {product.images && product.images.length > 0 &&
                    <AdminProductImageGroup
                      images={product.images}
                      update={updateImages}
                    />
                  }
                </Grid>
                <Grid item xs={12}>
                  <ImageUpload 
                    aspectRatio={1}
                    id={product._id}
                    buttonTitle='Add image'
                    maxFileSize={0.2}
                    path={''} 
                    requestPath={ImageUploadPaths.PRODUCT_PHOTO}
                    update={addImage} 
                  />
                </Grid>
                <Grid item xs={12} className={clsx(classes.verticalMargin)}>
                  <StyledButton
                    title='Save'
                    clickAction={handleSubmit}
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
