/**
 * RaveStream.common.tsx
 * Common functions for rave streams.
 */

// Enumerators.
import { RaveStreamType } from './RaveStream.enum';
import {
  Recommended
} from '../review/recommendation/Recommendation.enum';
import { VideoType } from '../review/Review.enum';

// Interfaces.
import { ImageAndTitle } from '../elements/image/Image.interface';
import {
  Product
} from '../product/Product.interface';
import {
  Review as ReviewSchema,
  VideoObject as VideoSchema,
  WithContext
} from 'schema-dts';
import {
  RaveStream,
  RaveStreamListItem,
  RaveStreamURLParams
} from './RaveStream.interface';
import { Review } from '../review/Review.interface';

// Utilities.
import { Pluralize } from '../../utils/display/textFormats/TextFormats';

/**
 * Creates an empty rave Stream object for use in object definitions.
 *
 * @return EventObject
 */
export const emptyRaveStream: (
) => RaveStream = (
): RaveStream => {
  return {
    reviews: [],
    streamType: RaveStreamType.PRODUCT,
    title: ''
  };
}

/**
 * Formats the url path based on the parameters provided.
 *
 * @param { RaveStreamURLParams } params - the URL parameters provided.
 *
 * @return string
 */
export const buildRaveStreamPath: (
  params: RaveStreamURLParams
) => (
  subtractRave: boolean
) => string = (
  params: RaveStreamURLParams
) => (
  subtractRave: boolean
): string => {
  let path: string = `${params.streamType}`;

  switch (params.streamType) {
    case RaveStreamType.COLLECTON:
      path += `/${params.firstPath}/${params.secondPath}/${params.thirdPath}`;
      if (!subtractRave && params.fourthPath) {
        path += `/${params.fourthPath}`;
      }
      break;
    case RaveStreamType.PRODUCT:
      path += `/${params.firstPath}/${params.secondPath}`;
      if (!subtractRave && params.thirdPath) {
        path += `/${params.thirdPath}`;
      }
      break;
    case RaveStreamType.PRODUCT_TYPE:
      path += `/${params.firstPath}`;
      if (!subtractRave && params.secondPath) {
        path += `/${params.secondPath}`;
      }
      break;
    default:
      if (params.firstPath) {
        path += `/${params.firstPath}`;
      }

      if (params.secondPath) {
        if (!subtractRave && params.thirdPath) {
          path += `/${params.secondPath}`;
        }
      }

      if (params.thirdPath) {
        if (!subtractRave && params.fourthPath) {
          path += `/${params.thirdPath}`;
        }
      }

      if (params.fourthPath) {
        if (!subtractRave) {
          path += `/${params.fourthPath}`;
        }
      }
  }

  return path;
}

/**
 * Retrieves the url of the current rave from the stream path.
 *
 * @param { RaveStreamURLParams } params - the URL parameters provided.
 *
 * @return string
 */
export const retrieveRaveURL: (
  params: RaveStreamURLParams
) => string = (
  params: RaveStreamURLParams
): string => {
  let path: string = '';

  switch (params.streamType) {
    case RaveStreamType.COLLECTON:
      path = params.fourthPath || '';
      break;
    case RaveStreamType.PRODUCT:
      path = params.thirdPath || '';
      break;
    case RaveStreamType.PRODUCT_TYPE:
      path = params.secondPath || '';
      break;
    default:
  }

  return path
}

/**
 * Builds the url to the specific rave stream.
 *
 * @param { RaveStreamType } streamType - the stream type.
 * @param { Review } review - the review.
 *
 * @return string
 */
export const buildURLForStream: (
  streamType: RaveStreamType
) => (
  review: Review
) => (
  single: boolean
) => string = (
  streamType: RaveStreamType
) => (
  review: Review
) => (
  single: boolean
): string => {
  let path: string = `/stream/${streamType}/`;

  if (!review) {
    return path;
  }

  switch (streamType) {
    case RaveStreamType.COLLECTON:

      path += `competing/`;

      if (review.product) {
        path += `${review.product.brand.url}/${review.product.url}`;
      }
      break;
    case RaveStreamType.PRODUCT:
      if (review.product) {
        path += `${review.product.brand.url}/${review.product.url}`;
      }
      break;
    case RaveStreamType.PRODUCT_TYPE:
      if (review.product) {
        path += `${review.product.productType.url}`;
      }
      break;
    default:
  }

  if (single) {
    path += `/${review.url}`;
  }

  return path;
}

