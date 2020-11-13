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
import { CollectionDetails } from '../collection/collection.interface';
import { ProductDetails } from '../product/product.interface';
import { PublicUserDetails } from '../user/user.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ReviewDocument,
  ReviewDetails
} from '../review/review.interface';
import {
  StreamData,
  StreamGroup,
  StreamListItem,
  StreamList
} from './stream.interface';
import { TagDetails } from '../tag/tag.interface';

// Models.
import Brand from '../brand/brand.model';
import Collection from '../collection/collection.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import Product from '../product/product.model';
import Review from '../review/review.model'
import ReviewCommon from '../review/review.common';
import Tag from '../tag/tag.model';
import TagCommon from '../tag/tag.common';
import User from '../user/user.model';

/**
 * StreamCommon class.
 */
export default class StreamCommon {
  /**
   * Creates an array of queries based on the items in a stream list.
   */
  static RetrieveStreamListItems(list: Array<StreamListItem>): Promise<Array<StreamData>> {
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
        case StreamType.CATEGORY:
          streamListPromises.push(
            StreamCommon.RetrieveCategoryStream(current)
          );
          break;
        case StreamType.COLLECTION:
          streamListPromises.push(
            StreamCommon.RetrieveCollectionStream(current)
          );
          break;
        default:
      }

