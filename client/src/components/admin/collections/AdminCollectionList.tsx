/**
 * AdminCollectionList.tsx
 * Renders the component showing the list of collections.
 */

// Modules.
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';
import { ViewState } from '../../../utils/display/view/ViewState.enum';

// Interfaces.
import { AdminCollectionListProps } from './AdminCollectionList.interface';
import { Collection } from '../../collection/Collection.interface';
import { Product } from '../../product/Product.interface';

/**
 * Create styles for the admin collection list component.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  buttonText: {
    fontWeight: 600,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  buttonTextContainer: {
    left: 0,
    padding: theme.spacing(1),
    position: 'absolute',
    top: '33%',
    width: '100%'
  },
  cardButtonContainer: {
    boxShadow: 'none',
    border: `1px solid ${theme.palette.primary.main}`
  },
  cardContainer: {
    position: 'relative'
  },
  collectionTitle: {
    fontSize: '.9rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  container: {
    margin: theme.spacing(2, 0)
  },
  media: {
    backgroundColor: `rgba(220, 220, 220)`,
    height: 0,
    paddingTop: '100%'
  },
  mediaButton: {
    backgroundColor: `rgba(255, 255, 255)`,
    height: 0,
    paddingTop: '100%'
  },
  textContainer: {
    marginTop: theme.spacing(1)
  },
}));

/**
 * Checks if the product id exists in the array of products.
 *
 * @param { string } productId - the id we're looking for.
 * @param { Array<Product> } products - the array of products we're checking.
 *
 * @return boolean
 */
const inProductList: (
  productId: string
) => (
  products: Array<Product> | undefined
) => boolean = (
  productId: string
) => (
  products: Array<Product> | undefined
): boolean => {

  if (!products || products.length <= 0) {
    return false;
  }

  let i: number = 0;
  do {
    const current: string = products[i]._id;
    if (current === productId) {
      return true;
    }
    i++;
  } while (i < products.length);

  return false;
}

/**
 * Renders the admin collection list component.
 */
const AdminCollectionList: React.FC<AdminCollectionListProps> = (props: AdminCollectionListProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  /**
   * Handles selecting a collection.
   */
  const handleAddToCollection: (
    collection: Collection
  ) => void = (
    collection: Collection
  ): void => {
    if (props.add) {
      props.add(collection);
    }
  }

  /**
   * Handles removing from a collection.
   */
  const handleRemoveFromCollection: (
    collection: Collection
  ) => void = (
    collection: Collection
  ): void => {
    if (props.remove) {
      props.remove(collection);
    }
  }

  return (
    <Grid container className={clsx(classes.container)}>
      <Grid item xs={12}>
        {props.collections.map((collection: Collection) => {
          const exists: boolean = inProductList(props.existingProductId)(collection.products);
          return (
            <Grid container key={collection._id}>
              <Grid item xs={12}>
                <Typography variant='h3' className={clsx(classes.collectionTitle)}>
                  {collection.title}
                </Typography>
              </Grid>
              {collection.products && collection.products.length > 0 &&
                <Grid item xs={12}>
                  <Grid container spacing={2} justify='center'>
                    {collection.products.map((product: Product) => {
                      return (
                        <Grid item key={product._id} xs={6} sm={3} md={2}>
                          <Box>
                            <Card className={clsx(classes.cardContainer)}>
                              <CardMedia
                                className={clsx(classes.media)}
                                image={product.images && product.images.length > 0 ? product.images[0].url : ''}
                                title={`${product.brand.name} ${product.name}`}
                              />
                            </Card>
                            <Box className={clsx(classes.textContainer)}>
                              <Typography variant='body2' color='textSecondary'>
                                {product.brand.name} {product.name}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      );
                    })}
                    {!exists && props.add &&
                      <Grid item xs={6} sm={3} md={2}>
                        <Box>
                          <Card className={clsx(classes.cardButtonContainer)}>
                            <CardActionArea onClick={() => handleAddToCollection({...collection})}>
                              <CardMedia
                                className={clsx(classes.mediaButton)}
                                image={''}
                                title={`Add to this collection`}
                              />
                              <CardContent className={classes.buttonTextContainer}>
                                <Typography variant='body2' color='primary' className={clsx(classes.buttonText)}>
                                  Add
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                          <Box className={clsx(classes.textContainer)}>
                          </Box>
                        </Box>
                      </Grid>
                    }
                    {exists && props.remove &&
                      <Grid item xs={6} sm={3} md={2}>
                        <Box>
                          <Card className={clsx(classes.cardButtonContainer)}>
                            <CardActionArea onClick={() => handleRemoveFromCollection({...collection})}>
                              <CardMedia
                                className={clsx(classes.mediaButton)}
                                image={''}
                                title={`Remove from this collection`}
                              />
                              <CardContent className={classes.buttonTextContainer}>
                                <Typography variant='body2' color='primary' className={clsx(classes.buttonText)}>
                                  Remove
                                </Typography>
                              </CardContent>
                            </CardActionArea>
                          </Card>
                          <Box className={clsx(classes.textContainer)}>
                          </Box>
                        </Box>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              }
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

export default AdminCollectionList;
