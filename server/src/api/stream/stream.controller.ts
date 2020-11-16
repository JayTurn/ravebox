/**
 * stream.controller.ts
 *
 * Controller for stream content.
 */

// Modules.
//import * as Mongoose from 'mongoose';
import { Request, Response, Router } from 'express';

// Enumerators.
import { CollectionContext } from '../collection/collection.enum';
import { LogLevel } from '../../shared/logging/Logging.enum';
import { StreamType } from '../stream/stream.enum';

// Interfaces.
import { CollectionDetails } from '../collection/collection.interface'
import {
  ProductDetails
  //ProductDocument
} from '../product/product.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  StreamData,
  StreamList,
  StreamListItem
} from './stream.interface';

// Models.
import Connect from '../../models/database/connect.model';
import Collection from '../collection/collection.model';
import Logging from '../../shared/logging/Logging.model';
import StreamCommon from './stream.common';

/**
 * Routing controller for streams.
 * @class StreamController
 *
 * Route: /api/stream
 *
 */
export default class StreamController {

  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'stream';

    // Get the index route.
    router.get(
      path,
      StreamController.getStatus
    );

    // Retrieve a product stream.
    router.get(
      `${path}/collection/:collectionContext/:brand/:productName/:reviewURL?`,
      StreamController.Collection
    );

    // Retrieve a product stream.
    router.get(
      `${path}/product/:brand/:productName/:reviewURL?`,
      StreamController.Product
    );

    // Retrieve a product type stream.
    router.get(
      `${path}/product_type/:productType/:reviewURL?`,
      StreamController.ProductType
    );

    // Retrieve a category stream.
    router.get(
      `${path}/category/:tag/:reviewURL?`,
      StreamController.Category
    );

    // Retrieve a list stream.
    router.get(
      `${path}/category_list`,
      StreamController.CategoryList
    );

    // Retrieve a list of streams.
    router.post(
      `${path}/list`,
      StreamController.List
    );

    // Retrieve a list of similar product streams.
    router.get(
      `${path}/similar_products/:id`,
      StreamController.SimilarProducts
    );

