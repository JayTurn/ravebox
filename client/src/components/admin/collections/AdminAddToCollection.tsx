/**
 * AdminAddToCollection.tsx
 * Renders the component displaying the add to collection form.
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
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  useSnackbar,
  VariantType
} from 'notistack';

// Components.
import AdminAutoCompleteField from '../autocompleteField/AdminAutoCompleteField';
import AdminCollectionList from './AdminCollectionList';
import AdminUpdateCollection from './AdminUpdateCollection';
import Input from '../../forms/input/Input';
import LoadingCollectionsGrid from '../../placeholders/loadingCollectionsGrid/LoadingCollectionsGrid';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useAutocompleteProductSearch } from '../../product/search/useAutocompleteProductSearch.hook';
import { useRetrieveCollectionById } from '../../collection/useRetrieveCollectionById.hook';

// Interfaces.
import {
  AdminAddToCollectionProps,
  CollectionsFormResponse
} from './AdminAddToCollection.interface';
import { Collection } from '../../collection/Collection.interface';
import { InputData } from '../../forms/input/Input.interface';
import { Product } from '../../product/Product.interface';

// Utilities.
import { emptyProduct } from '../../product/Product.common';

/**
 * Create styles for the admin product images component.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(2)
  },
  collectionsText: {
    margin: theme.spacing(1, 0),
    textAlign: 'center'
  },
  collectionsTextContainer: {
    padding: theme.spacing(1, 0),
    marginBottom: theme.spacing(2)
  },
  collectionTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  editButtonContainer: {
    textAlign: 'center',
    marginBottom: theme.spacing(1)
  },
  formContainer: {
    height: '100%',
    padding: theme.spacing(2)
  },
  modal: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  },
  modalContainer: {
    height: '100vh',
    outline: 0,
    overflowY: 'auto',
    width: '100vw'
  },
  searchContainer: {
    marginBottom: theme.spacing(4)
  },
  textContent: {
    margin: theme.spacing(1, 0)
  },
  textContainer: {
    marginBottom: theme.spacing(4)
  },
  title: {
    marginBottom: 0
  },
  titleContainer: {
    padding: theme.spacing(2, 0, 4)
  }
}));

/**
 * Renders the add to collection admin screen.
 */
