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

// Interfaces.
import { ResponseObject } from '../../models/database/connect.interface';
import {
  StreamData,
  StreamListItem
} from './stream.interface';

// Models.
import Connect from '../../models/database/connect.model';
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
      `${path}/product/:brand/:productName/:reviewURL?`,
      StreamController.Product
    );

    // Retrieve a product type stream.
    router.get(
      `${path}/product_type/:productType/:reviewURL?`,
      StreamController.ProductType
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
