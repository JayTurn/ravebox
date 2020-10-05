/**
 * useRetrieveProduct.hook.ts
 * Retrieves the product if we have a valid id.
 */

// Modules.
import API from '../../utils/api/Api.model';
import * as React from 'react';

// Enumerators.
import { Recommended } from '../review/recommendation/Recommendation.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';
import { VideoType } from '../review/Review.enum';

// Interfaces.
import {
  Product,
  ProductResponse,
  RetrieveProductByIdParams,
  RetrieveProductByURLParams
} from './Product.interface';
import {
  Review
} from '../review/Review.interface';

/**
 * Returns a product if it exists using the url.
 *
 * @param { RetrieveProductByURLParams } params - the product params.
 */
export function useRetrieveProductByURL(params: RetrieveProductByURLParams) {

  // Format the api request path.
  const {
    existing,
    setProductView,
    requested,
  } = {...params};

  const path: string = `${requested.category}/${requested.subCategory}/${requested.brand}/${requested.productName}`;

  // Define the retrieval status to be used for view rendering.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.NOT_REQUESTED);

  // Define the product to be set.
  const [product, setProduct] = React.useState<Product>(existing ? existing.product : {
    _id: '',
    brand: '',
    categories: [{key: '', label: ''}],
    name: '',
    url: ''
  });

  // Define the product reviews to be set.
  const [reviews, setReviews] = React.useState<Array<Review>>(existing && existing.reviews ?
    existing.reviews : [{
      _id: '',
      created: new Date(),
      description: '',
      endTime: 0,
      links: [],
      sponsored: false,
      startTime: 0,
      title: '',
      recommended: Recommended.RECOMMENDED,
      url: '',
      videoType: VideoType.NATIVE
    }]
  );

  const [requestedPath, setRequestedPath] = React.useState<string>(path);

  /**
   * Handle state updates to the requested path.
   */
  React.useEffect(() => {
    if (path !== requestedPath || !product.url) {
      setRetrieved(RetrievalStatus.REQUESTED);
      setRequestedPath(path);
    }
  }, [path, product, requestedPath]);

  /**
   * Handle state updates to the url parameters and request status.
   */
  React.useEffect(() => {
    // If we haven't performed a request continue.
    if (retrieved === RetrievalStatus.REQUESTED) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the user's profile.
      API.requestAPI<ProductResponse>(`product/view/${requestedPath}`, {
        method: RequestType.GET
      })
      .then((response: ProductResponse) => {
        // If we have a product, set the product in the redux store and the
        // local state.
        if (response.product) {
          if (setProductView) {
            setProductView({
              product: {...response.product},
              reviews: response.reviews ? [...response.reviews] : []
            });
            setProduct(response.product)
            // If we have reviews, set them.
            if (response.reviews) {
              setReviews(response.reviews);
            }
          }
          setRetrieved(RetrievalStatus.SUCCESS);

        } else {
          // We couldn't find the product so return an appropriate response
          // for the view to render accordingly.
          setRetrieved(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [retrieved]);

  return {
    product,
    productStatus: retrieved,
    reviews
  }
}
