/**
 * Stream.common.tsx
 * Common helper functions for rave streams.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import {
  StreamType
} from './stream.enum';
import { TagAssociation } from '../tag/tag.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import { BrandDetails } from '../brand/brand.interface';
import { ProductDetails } from '../product/product.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ReviewDocument,
  ReviewDetails
} from '../review/review.interface';
import {
  StreamData,
  StreamListItem
} from './stream.interface';
import { TagDetails } from '../tag/tag.interface';

// Models.
import Brand from '../brand/brand.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import Product from '../product/product.model';
import Review from '../review/review.model'
import ReviewCommon from '../review/review.common';
import Tag from '../tag/tag.model';

/**
 * StreamCommon class.
 */
export default class StreamCommon {
  /**
   * Creates an array of queries based on the items in a stream list.
   */
  static RetrieveStreamLists(list: Array<StreamListItem>): Promise<Array<StreamData>> {
    const streamListPromises: Array<Promise<StreamData>> = []; 

    // Loop through each item in the list and build the query.
    let i = 0;

    if (list.length <= 0) {
      return Promise.resolve([]);
    }

    do {

      const current: StreamListItem = {...list[i]};

      switch (current.streamType) {
        case StreamType.PRODUCT: 
          streamListPromises.push(
            StreamCommon.RetrieveProductStream(current)
          );
          break;
        case StreamType.PRODUCT_TYPE:
          streamListPromises.push(
            StreamCommon.RetrieveProductTypeStream(current)
          );
          break;
        default:
      }

      i++;
    } while (i < list.length);

    return Promise.all(streamListPromises);
  }

  /**
   * Retrieves a list of reviews from a product stream.
   *
   * @param { StreamListItem } item - the stream item.
   *
   * @return StreamData
   */
  static RetrieveProductStream(item: StreamListItem): Promise<StreamData> {
    return new Promise<StreamData>((resolve: Function) => {
      if (!item.brand || !item.product || !item.streamType) {
        return resolve();
      }

      let streamTitle = '';

      Brand.findOne({
        url: item.brand
      })
      .lean()
      .then((brandDetails: BrandDetails) => {
        if (!brandDetails) {
          return resolve();
        }

        return Product.findOne({
          url: item.product,
          brand: brandDetails._id
        })
        .populate({
          path: 'brand',
          model: 'Brand'
        })
        .lean();
      })
      .then((product: ProductDetails) => {
        if (!product) {
          return resolve();
        }

        if (product.brand) {
          streamTitle = `${product.brand.name} ${product.name}`;
        }

        return Review.find({
          product: product._id,
          published: Workflow.PUBLISHED
        })
        .populate({
          path: 'product',
          model: 'Product',
          populate: [{
            path: 'brand',
            model: 'Brand'
          }, {
            path: 'productType',
            model: 'Tag'
          }]
        })
        .populate({
          path: 'statistics',
          model: 'ReviewStatistic' 
        })
        .populate({
          path: 'user',
          model: 'User',
          populate: [{
            path: 'statistics',
            model: 'UserStatistic'
          }]
        });
      })
      .then((reviewDocuments: Array<ReviewDocument>) => {
        const reviews: Array<ReviewDetails> = ReviewCommon
          .FormatStreamReviews(
            reviewDocuments,
          );

        const streamData: StreamData = {
          title: streamTitle,
          reviews: reviews,
          streamType: item.streamType
        };

        resolve(streamData);
      })
      .catch((error: Error) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_STREAM_RETRIEVAL_FAILED',
            message: 'There was a problem retrieving reviews for this product stream'
          },
          error: error
        }, 404, `There was a problem locating a stream for ${item.product}`);

        Logging.Send(LogLevel.WARNING, responseObject);

        resolve();
      });
    });
  }

  /**
   * Retrieves a list of reviews based on a product type.
   *
   * @param { StreamListItem } item - the stream item.
   *
   * @return StreamData
   */
  static RetrieveProductTypeStream(item: StreamListItem): Promise<StreamData> {
    return new Promise<StreamData>((resolve: Function) => {
      if (!item.productType || !item.streamType) {
        return resolve();
      }

      let streamTitle = '';

      Tag.findOne({
        name: item.productType,
        association: TagAssociation.PRODUCT
      })
      .lean()
      .then((tagDetail: TagDetails) => {
        if (!tagDetail) {
          return resolve();
        }

        streamTitle = tagDetail.name;

        return Product.find({
          productType: tagDetail._id
        })
        .lean();
      })
      .then((products: Array<ProductDetails>) => {
        if (!products || products.length <= 0) {
          return resolve();
        }

        // Create a list of product ids to be searched.
        const productIds: Array<Mongoose.Types.ObjectId> = products.map((product: ProductDetails) => {
          return product._id;
        });

        return Review.find({
          product: productIds,
          published: Workflow.PUBLISHED
        })
        .populate({
          path: 'product',
          model: 'Product',
          populate: [{
            path: 'brand',
            model: 'Brand'
          }, {
            path: 'productType',
            model: 'Tag'
          }]
        })
        .populate({
          path: 'statistics',
          model: 'ReviewStatistic' 
        })
        .populate({
          path: 'user',
          model: 'User',
          populate: [{
            path: 'statistics',
            model: 'UserStatistic'
          }]
        });
      })
      .then((reviewDocuments: Array<ReviewDocument>) => {
        const reviews: Array<ReviewDetails> = ReviewCommon
          .FormatStreamReviews(
            reviewDocuments,
          );

        const streamData: StreamData = {
          title: streamTitle,
          reviews: reviews,
          streamType: item.streamType
        };

        resolve(streamData);
      })
      .catch((error: Error) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_STREAM_RETRIEVAL_FAILED',
            message: 'There was a problem retrieving reviews for this product stream'
          },
          error: error
        }, 404, `There was a problem locating a stream for ${item.productType}`);

        Logging.Send(LogLevel.WARNING, responseObject);

        resolve();
      });
    });
  }

  /**
   * Sets a review to the beginning of the list if it's found.
   *
   * @param { Array<ReviewDetails> } reviews - the list of reviews.
   * @param { string } url - the url of the review to be placed first.
   *
   * @return Array<ReviewDetails>
   */
  static SetFirstReview(reviews: Array<ReviewDetails>, url: string): Array<ReviewDetails> {

    if (reviews.length <= 0) {
      return reviews;
    }

    const sortedReviews: Array<ReviewDetails> = [];

    let i = 0;

    do {
      const current: ReviewDetails = {...reviews[i]};

      if (current.url === url) {
        sortedReviews.unshift({...current});
      } else {
        sortedReviews.push({...current})
      }

      i++;

    } while (i < reviews.length);

    return sortedReviews;
  }
}