    // Retrieve a list of user streams.
    router.get(
      `${path}/user/:id`,
      StreamController.User
    );
  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Stream api healthy'});
  }

  /**
   * Retrieves a collection stream.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Collection(request: Request, response: Response): void {
    const collectionContext: string = request.params.collectionContext,
          brand: string = request.params.brand, 
          productName: string = request.params.productName,
          reviewURL: string = request.params.reviewURL;

    if (!collectionContext || !brand || !productName) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_STREAM_NOT_FOUND',
          message: 'There was a problem retrieving reviews for this product'
        },
      }, 404, `${brand} or ${productName} was missing from the request`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    StreamCommon.RetrieveCollectionStream({
      brand: brand,
      collectionContext: collectionContext,
      product: productName,
      streamType: StreamType.COLLECTION
    })
    .then((streamData: StreamData) => {
      if (reviewURL && streamData.reviews.length > 1) {
        streamData.reviews = StreamCommon.SetFirstReview(
          streamData.reviews, reviewURL);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          raveStream: streamData
        }
      }, 200, 'Stream loaded');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_STREAM_RETRIEVAL_FAILED',
          message: 'There was a problem retrieving reviews for this product stream'
        },
        error: error
      }, 404, `There was a problem locating a stream for ${brand} ${productName}`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    })
  }

  /**
   * Retrieves a product stream.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Product(request: Request, response: Response): void {
    const brand: string = request.params.brand, 
          productName: string = request.params.productName,
          reviewURL: string = request.params.reviewURL;

    if (!brand || !productName) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_STREAM_NOT_FOUND',
          message: 'There was a problem retrieving reviews for this product'
        },
      }, 404, `${brand} or ${productName} was missing from the request`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    StreamCommon.RetrieveProductStream({
      brand: brand,
      product: productName,
      streamType: StreamType.PRODUCT
    })
    .then((streamData: StreamData) => {
      if (reviewURL && streamData.reviews.length > 1) {
        streamData.reviews = StreamCommon.SetFirstReview(
          streamData.reviews, reviewURL);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          raveStream: streamData
        }
      }, 200, 'Stream loaded');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_STREAM_RETRIEVAL_FAILED',
          message: 'There was a problem retrieving reviews for this product stream'
        },
        error: error
      }, 404, `There was a problem locating a stream for ${brand} ${productName}`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    })
  }

  /**
   * Retrieves a product type stream.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static ProductType(request: Request, response: Response): void {
    const productType: string = request.params.productType, 
          reviewURL: string = request.params.reviewURL;

    if (!productType) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_TYPE_STREAM_NOT_FOUND',
          message: 'There was a problem retrieving reviews for this product type'
        },
      }, 404, `Product type was missing from the request`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    StreamCommon.RetrieveProductTypeStream({
      productType: productType,
      streamType: StreamType.PRODUCT_TYPE
    })
    .then((streamData: StreamData) => {

      // If a review title was provided, place it at the beginning of the stream
      // if it exists.
      if (reviewURL && streamData.reviews.length > 1) {
        streamData.reviews = StreamCommon.SetFirstReview(
          streamData.reviews, reviewURL);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          raveStream: streamData
        }
      }, 200, 'Stream loaded');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_TYPE_STREAM_RETRIEVAL_FAILED',
          message: 'There was a problem retrieving reviews for this product type stream'
        },
        error: error
      }, 404, `There was a problem locating a stream for ${productType}`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    })
  }

  /**
   * Retrieves a category stream.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Category(request: Request, response: Response): void {
    const tag: string = request.params.tag, 
          reviewURL: string = request.params.reviewURL;

    if (!tag) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'CATEGORY_STREAM_NOT_FOUND',
          message: 'There was a problem retrieving reviews for this category'
        },
      }, 404, `Category was missing from the request`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    StreamCommon.RetrieveCategoryStream({
      category: tag,
      streamType: StreamType.CATEGORY
    })
    .then((streamData: StreamData) => {

      // If a review title was provided, place it at the beginning of the stream
      // if it exists.
      if (reviewURL && streamData.reviews.length > 1) {
        streamData.reviews = StreamCommon.SetFirstReview(
          streamData.reviews, reviewURL);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          raveStream: streamData
        }
      }, 200, 'Stream loaded');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'CATEGORY_STREAM_RETRIEVAL_FAILED',
          message: 'There was a problem retrieving reviews for this category stream'
        },
        error: error
      }, 404, `There was a problem locating a stream for ${tag}`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }
  
  /**
   * Retrieves a list of streams grouped by top level categories.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CategoryList(request: Request, response: Response): void {
    StreamCommon.RetrieveStreamProductListsByCategory()
      .then((streamList: Array<StreamList>) => {

        // Loop through the lists and only add items with results.
        const results: Array<StreamList> = [];

        if (streamList.length > 0) {

          let i = 0;

          do {
            const current: StreamList = {...streamList[i]};

            const display: boolean = StreamCommon.DisplayCategoryList(current);

            if (display) {
              results.push({...streamList[i]});
            }
            i++;
          } while (i < streamList.length);
        }

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            raveStreams: results
          }
        }, 200, 'Category stream lists retrieved successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        throw error;
      });
  }
  
  /**
   * Retrieves a list of streams.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static List(request: Request, response: Response): void {
    const list: Array<StreamListItem> = request.body.list;

    if (!list || list.length <= 0) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `STREAM_ITEMS_MISSING_FROM_REQUEST`,
          message: `The list of streams to be requested was empty`
        },
      }, 404, `The list of streams to be requested was empty`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    StreamCommon.RetrieveStreamListItems(list)
      .then((streamLists: Array<StreamData>) => {

        // Loop through the lists and only add items with results.
        const results: Array<StreamData> = [];

        if (streamLists.length > 0) {
          let i = 0;

          do {
            if (streamLists[i]) {
              results.push({...streamLists[i]});
            }
            i++;
          } while (i < streamLists.length);
        }

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            raveStreams: results
          }
        }, 200, 'Stream lists retrieved successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: `STREAM_LISTS_FAILED`,
            message: `There was a problem loading this list of streams.`
          },
          error
        }, 404, `There was a problem loading this list of streams.`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      });
  }
  
  /**
   * Retrieves a list of similar product streams.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static SimilarProducts(request: Request, response: Response): void {
    const id: string = request.params.id;

    //const list: Array<StreamListItem> = request.body.list;

    if (!id) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `PRODUCT_ID_MISSING_FROM_REQUEST`,
          message: `The product id to be requested was missing`
        },
      }, 404, `The product id to be requested was missing`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    // Retrieve a list of competing products from their respective collection.
    Collection.findOne({
      products: id,
      context: CollectionContext.COMPETING
    })
    .populate({
      path: 'products',
      model: 'Product',
      populate: {
        path: 'brand',
        model: 'Brand'
      }
    })
    .lean()
    .then((collectionDetails: CollectionDetails) => {
      if (!collectionDetails || !collectionDetails.products || collectionDetails.products.length <= 0) {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            raveStreams: []
          }
        }, 200, 'No similar products were found');

        // Return the response for the authenticated user.
        return response.status(responseObject.status).json(responseObject.data);
      }

      // Loop through the products and create a stream list to query. 
      let i = 0;

      const list: Array<StreamListItem> = [];

      do {
        const current: ProductDetails = collectionDetails.products[i] as ProductDetails;

        if (current._id.toHexString() !== id) {
          list.push({
            streamType: StreamType.PRODUCT,
            brand: current.brand.url,
            product: current.url
          });
        }

        i++;
      } while (i < collectionDetails.products.length);

      StreamCommon.RetrieveStreamListItems(list)
        .then((streamLists: Array<StreamData>) => {

            // Set the response object.
            const responseObject: ResponseObject = Connect.setResponse({
              data: {
                raveStreams: streamLists
              }
            }, 200, 'Similar product streams retrieved successfully');

            // Return the response for the authenticated user.
            response.status(responseObject.status).json(responseObject.data);
          })
          .catch((error: Error) => {
            // Set the response object.
            const responseObject: ResponseObject = Connect.setResponse({
              data: {
                errorCode: `SIMILAR_PRODUCT_STREAM_LISTS_FAILED`,
                message: `There was a problem loading this list of similar product streams.`
              },
              error
            }, 404, `There was a problem loading this list of similar product streams.`);

            Logging.Send(LogLevel.ERROR, responseObject);

            // Return the response for the authenticated user.
            response.status(responseObject.status).json(responseObject.data);
          });
    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `SIMILAR_PRODUCT_COLLECTION_RETRIEVAL_FAILED`,
          message: `There was a problem loading the product collection.`
        },
        error
      }, 404, `There was a problem loading the product collection.`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Retrieves a list of user streams.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static User(request: Request, response: Response): void {
    const id: string = request.params.id;

    if (!id) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `USER_ID_MISSING_FROM_REQUEST`,
          message: `The user id to be requested was missing`
        },
      }, 404, `The user id to be requested was missing`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
        
      return;
    }

    StreamCommon.RetrieveUserStreamList({
      user: id,
      streamType: StreamType.PRODUCT_TYPE
    })
    .then((streamLists: Array<StreamData>) => {

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          raveStreams: streamLists
        }
      }, 200, 'User streams retrieved successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `USER_STREAM_RETRIEVAL_FAILED`,
          message: `There was a problem loading the user streams.`
        },
        error
      }, 404, `There was a problem loading the user streams.`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }
}