/**
 * Builds a rave path based on the current context.
 *
 * @param { RaveStreamType } streamType - the stream type.
 * @param { RaveStreamURLParams } params - the URL parameters provided.
 */
export const buildContextPath: (
  streamType: RaveStreamType
) => (
  params: RaveStreamURLParams
) => string = (
  streamType: RaveStreamType
) => (
  params: RaveStreamURLParams
): string => {
  let path: string = `/stream/${params.streamType}`;

  switch (streamType) {
    case RaveStreamType.COLLECTON:
      path += `/${params.firstPath}/${params.secondPath}/${params.thirdPath}`;
      break;
    case RaveStreamType.PRODUCT:
      path += `/${params.firstPath}/${params.secondPath}`;
      break;
    case RaveStreamType.PRODUCT_TYPE:
      path += `/${params.firstPath}`;
      break;
    default:
  }

  return path;
}

/**
 * Returns the human readable stream name.
 *
 * @param { RaveStreamType } streamType - the stream type.
 *
 * @return string
 */
export const getStreamName: (
  streamType: RaveStreamType
) => string = (
  streamType: RaveStreamType
): string => {
  let name: string = '';

  switch (streamType) {
    case RaveStreamType.COLLECTON:
      name = 'Collection';
    case RaveStreamType.PRODUCT:
      name = 'Product';
      break;
    case RaveStreamType.PRODUCT_TYPE:
    case RaveStreamType.CATEGORY:
      name = 'Category';
      break;
  }

  return name;
}

/**
 * Builds a list of rave streams to be requested
 */
export const getHomeStreamList: (
) => Array<RaveStreamListItem> = (
): Array<RaveStreamListItem> => {
  let list: Array<RaveStreamListItem> = [{
    brand: 'beats_by_dr._dre',
    product: 'powerbeats_pro',
    streamType: RaveStreamType.PRODUCT
  }, {
    streamType: RaveStreamType.PRODUCT_TYPE,
    productType: 'phone'
  }, {
    streamType: RaveStreamType.CATEGORY,
    category: 'shoes'
  }, {
    streamType: RaveStreamType.COLLECTON,
    brand: 'google',
    collectionContext: 'competing',
    product: 'pixel_3'
  }];

  return list;
}

/**
 * Calculates the ratio of the video dimensions.
 *
 * @param { number } width - the video width.
 * @param { number } height - the video height.
 *
 * @return number
 */
export const calculateVideoRatio: (
  width: number | undefined
) => (
  height: number | undefined
) => number = (
  width: number | undefined
) => (
  height: number | undefined
): number => {

  if (!width || !height) {
    return 0;
  }

  return width / height;
}

/**
 * Returns the title for the rave stream based on the stream type.
 *
 * @param { RaveStream } raveStream - the rave stream data.
 *
 * @return string
 */
export const getStreamPageTitle: (
  raveStream: RaveStream
) => string = (
  raveStream: RaveStream
): string => {
  let title: string = '';

  switch (raveStream.streamType) {
    case RaveStreamType.CATEGORY:
      title = `Watch video reviews of ${raveStream.title} products shared by people with real experiences - Ravebox`;
      break;
    case RaveStreamType.COLLECTON:
    case RaveStreamType.PRODUCT_TYPE:
      title = `Watch video reviews of ${Pluralize(raveStream.title)} shared by people with real experiences - Ravebox`;
      break;
    case RaveStreamType.PRODUCT:
      if (raveStream.reviews && raveStream.reviews.length > 0) {
        const product: Product | undefined = raveStream.reviews[0].product;
        if (product) {
          title = `Watch video reviews of the ${product.brand.name} ${product.name} shared by people with real experiences - Ravebox`;
        } else {
          title = `Discover and compare products with video reviews shared by people with real experiences - Ravebox`;
        }
      } else {
          title = `Discover and compare products with video reviews shared by people with real experiences - Ravebox`;
      }
      break;
    default:
  }

  return title;
}

