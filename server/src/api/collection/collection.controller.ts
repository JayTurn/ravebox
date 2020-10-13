/**
 * collection.controller.ts
 * Collection controller class.
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import {
  //NextFunction,
  Request,
  Response,
  Router
} from 'express';
import Collection from './collection.model';

// Enumerators.
import { CollectionContext } from './collection.enum';
import { LogLevel } from '../../shared/logging/Logging.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  CollectionDetails,
  CollectionDetailsDocument
} from './collection.interface';
import {
  ResponseObject
} from '../../models/database/connect.interface';

// Utilities.
import ProductCommon from '../product/product.common';

/**
 * Routing controller for collections.
 * @class CollectionController
 *
 * Route: /api/collection
 *
 */
export default class CollectionController {

  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'collection';

    // Get the index route.
    router.get(path, CollectionController.getStatus);

    // Create a new collection.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated, 
      Authenticate.isAdmin,
      CollectionController.Create
    );

    // Updates a collection with the id provided.
    router.post(
      `${path}/product/update`,
      Authenticate.isAuthenticated, 
      Authenticate.isAdmin,
      CollectionController.UpdateProducts
    );

    // Retrieves collections by the product id.
    router.post(
      `${path}/product/:id`,
      CollectionController.RetrieveByProduct
    );

  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Collections are healthy!'});
  }

  /**
   * Creates a new collection.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Create(request: AuthenticatedUserRequest, response: Response): void {
    const title: string = request.body.title,
          context: CollectionContext = request.body.context || CollectionContext.COMPETING,
          products: Array<string> = request.body.products;

    if (!products || !title) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'CREATE_COLLECTION_MISSING_FIELDS',
            title: `The collection couldn't be created`
          },
        }, 404, `The collection couldn't be created`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Create a new collection from the provided values and save it.
    const newCollection: CollectionDetailsDocument = new Collection({
      title: title,
      context: context,
      products: products
    });

    newCollection.save()
      .then((collection: CollectionDetailsDocument) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            collection: collection.details
          }
        }, 201, `Collection ${collection.title} (${collection._id}) created successfully`);

        Logging.Send(LogLevel.INFO, responseObject);

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        // Define the responseObject.
        const responseObject = Connect.setResponse({
            data: {
              errorCode: 'CREATE_COLLECTION_FAILED',
              title: `The ${newCollection.title} collection couldn't be created`
            },
            error: error
          }, 404, `The ${newCollection.title} collection couldn't be created`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      });
  }

  /**
   * Updates an existing collection.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static UpdateProducts(request: AuthenticatedUserRequest, response: Response): void {
    // Ensure the essential values were provided.
    const id: string = request.body.id,
          context: CollectionContext = request.body.context,
          products: Array<string> = request.body.products,
          title: string = request.body.title;

    if (!products || !title || !context || !id) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'UPDATE_COLLECTION_MISSING_FIELDS',
            title: `The collection couldn't be updated`
          },
        }, 404, `The collection couldn't be updated`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }
    
    Collection.findOneAndUpdate({
      _id: id,
      context: context
    }, {
      products: products,
      title: title
    }, { 
      new: true, upsert: false
    })
    .populate({
      path: 'products',
      model: 'Product',
      populate: [{
        path: 'brand',
        model: 'Brand'
      }, {
        path: 'productType',
        model: 'Tag'
      }]
    })
    .then((collectionDetails: CollectionDetailsDocument) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          collection: collectionDetails.details
        }
      }, 201, `Collection [_id: ${id}] updated successfully`);

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'UPDATE_COLLECTION_FAILED',
            title: `The ${title} collection couldn't be updated`
          },
          error: error
        }, 404, `The ${title} collection couldn't be updated`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * Retrieves a collection based on the product id provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveByProduct(request: Request, response: Response): void {
    // Ensure the essential values were provided.
    const id: string = request.params.id,
          context: CollectionContext = request.body.context;

    if (!id || !context) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'COLLECTION_PRODUCT_ID_NOT_PROVIDED',
            title: `A product id must be provided to retrieve a collection`
          },
        }, 404, `A product id must be provided to retrieve a collection`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Perform the query.
    Collection.find({
      products: id,
      context: context
    })
    .populate({
      path: 'products',
      model: 'Product',
      populate: [{
        path: 'brand',
        model: 'Brand'
      }, {
        path: 'productType',
        model: 'Tag'
      }]
    })
    .then((collectionDocuments: Array<CollectionDetailsDocument>) => {
      // Loop through the collections and the products to return their product
      // details.
      const collections: Array<CollectionDetails> = [];

      if (collectionDocuments.length > 0) {
        let i = 0;

        do {

          const currentCollection: CollectionDetails = {
            ...collectionDocuments[i].details
          };

          currentCollection.products = ProductCommon
            .RetrieveProductDetailsFromDocuments(
              [...currentCollection.products]
            );

          collections.push({...currentCollection});

          i++;
        } while (i < collectionDocuments.length);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          collections: collections
        }
      }, 201, `Collections for product ${id} retrieved successfully`);

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'COLLECTION_SEARCH_BY_PRODUCT_ID_FAILED',
            title: `The collection search using the following id failed ${id}`
          },
          error: error
        }, 404, `The collection search using the following id failed ${id}`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }
}
