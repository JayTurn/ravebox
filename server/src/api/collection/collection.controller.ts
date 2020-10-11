/**
 * collection.controller.ts
 * Collection controller class.
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import {
  NextFunction,
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
}
