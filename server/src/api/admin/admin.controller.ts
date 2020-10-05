/**
 * admin.controller.ts
 *
 * Controller for handling administration routes and functions.
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import Follow from '../follow/follow.model';
import Logging from '../../shared/logging/Logging.model';
import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
//import Product from '../product/product.model';
//import Review from '../review/review.model';
import User from '../user/user.model';
import UserStatistics from '../userStatistics/userStatistics.model'

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { UserRole } from '../user/user.enum';
//import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  FollowDocument
} from '../follow/follow.interface';
import {
  PrivateUserDetails,
  SignupDetails,
  UserDetailsDocument
} from '../user/user.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  //UserStatistics as UserStats,
  UserStatisticsDocument
} from '../userStatistics/userStatistics.interface'

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

    // Create a new user.
    router.post(
      `${path}/users/create`,
      Authenticate.isAuthenticated,
      Authenticate.isAdmin,
      AdminController.CreateUser
    );

    // Impersonate an existing user.
    router.get(
      `${path}/users/impersonate`,
      Authenticate.isAuthenticated,
      AdminController.ImpersonateUser
    );

    // Impersonate an existing user.
    router.get(
      `${path}/users/impersonate/:id`,
      Authenticate.isAuthenticated,
      Authenticate.isAdmin,
      AdminController.ImpersonateUser
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

  /**
   * Creates a new user.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CreateUser(request: AuthenticatedUserRequest, response: Response): void {

    // If we haven't been provided a handle, exit.
    if (!request.body.handle) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_HANDLE_NOT_PROVIDED_FOR_NEW_USER',
            message: `The handle is missing from the request to create a new user`
          },
          error: new Error('Handle is missing from the create user api request')
        }, 401, `The handle is missing from the request to create a new user`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data).end();
      return;
    }

    const userDetails: SignupDetails = {
      email: '',
      handle: request.body.handle,
      password: '',
      provider: EnvConfig.providers[0]
    };

    // Create a new user from the request data.
    const newUserStatistics: UserStatisticsDocument = new UserStatistics(),
          newFollow: FollowDocument = new Follow(),
          newUser: UserDetailsDocument = new User({
            ...userDetails,
            statistics: newUserStatistics._id,
            following: newFollow._id
          });

    // Update the new user statistics with the user id.
    newUserStatistics.user = newUser._id;

    // Update the new follow document with the user id.
    newFollow.user = newUser._id;

    // Set the provider type.
    newUser.provider = EnvConfig.providers[0];

    newUser.role = [UserRole.USER, UserRole.YOUTUBE];

    // Ensure the user doesn't already exist.
    User.findOne({
      'handle': newUser.handle
    })
    .then((user: UserDetailsDocument) => {
      // If a user with that handle already exists exit.
      if (user) {
        // Set the response object.
        const responseObject = Connect.setResponse({
            data: {
              errorCode: 'EXISTS',
              title: 'User with this email already exists'
            }
          }, 422, 'An account with this email already exists');

        // Return the response.
        return response.status(responseObject.status).json(responseObject.data);
      }

      // Save the new user entry.
      newUser.save()
        .then((user: UserDetailsDocument) => {

          // Save the user statistics and following.
          newUserStatistics.save();
          newFollow.save();

          // Set the response object.
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              user: user.privateProfile
              //lead: leadConversion
            }
          }, 201, 'Account created successfully');

          // Return the response.
          response.status(responseObject.status).json(responseObject.data);
        })
        .catch((error: Error) => {
          throw error;
        });
    })
    .catch((error: Error) => {
        // Define the responseObject.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_SIGNUP',
            title: 'Please try to sign up again'
          },
          error: error
        }, 422, 'Sign up was unsuccessful');

        // Log the error.
        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
    });
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
  static ImpersonateUser(
    request: AuthenticatedUserRequest,
    response: Response
  ): void {
    // Retrieve the user based on the id provided and create a token session.
    const id: string = request.params.id;
    
    // If we haven't been provided an id, we should reset the impersonation.
    if (!id) {

      const adminId: string = Authenticate.getAdminUserIdFromToken(request);

      // Store the admin authentication cookie and header.
      Authenticate.removeAdminAuthenticationResponseHeader(request, response);

      User.findById(adminId)
        .populate({
          path: 'following',
          model: 'Follow'
        })
        .populate({
          path: 'statistics',
          model: 'UserStatistic'
        })
        .then((userDetails: UserDetailsDocument) => {
          if (!userDetails) {
            throw new Error(`User ID ${id} not found for impersonation`);
          }

          // Build the successful response, using the private user profile.
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              user: userDetails.privateProfile
            }
          }, 200, 'Login Successful!');

          // Return the response.
          response.status(responseObject.status).json(responseObject.data).end();
        })
        .catch((error: Error) => {
          // Define the responseObject.
          const responseObject = Connect.setResponse({
              data: {
                errorCode: 'UNABLE_TO_FIND_ADMIN_USER',
                message: `Admin user with the ID ${adminId} was not found for impersonation.`
              },
              error: error
            }, 401, `Admin user with the ID ${adminId} was not found for impersonation.`);

          Logging.Send(LogLevel.ERROR, responseObject);

          // Return the response.
          response.status(responseObject.status).json(responseObject.data).end();
        });

    } else {

    User.findById(id)
      .populate({
        path: 'following',
        model: 'Follow'
      })
      .populate({
        path: 'statistics',
        model: 'UserStatistic'
      })
      .then((userDetails: UserDetailsDocument) => {
        if (!userDetails) {
          throw new Error(`User ID ${id} not found for impersonation`);
        }

        // Store the admin authentication cookie and header.
        Authenticate.setAdminAuthenticationResponseHeader(request, response);

        // Clear the existing authentication from the response.
        Authenticate.removeAuthentication(response);

        // Sign the token for the login request.
        const token: string = Authenticate.signToken(userDetails._id, userDetails.role[0]);
        // Build the successful response, using the private user profile.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            user: userDetails.privateProfile
          }
        }, 200, 'Login Successful!');

        // Set CSRF values.
        response = Authenticate.setAuthenticatedResponseHeader(token, response);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        // Define the responseObject.
        const responseObject = Connect.setResponse({
            data: {
              errorCode: 'UNABLE_TO_FIND_USER_TO_IMPERSONATE',
              message: `User with the ID ${id} was not found for impersonation.`
            },
            error: error
          }, 401, `User with the ID ${id} was not found for impersonation.`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data).end();
      });
    }
  }
}
