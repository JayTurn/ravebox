/**
 * AdminUpdateCollection.tsx
 * Renders the component to update collections.
 */

// Modules.
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import AdminCollectionList from './AdminCollectionList';
import Input from '../../forms/input/Input';
import LoadingCollectionsGrid from '../../placeholders/loadingCollectionsGrid/LoadingCollectionsGrid';
import StyledButton from '../../elements/buttons/StyledButton';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Hooks.
import { useRetrieveCollectionById } from '../../collection/useRetrieveCollectionById.hook';
import { useValidation } from '../../forms/validation/useValidation.hook';

// Interfaces.
import { AdminUpdateCollectionProps } from './AdminUpdateCollection.interface';
import { Collection } from '../../collection/Collection.interface';
import { InputData } from '../../forms/input/Input.interface';

// Validation rules.
import {
  isRequired
} from '../../forms/validation/ValidationRules';

/**
 * Create styles for the admin update collection component.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(1, 0, 2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  createTitleContainer: {
    marginBottom: theme.spacing(2)
  }
}));

/**
 * Renders the admin update collection component.
 */
const AdminUpdateCollection: React.FC<AdminUpdateCollectionProps> = (props: AdminUpdateCollectionProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [collection, setCollection] = React.useState({
    title: ''
  });

  // Retrieves the existing collection.
  const {
    collections,
    collectionStatus,
  } = useRetrieveCollectionById({
    id: props.product._id,
    collectionType: 'product',
    context: props.context,
    retrievalStatus: RetrievalStatus.REQUESTED
  });

  /**
   * Handles the creation of a new collection.
   */
  const handleNewCollection: (
    e: React.MouseEvent<HTMLButtonElement>
  ) => void = (
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    if (collection.title && props.product._id) {
      props.create(props.product._id)(collection.title);
    }
  }

  /**
   * Handles adding the product to an existing collection.
   *
   * @param { string } collection - the collection id.
   */
  const handleAddToCollection: (
    collection: Collection
  ) => void = (
    collection: Collection
  ): void => {
    props.add(collection);
  }

  /**
   * Handles removing the product from an existing collection.
   *
   * @param { string } collection - the collection id.
   */
  const handleRemoveFromCollection: (
    collection: Collection
  ) => void = (
    collection: Collection
  ): void => {
    props.remove(collection);
  }

  /**
   * Handles updates to the collection form field.
   *
   * @param { InputData } data - the field data.
   */
  const updateInputs: (
    data: InputData
  ) => void = (
    data: InputData
  ): void => {
    setCollection({
      ...collection,
      [data.key]: data.value
    });
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {props.product._id &&
          <Typography variant='h2'>
            {props.product.brand.name} {props.product.name} Collections
          </Typography>
        }
      </Grid>
      {collectionStatus === ViewState.WAITING &&
        <Grid item xs={12}>
          <LoadingCollectionsGrid />
        </Grid>
      }
      {collectionStatus === ViewState.FOUND &&
        <Grid item xs={12}>
          <AdminCollectionList
            add={handleAddToCollection}
            remove={handleRemoveFromCollection}
            collections={collections}
            existingProductId={props.existingProductId}
            viewState={collectionStatus}
          />
        </Grid>
      }
      {collectionStatus === ViewState.NOT_FOUND &&
        <Grid item xs={12}>
        
        </Grid>
      }
      {collectionStatus !== ViewState.WAITING && props.product._id &&
        <React.Fragment>
          <Grid item xs={12} className={clsx(classes.divider)}>
            <Divider />
          </Grid>
          <Grid item xs={12} className={clsx(classes.createTitleContainer)}>
            <Typography variant='h3'>
              Create a new collection
            </Typography>
            <Typography variant='body1'>
              If you would like to create a new {props.context} collection with {props.product.brand.name} {props.product.name} you must enter a title.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  defaultValue={collection.title}
                  handleBlur={updateInputs}
                  name='title'
                  required={true}
                  type='text'
                  title="Collection title"
                />
              </Grid>
              <Grid item xs={12}>
                <StyledButton
                  title='Create collection'
                  clickAction={handleNewCollection}
                />
              </Grid>
            </Grid>
          </Grid>
        </React.Fragment>
      }
    </Grid>
  );
}

export default AdminUpdateCollection;