      i++;
    } while (i < list.length);

    return Promise.all(streamListPromises);
  }

  /**
   * Creates a promise for retreiving a stream list based on the value
   * provided.
   */
  static RetrieveProductsByCategory(
    streamList: StreamList,
    categoryId: string
  ): Promise<StreamList> {

    return TagCommon.RecursiveSearchTags(
      categoryId,
      TagAssociation.PRODUCT
    )
    .then((tags: Array<TagDetails>) => {
      if (!tags || tags.length <= 0) {
        throw new Error('No products were found for this category.');
      }

      // Create stream data out of each product that returns.
      const streamListItems: Array<StreamListItem> = [];

      let i = 0;

      do {
        const current: TagDetails = {...tags[i]};

        streamListItems.push({
          streamType: StreamType.PRODUCT_TYPE,
          productType: current.url
        });

        i++;
      } while (i < streamListItems.length);

      return StreamCommon.RetrieveStreamListItems(streamListItems);

    })
    .then((streamData: Array<StreamData>) => {
      return {
        ...streamList,
        streamItems: [...streamData]
      };
    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `RETRIEVE_STREAM_LIST_ITEMS_FAILED`,
          message: `There was a problem loading this list of stream items.`
        },
        error
      }, 404, `There was a problem loading this list of stream items.`);

      Logging.Send(LogLevel.ERROR, responseObject);

      return streamList; 
    });

  }

  /**
   * Creates an array of queries based on list of available catagories.
   */
  static RetrieveStreamProductListsByCategory(): Promise<Array<StreamList>> {

    return Tag.find({
      association: TagAssociation.CATEGORY,
      linkFrom: []
    })
    .lean()
    .then((categories: Array<TagDetails>) => {
      if (!categories || categories.length <= 0) {
        throw new Error(`Categories weren't found.`)
      }

      // Add each category to a list and then perform a request to get the
      // list of products for each category.
      const streamListPromises: Array<Promise<StreamList>> = []; 
      let i = 0;

      do {
        const current: TagDetails = {...categories[i]};

        streamListPromises.push(StreamCommon.RetrieveProductsByCategory({
          title: current.name,
          streamItems: [],
          streamType: StreamType.PRODUCT_TYPE,
          url: current.url
        }, current._id));

        i++;

      } while (i < categories.length);

      return Promise.all(streamListPromises);
    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `STREAM_PRODUCTS_LISTS_BY_CATEGORY_FAILED`,
          message: `There was a problem loading this list of product streams.`
        },
        error
      }, 404, `There was a problem loading this list of streams.`);

      Logging.Send(LogLevel.ERROR, responseObject);

      return Promise.all([]);
    });
  }

  /**
   * Retrieves a list of reviews based on a collection.
   *
   * @param { StreamListItem } item - the stream item.
   *
   * @return StreamData
   */
  static RetrieveCollectionStream(item: StreamListItem): Promise<StreamData> {
    return new Promise<StreamData>((resolve: Function) => {
      if (!item.collectionContext || !item.brand || !item.product || !item.streamType) {
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
          brand: brandDetails._id,
          url: item.product
        })
        .lean();
      })
      .then((productDetails: ProductDetails) => {
        if (!productDetails) {
          return resolve();
        }

        return Collection.findOne({
          products: productDetails._id,
          context: item.collectionContext
        })
        .lean();
      })
      .then((collectionDetail: CollectionDetails) => {
        if (!collectionDetail) {
          return resolve();
        }

        streamTitle = collectionDetail.title;

        if (collectionDetail.reviews && collectionDetail.reviews.length > 0) {
          return Review.find({
            _id: collectionDetail.reviews,
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
        }

        if (collectionDetail.products && collectionDetail.products.length > 0) {
          return Review.find({
            product: collectionDetail.products,
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
        }

        return resolve();
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
            errorCode: 'COLLECTION_STREAM_RETRIEVAL_FAILED',
            message: 'There was a problem retrieving reviews for this collection stream'
          },
          error: error
        }, 404, `There was a problem locating a stream for the collection`);

        Logging.Send(LogLevel.WARNING, responseObject);

        resolve();
      });
    });
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
   * Retrieves a list of reviews based on a category.
   *
   * @param { StreamListItem } item - the stream item.
   *
   * @return StreamData
   */
  static RetrieveCategoryStream(item: StreamListItem): Promise<StreamData> {
    return new Promise<StreamData>((resolve: Function) => {
      if (!item.category || !item.streamType) {
        return resolve();
      }

      let streamTitle = '';

      const productTypeIds: Array<string> = [];

      Tag.findOne({
        url: item.category,
        association: TagAssociation.CATEGORY
      })
      .lean()
      .then((tagDetail: TagDetails) => {
        if (!tagDetail) {
          throw new Error(`${item.category} tag not found`);
        }

        streamTitle = tagDetail.name;

        return Tag.find({
          linkFrom: tagDetail._id
        })
        .lean();
      })
      .then((tags: Array<TagDetails>) => {

        // We're going to go through a process of addding the returned tags
        // to the product type list if they have a product
        // association. For tags that are not products, we'll perform another
        // level of retrieval.
        if (!tags || tags.length <= 0) {
          throw new Error(`No tags linked to ${item.category} were found`);
        }

        let i = 0;

        const queryIds: Array<string> = [];

        do {
          const current: TagDetails = tags[i];

          if (current.association === TagAssociation.PRODUCT) {
            productTypeIds.push(current._id);
          } else {
            queryIds.push(current._id);
          }

          i++;
        } while (i < tags.length);

        if (queryIds.length > 0) {
          return Tag.find({
            association: TagAssociation.PRODUCT,
            linkFrom: queryIds
          })
          .lean();
        } else {
          return [];
        }
      })
      .then((tags: Array<TagDetails>) => {

        if (tags && tags.length > 0) {

          let i = 0;

          do {
            const current: TagDetails = tags[i];
            productTypeIds.push(current._id);
            i++;
          } while (i < tags.length);

        }

        return Product.find({
          productType: productTypeIds
        })
        .lean();
      })
      .then((products: Array<ProductDetails>) => {
        if (!products || products.length <= 0) {
          throw new Error(`No products associated with ${item.category} tag were found`);
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
        url: item.productType,
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
   * Retrieves a list of rave streams based on a single user.
   *
   * @param { StreamListItem } item - the stream item.
   *
   * @return StreamData
   */
  static RetrieveUserStreamList(item: StreamListItem): Promise<Array<StreamData>> {
    return new Promise<Array<StreamData>>((resolve: Function) => {
      if (!item.user || !item.streamType) {
        return resolve();
      }

      User.findOne({
        _id: item.user
      })
      .lean()
      .then((userDetails: PublicUserDetails) => {
        if (!userDetails) {
          return resolve();
        }

        return Review.find({
          user: userDetails._id,
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

        // Group the reviews into product type streams.
        const streamList: Array<StreamData> = StreamCommon
          .GroupRavesIntoStreams(reviews);

        resolve(streamList);
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

  /**
   * Loops through a list of raves and places them in product type streams.
   *
   * @param { Array<ReviewDetails> } reviews - the reviews to be grouped. 
   *
   * @return Array<StreamData>
   */
  static GroupRavesIntoStreams(reviews: Array<ReviewDetails>): Array<StreamData> {
    const streamLists: Array<StreamData> = [];
         
    let streamGroup: StreamGroup;

    if (!reviews || reviews.length <= 0) {
      return streamLists;
    }

    let i = 0;

    do {
      const current: ReviewDetails = reviews[i];

      if (!streamGroup) {
        streamGroup = {
          [current.product.productType.url]: [{...current}]
        };
      } else {
        if (streamGroup[current.product.productType.url]) {
          streamGroup[current.product.productType.url].push({...current});
        } else {
          streamGroup[current.product.productType.url] = [{...current}];
        }
      }
      i++;
    } while (i < reviews.length);

    // Loop through the stream groups and separate them into stream lists.
    const keys: Array<string> = Object.keys(streamGroup);

    if (!keys || keys.length <= 0) {
      return streamLists;
    }

    i = 0;

    do {
      const current: Array<ReviewDetails> = streamGroup[keys[i]];

      let title = '';

      if (current[0]) {
        title = current[0].product.productType.name;
      }

      streamLists.push({
        title: title,
        reviews: [...current],
        streamType: StreamType.PRODUCT_TYPE
      });

      i++;
    } while (i < keys.length);

    return streamLists;
    
  }

  /**
   * Loops through the category stream to determine if its empty
   *
   * @param { StreamList } list - the stream list.
   */
  static DisplayCategoryList(list: StreamList): boolean {
    if (!list.streamItems || list.streamItems.length <= 0) {
      return;
    }

    let i = 0;

    do {
      const current: Array<ReviewDetails> = list.streamItems[i].reviews;

      if (current && current.length > 0) {
        return true;
      }

      i++;
    } while (i < list.streamItems.length);

    return;
  }
}
