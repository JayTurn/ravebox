/**
 * stream.controller.ts
 *
 * Controller for stream content.
 */

// Modules.
import { Request, Response, Router } from 'express';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { StreamType } from '../stream/stream.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  ProductDetails,
  ProductDocument
} from '../product/product.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ReviewDetails,
  ReviewDocument
} from '../review/review.interface';
import {
  StreamData,
  StreamListItem
} from './stream.interface';

// Models.
import ProductCommon from '../product/product.common';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import Product from '../product/product.model';
import Review from '../review/review.model';
import ReviewCommon from '../review/review.common';
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
      `${path}/product/:brand/:productName/:reviewTitle?`,
      StreamController.Product
    );

    // Retrieve a list of streams.
    router.post(
      `${path}/list`,
      StreamController.List
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
          reviewTitle: string = request.params.reviewTitle;

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

    let streamTitle = '';

    // Begin by searching for the product.
    Product.findOne({
      url: `${productName}`
    })
    .populate({
      path: 'brand',
      model: 'Brand'
    })
    .then((productDocument: ProductDocument) => {
      if (!productDocument) {
        throw new Error(`${brand}/${productName} product doesn't exist`);
      }

      // Retrieve the product details for the purpose of building the stream
      // title.
      const productDetails: ProductDetails = ProductCommon
        .RetrieveDetailsFromDocument(productDocument);
      
      streamTitle = `${productDetails.brand.name} ${productDocument.name}`;

      // Perform a request to find the reviews for this product
      // and populate all the required fields.
      return Review.find({
        product: productDocument._id,
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
      // Format the raves with their respective content.
      const reviews: Array<ReviewDetails> = ReviewCommon
        .FormatStreamReviews(
          reviewDocuments,
          reviewTitle
        ); 

      const streamData: StreamData = {
        title: streamTitle,
        reviews: reviews,
        streamType: StreamType.PRODUCT
      };

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

    StreamCommon.RetrieveStreamLists(list)
      .then((streamLists: Array<StreamData>) => {

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            raveStreams: streamLists
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
}