const AdminAddToCollection: React.FC<AdminAddToCollectionProps> = (props: AdminAddToCollectionProps) => {

  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  // Register the snackbar.
  const { enqueueSnackbar } = useSnackbar();

  // Use the autocomplete search hook for search requests.
  const {
    productQuery,
    productResultNames,
    productResults,
    productRetrievalStatus,
    closeProductSearchResults,
    delayedProductQuery
  } = useAutocompleteProductSearch();

  // Retrieves the existing collection.
  const {
    collections,
    collectionStatus,
    retrieveCollection
  } = useRetrieveCollectionById({
    id: props.product._id,
    collectionType: 'product',
    context: props.context,
    retrievalStatus: RetrievalStatus.REQUESTED
  });

  // Set the open state of the modal.
  const [open, setOpen] = React.useState<boolean>(false);

  // Form error messages to be displayed if fields haven't been validated
  // and prevents submissions to the api.
  const [formErrorMessages, setFormErrorMessages] = React.useState(['']);

  // State handler for the form submission.
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = React.useState<Product>(emptyProduct());

  /**
   * Handles adding the current product to an existing collection.
   *
   * @param { string } collectionId - the id of an existing collection.
   */
  const addToCollection: (
    collection: Collection
  ) => void = (
    collection: Collection
  ): void => {

    // Define the current list of products.
    const products: Array<Product> = [...collection.products || []];

    // Map the product ids to an array for use in updating the collection
    // in the database.
    const productIds: Array<string> = products.map((product: Product) => {
      return product._id;
    })

    if (!productIds.includes(props.product._id)) {
      // Add the current product to the collection.
      productIds.push(props.product._id);
    }

    update({...collection})([...productIds]);
  }

  /**
   * Handles removing the current product from the collection.
   *
   * @param { string } collectionId - the id of an existing collection.
   */
  const removeFromCollection: (
    collection: Collection
  ) => void = (
    collection: Collection
  ): void => {

    // Define the current list of products.
    const products: Array<Product> = [...collection.products || []];


    if (products.length <= 0) {
      update({...collection})([]);

      return;
    }

    // Create a new array of product ids without the current product.
    let i: number = 0;
    const productIds: Array<string> = [];
    do {
      const current: string = products[i]._id;

      if (current !== props.product._id) {
        productIds.push(current);
      }

      i++;
    } while (i < products.length);

    update({...collection})([...productIds]);
  }

  /**
   * Handles updating the collection with the changes.
   *
   * @param { string } collectionId - the id of an existing collection.
   */
  const update: (
    collection: Collection
  ) => (
    products: Array<string>
  ) => void = (
    collection: Collection
  ) => (
    products: Array<string>
  ): void => {
    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    // Perform the request to add this product id to the collection
    API.requestAPI<CollectionsFormResponse>('collection/product/update', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        context: props.context,
        id: collection._id,
        products: products,
        title: collection.title
      })
    })
    .then((response: CollectionsFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar(`${props.context} collection created successfully`, { variant: 'success' });

      retrieveCollection(props.product._id);

      // Update the product with the brand details.
      setSubmitting(false);
      setOpen(false);
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem creating the ${props.context} collection`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles the creation of a new collection.
   *
   * @param { string } productId - the id of another product to be used.
   */
  const createCollection: (
    productId: string
  ) => (
    title: string
  ) => void = (
    productId: string
  ) => (
    title: string
  ): void => {

    // Don't do anything if we're already submitting.
    if (submitting) {
      return;
    }

    // Set the submission state.
    setSubmitting(true);

    API.requestAPI<CollectionsFormResponse>('collection/create', {
      method: RequestType.POST,
      headers: {
        'x-xsrf-token': props.xsrf || ''
      },
      body: JSON.stringify({
        context: props.context,
        products: [props.product._id, productId],
        title: `${props.product.productType ? props.product.productType.name : 'Needs product type'}: ${title}`
      })
    })
    .then((response: CollectionsFormResponse) => {
      // Present any errors that were returned in the response.
      if (response.errorCode) {
        setFormErrorMessages([response.title])

        setSubmitting(false);
        return;
      }

      // Display the success message to the user.
      enqueueSnackbar(`${props.context} collection created successfully`, { variant: 'success' });

      retrieveCollection(props.product._id);

      // Update the product with the brand details.
      setSubmitting(false);
      setOpen(false);
    })
    .catch((error: Error) => {
      enqueueSnackbar(`There was a problem creating the ${props.context} collection`, { variant: 'error'});
      setSubmitting(false);
    });
  }

  /**
   * Handles the display for adding this product to a collection.
   */
  const handleOverlay: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    setOpen(!open);
  }

  /**
   * Handles the product selection from the search query.
   */
  const handleProductSelect: (
    index: number
  ) => void = (
    index: number
  ): void => {
    // By updating the selected product id we kick off the request to find
    // relevant collections.
    setSelectedProduct(productResults[index]);
  }

  return (
    <React.Fragment>
      <Grid container className={clsx(classes.container)}>
        <Grid item xs={12}>
          <Typography variant='h2' className={clsx(classes.collectionTitle)}>
            {props.title}
          </Typography>
        </Grid>
        {collections.length > 0 ? (
          <AdminCollectionList
            collections={collections}
            existingProductId={props.product._id}
            viewState={collectionStatus}
          /> 
        ) : (
          <React.Fragment>
            {collectionStatus === ViewState.WAITING ? (
              <LoadingCollectionsGrid />
            ): (
              <Grid item xs={12} className={clsx(classes.collectionsTextContainer)}>
                <Typography variant='body1' className={clsx(classes.collectionsText)}>
                  {props.product.brand.name} {props.product.name} isn't associated with any competing products.
                </Typography>
                <Typography variant='body1' className={clsx(classes.collectionsText)}>
                  You can add it to an existing collection or create a new one using the button below.
                </Typography>
              </Grid>
            )}
          </React.Fragment>
        )}
        <Grid item xs={12} className={clsx(classes.editButtonContainer)}>
          <StyledButton
            align='none'
            clickAction={handleOverlay}
            color='secondary'
            title='Edit collection'
          />
        </Grid>
      </Grid>
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
        <Paper className={clsx(classes.modalContainer)}>
          <Grid
            alignItems='stretch'
            className={clsx(classes.formContainer)}
            container
            justify='center'
          >
            <Grid item xs={12} lg={6}>
              <Grid
                container
                justify='center'
              >
                <Grid item xs={12} className={clsx(classes.titleContainer)}>
                  <Grid container justify='space-between' alignItems='center'>
                    <Grid item>
                      <Typography variant='h1' className={clsx(classes.title)}>
                        Find {props.context} collections   
                      </Typography>
                    </Grid>
                    <Grid item>
                      <StyledButton
                        title='Cancel'
                        clickAction={handleOverlay}
                        variant='outlined'
                      />
                    </Grid>
                  </Grid>    
                </Grid>
                <Grid item xs={12} className={clsx(classes.textContainer)}>
                  <Typography variant='body1' className={clsx(classes.textContent)}>
                    Search for a product to find any existing {props.context} collections. If you find an existing collection, you can add the current product.
                  </Typography>
                  <Typography variant='body1' className={clsx(classes.textContent)}>
                    If you can't find any {props.context} products, you can create a new {props.context} collection below.
                  </Typography>
                </Grid>
                <Grid item xs={12} className={clsx(classes.searchContainer)}>
                  <AdminAutoCompleteField
                    close={closeProductSearchResults}
                    defaultValue={''}
                    fieldTitle={'Search'}
                    search={delayedProductQuery}
                    select={handleProductSelect}
                    options={[...productResultNames]}
                  /> 
                </Grid>
                {selectedProduct &&
                  <AdminUpdateCollection
                    context={props.context}
                    create={createCollection}
                    existingProductId={props.product._id}
                    product={selectedProduct}
                    add={addToCollection}
                    remove={removeFromCollection}
                  />
                }
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </React.Fragment>
  )
}

/**
 * Map the redux state to the product form properties.
 *
 */
const mapStateToProps = (state: any, ownProps: AdminAddToCollectionProps): AdminAddToCollectionProps => {
  // Retrieve the xsrf token to be submitted with the request.
  const xsrfToken: string = state.xsrf ? state.xsrf.token : undefined;

  return {
    ...ownProps,
    xsrf: xsrfToken
  };
}

export default connect(
  mapStateToProps
)(AdminAddToCollection);
