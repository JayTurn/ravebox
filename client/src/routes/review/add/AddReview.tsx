/**
 * AddReview.tsx
 * AddReview route component.
 */

// Modules.
import {
  AnyAction,
  bindActionCreators,
  Dispatch
} from 'redux';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// Components.
import AddReviewForm from '../../../components/review/addForm/AddReviewForm';
import ProductPreviewCard from '../../../components/product/previewCard/ProductPreviewCard';
import PageTitle from '../../../components/elements/pageTitle/PageTitle';

// Enumerators.
import { RetrievalStatus } from '../../../utils/api/Api.enum';

// Interfaces.
import { AddReviewProps } from './AddReview.interface';

// Hooks.
import { useRetrieveProductById } from '../../../components/product/useRetrieveProduct.hook';

/**
 * Create styles for the review screen.
 */
const useStyles = makeStyles((theme: Theme) => createStyles({
  padding: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

/**
 * AddReview component.
 */
const AddReview: React.FC<AddReviewProps> = (props: AddReviewProps) => {
  // Match the large media query size.
  const classes = useStyles(),
        theme = useTheme(),
        largeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const {
    product,
    productStatus
  } = useRetrieveProductById({id: props.match.params.id});

  const [displayProduct, setDisplayProduct] = React.useState<boolean>(true);

  /**
   * Toggles the display of the product details.
   */
  const toggleProduct: (
    visible: boolean
  ) => void = (
    visible: boolean
  ): void => {
    setDisplayProduct(visible);
  }

  return (
    <Grid
      container
      direction='column'
      style={{marginBottom: '3rem'}}
    >
      {productStatus === RetrievalStatus.SUCCESS &&
        <React.Fragment>
          <PageTitle title='Post a rave' />
          <Grid container direction='row'>
            <Grid item xs={12} className={clsx(
              {
                [classes.padding]: largeScreen
              }
              )}
            >
              {displayProduct &&
                <ProductPreviewCard {...product} />
              }
            </Grid>
          </Grid>
          <AddReviewForm productId={product._id} toggleProduct={toggleProduct}/>
        </React.Fragment>
      }
    </Grid>
  );
}

/**
 * Map the redux state to the add review properties.
 *
 */
function mapStatetoProps(state: any, ownProps: AddReviewProps) {
  return {
    ...ownProps,
  };
}

export default withRouter(connect(
    mapStatetoProps
  )(AddReview));
