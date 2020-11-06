/**
 * RaveStream.common.tsx
 * Common functions for rave streams.
 */

// Enumerators.
import { RaveStreamType } from './RaveStream.enum';

// Interfaces.
import {
  RaveStream,
  RaveStreamListItem,
  RaveStreamURLParams
} from './RaveStream.interface';
import { Review } from '../review/Review.interface';

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
) => string = (
  params: RaveStreamURLParams
): string => {
  let path: string = `${params.streamType}`;

  if (params.firstPath) {
    path += `/${params.firstPath}`;
  }

  if (params.secondPath) {
    path += `/${params.secondPath}`;
  }

  if (params.thirdPath) {
    path += `/${params.thirdPath}`;
  }

  if (params.fourthPath) {
    path += `/${params.fourthPath}`;
  }

  return path;
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
