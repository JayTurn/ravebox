/**
 * admin.controller.ts
 *
 * Controller for handling administration routes and functions.
 */

// Modules.
import { Request, Response, Router } from 'express';
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import Product from '../product/product.model';
import Review from '../review/review.model';
import User from '../user/user.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  PrivateUserDetails,
  UserDetailsDocument
} from '../user/user.interface';

/**
 * Routing controller for admin functions.
 * @class AdminController
 *
 * Route: /api/admin
 *
 */
export default class AdminController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'admin';

    // Get the index route.
    router.get(
      path,
      Authenticate.isAuthenticated,
      Authenticate.isAdmin,
      AdminController.GetStatus
    );

    // Get the list of users.
    router.get(
      `${path}/users`,
      Authenticate.isAuthenticated,
      Authenticate.isAdmin,
      AdminController.GetUsersList
    );
  }

  /**
   * GET /
   * Index route.
   */
  static GetStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'data api yay!'});
  }

  /**
   * Returns a list of users.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static GetUsersList(request: AuthenticatedUserRequest, response: Response): void {

    // Perform a request to get all users based on the query provided.
    User.find(
    )
    .populate({
      path: 'following',
      model: 'Follow'
    })
    .populate({
      path: 'statistics',
      model: 'UserStatistic'
    })
    .then((userDocuments: Array<UserDetailsDocument>) => {
      const users: Array<PrivateUserDetails> = [];

      if (userDocuments.length > 0) {
        let i = 0;

        do {
          users.push(userDocuments[i].privateProfile);
          i++;
        } while (i < userDocuments.length);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          users: users,
        }
      }, 201, `Users returned successfully`);

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'RETRIEVE_USERS_LIST_FAILED',
          message: 'There was a problem retrieving the list of users.'
        },
        error: error
      }, 401, 'There was a problem retrieving the list of users.');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }
}
