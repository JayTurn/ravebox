/**
 * ProductSelectList.tsx.
 * Component for selecting a product from a display list.
 */

// Modules.
import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { withRouter } from 'react-router';

// Interfaces.
import { CategoryItem } from '../../category/Category.interface';
import { Product, ProductGroup } from '../Product.interface';
import { ProductSelectListProps } from './ProductSelectList.interface';

/**
 * Assists the user in the selection of a product.
 */
const ProductSelectList: React.FC<ProductSelectListProps> = (props: ProductSelectListProps) => {
  /**
   * Redirect the user to the review screen for this product.
   *
   * @param { string } id - the product id.
   */
  const selectProduct: (
    id: string
  ) => void = (
    id: string
  ): void => {
    props.history.push(`/product/${id}/review`);
  }

  return (
    <React.Fragment>
      {props.products &&
        <List>
          {props.products.map((product: Product) => {
            return (
              <ListItem button key={product._id} onClick={() => selectProduct(product._id)}>
                {product.name}
              </ListItem>
            )
          })}
        </List>
      }
    </React.Fragment>
  )
}

export default withRouter(ProductSelectList);
