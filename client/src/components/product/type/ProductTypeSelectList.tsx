/**
 * ProductTypeSelectList.tsx.
 * Component for selecting a product from a display list.
 */

// Modules.
import * as React from 'react';
import Box from '@material-ui/core/List';
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme
} from '@material-ui/core/styles';
import Grow from '@material-ui/core/Grow';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import Zoom from '@material-ui/core/Zoom';

// Hooks.
import { useAnalytics } from '../../analytics/Analytics.provider';

// Interfaces.
import {
  AnalyticsContextProps,
  EventObject
} from '../../analytics/Analytics.interface';
import { ProductTypeSelectListProps } from './ProductTypeSelectList.interface';
import { Tag } from '../../tag/Tag.interface'; 

/**
 * Search product list.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  list: {
    backgroundColor: 'rgba(100, 106, 240, 0.1)',
    borderRadius: theme.shape.borderRadius,
    marginTop: '0.5rem',
    padding: '0.1rem 1rem'
  },
  listItem: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    boxShadow: `0 1px 1px rgba(100,106,240, 0.25)`,
    paddingBottom: '.5rem',
    paddingTop: '.5rem',
    marginBottom: '1rem',
    marginTop: '1rem',
    '&:hover': {
      backgroundColor: theme.palette.common.white
    }
  },
  listBox: {
    flexDirection: 'column'
  },
  productTypeName: {
    fontSize: '1.15rem',
    fontWeight: 500
  }
}));

/**
 * Assists the user in the selection of a product typ.
 */
const ProductTypeSelectList: React.FC<ProductTypeSelectListProps> = (props: ProductTypeSelectListProps) => {

  // Define the analytics context and a tracking event.
  const analytics: AnalyticsContextProps = useAnalytics() as AnalyticsContextProps;

  // Use the custom styles.
  const classes = useStyles();

  /**
   * Redirect the user to the review screen for this product.
   *
   * @param { string } id - the product id.
   */
  const selectProductType: (
    index: number
  ) => void = (
    index: number
  ): void => {

    const tag: Tag = {...props.tags[index]};

    // Create the event object from the provided values.
    const eventData: EventObject = {
      'brand name': props.product.brand.name,
      'brand id': props.product.brand._id,
      'product id': props.product._id,
      'product name': props.product.name,
      'product type': tag.name,
      'product type id': tag._id
    };

    analytics.trackEvent(`select existing product type`)(eventData);

    // Handle the product type tag selection.
    props.select(tag);
  }

  return (
    <React.Fragment>
      {props.tags && props.tags.length > 0 &&
        <Grow in={props.tags.length > 0}>
          <List className={classes.list}>
            {props.tags.map((tag: Tag, index: number) => {
              const added: boolean = true;
              return (
                <Zoom 
                  in={added}
                  style={{transitionDelay: added ? `${100 * index}ms`: `100ms`}}
                  key={tag._id}
                >
                  <ListItem
                    button
                    className={classes.listItem}
                    disableRipple
                    onClick={() => selectProductType(index)}
                  >
                    <Box component='div'>
                      <Typography variant='body1' color='textPrimary' className={classes.productTypeName}>
                        {tag.name}
                      </Typography>
                    </Box>
                  </ListItem>
                </Zoom>
              )
            })}
          </List>
        </Grow>
      }
    </React.Fragment>
  )
}

export default withRouter(ProductTypeSelectList);