/**
 * Returns the description for the rave stream based on the stream type.
 *
 * @param { RaveStream } raveStream - the rave stream data.
 *
 * @return string
 */
export const getStreamPageDescription: (
  raveStream: RaveStream
) => string = (
  raveStream: RaveStream
): string => {
  let description: string = '';

  switch (raveStream.streamType) {
    case RaveStreamType.CATEGORY:
      description = `Discover and compare ${raveStream.title} products by watching video reviews shared by users on Ravebox.`;
      break;
    case RaveStreamType.COLLECTON:
    case RaveStreamType.PRODUCT_TYPE:
      description = `Discover and compare ${Pluralize(raveStream.title)} by watching video reviews shared by users on Ravebox`;
      break;
    case RaveStreamType.PRODUCT:
      if (raveStream.reviews && raveStream.reviews.length > 0) {
        const product: Product | undefined = raveStream.reviews[0].product;
        if (product) {
          description = `Discover what people are saying about the ${product.brand.name} ${product.name} by watching video reviews shared by users on Ravebox`;
        } else {
          description = `Discover and compare products by watching video reviews shared by people on Ravebox`;
        }
      } else {
          description = `Discover and compare products by watching video reviews shared by people on Ravebox`;
      }
      break;
    default:
  }

  return description;
}

/**
 * Builds the review schema for SEO purposes.
 *
 * @param { Review } review - the product object.
 * @param { RaveStream } raveStream - the rave stream containing reviews.
 *
 * @return { ReviewSchema }
 */
export const buildReviewSchema: (
  product?: Product
) => (
  review?: Review
) => WithContext<ReviewSchema> = (
  product?: Product
) => (
  review?: Review
): WithContext<ReviewSchema> => {
  const schema: WithContext<ReviewSchema> = {
    '@context': 'https://schema.org',
    '@type': 'Review'
  };

  if (review) {
    schema.reviewRating = {
      '@type': 'Rating',
      ratingValue: review.recommended,
      bestRating: Recommended.RECOMMENDED,
      worstRating: Recommended.NOT_RECOMMENDED
    };

    if (product && review.user) {
      schema.name = `${review.title}`;
      schema.author = {
        '@type': 'Person',
        'name': review.user.handle
      };
      schema.reviewBody = review.description;
    }
  }

  if (product) {
    schema.itemReviewed = {
      '@type': 'Product',
      name: product.name,
      brand: {
        '@type': 'Brand',
        'name': product.brand.name
      }
    };
    // Add any product images.
    if (product && product.images && product.images.length > 0) {
      schema.itemReviewed.image = product.images.map((imageItem: ImageAndTitle) => {
        return imageItem.url;
      });
    }

    // Add the product description.
    if (product.description) {
      schema.itemReviewed.description = `Watch ${product.brand.name} ${product.name} review videos shared by users on Ravebox.`;
    }
  }

  return schema;
}

/**
 * Builds a video object schema based on the review provided.
 *
 * @param { Review } review - the review for the product.
 *
 * @return VideoSchema
 */
export const buildVideoSchema: (
  review?: Review
) => WithContext<VideoSchema> = (
  review?: Review
): WithContext<VideoSchema> => {
  const schema: WithContext<VideoSchema> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
  };

  if (review) {
    if (review.user && review.product) {
      schema.name = `${review.product.brand.name} ${review.product.name} review by ${review.user.handle} - ${review.title}`;
      schema.description = `${review.description}`;
      schema.thumbnailUrl = review.thumbnail;
      schema.uploadDate = new Date(review.created).toISOString();
    }

    if (review.videoType === VideoType.YOUTUBE) {
      schema.embedUrl = review.videoURL;
    } else {
      schema.contentUrl = review.videoURL;
    }
  }

  // @ToDo: Add InteractionStatistic when the type definitions are resolved.

  return schema;
}
