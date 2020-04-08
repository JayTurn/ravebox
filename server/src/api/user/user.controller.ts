/**
 * user.controller.js
 * A User Controller Class.
 */
'use strict';

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import { Request, Response, Router } from 'express';
import * as Jwt from 'jsonwebtoken';
//import * as Mongoose from 'mongoose';
import User from './user.model';
//import UserNotifications from './userNotifications.model';
//import Mailchimp from 'mailchimp-api-v3';
import LocalController from './authenticate/local.strategy';
import Notifications from '../../shared/notifications/Notifications.model';

// Enumerators.
import { UserRole } from './user.enum';
import {
  EmailTemplate,
  ContactList
} from '../../shared/notifications/Notifications.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  SignupDetails,
  UserDetailsDocument
} from './user.interface';

/**
 * Defines the UserController Class.
 */
export default class UserController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'user';

    // Set the local authentication strategy.
    LocalController.setup(router, path);

    // Attempt to sign up a user based on the form data.
    router.post(`${path}/signup`, UserController.SignUp);

    // Attempt to retrieve the user.
    router.get(`${path}/profile`, Authenticate.isAuthenticated, UserController.Profile);

    // Validate the existing of a user handle.
    router.get(`${path}/handle/:id`, UserController.HandleAvailability);
  }

  /**
   * Lists the registered users.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  /*
  static List(req, res) {
    // Set the response object.
    let responseObject;
    // Retrieve all users from the database.
    User.findAsync({})
      .then(users => {
        // Attach the users data to the response.
        responseObject = Connect.setResponse({
          data: {
            users: users
          }
        }, 200, 'Users returned successfully');

        // Return the response for the list of users.
        res.status(responseObject.status).json(responseObject.data);
      })
      .catch(() => {
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'USERS_NOT_RETRIEVED',
            message: 'No users have been retrieved'
          }
        }, 404, 'We can\'t find any users');

        // Return the error response for the list of users.
        res.status(responseObject.status).json(responseObject.data);
      });
  }
  */

  /**
   * Get current user handler.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Profile(request: AuthenticatedUserRequest, response: Response): void {
    // Set the response object.
    let responseObject;

    // If the user object was found.
    if (request.auth) {
      User.findOne({
        _id: request.auth._id
      })
      .then((user: UserDetailsDocument) => {
        // Attach the private user profile to the response.
        responseObject = Connect.setResponse({
          data: {
            user: user.privateProfile
          }
        }, 200, 'Profile returned successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch(() => {
        // Attach the private user profile to the response.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_NOT_FOUND',
            message: 'Please log in and try again'
          }
        }, 401, 'Account not found');

        // Return the error response for the user.
        response.status(401).json(responseObject.data);

      })
    } else {
      // Attach the error response.
      responseObject = Connect.setResponse({
        data: {
          errorCode: 'USER_NOT_AUTHENTICATED',
          message: 'Please log in and try again'
        }
      }, 401, 'Your session has ended');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    }
  }

  /**
   * Signup user handler.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  public static SignUp(request: Request, response: Response): void {
    const userDetails: SignupDetails = request.body;

    // Create a new user from the request data.
    const newUser: UserDetailsDocument = new User(userDetails);
        //leadConversion = false;
        //mailchimp = new Mailchimp(EnvConfig.mailchimp.apiKey);

    // Set the provider type.
    newUser.provider = EnvConfig.providers[0];

    // Set the role based on what was provided.
    /*
    if (request.body.role) {
      newUser.role = (request.body.role === EnvConfig.roles[0] ||
        request.body.role === EnvConfig.roles[1]) ? [request.body.role] : EnvConfig.roles[0];
    }
    */

    newUser.role = [UserRole.USER];

    // Ensure the user doesn't already exist.
    User.findOne({
      'email': newUser.email
    })
    .then((user: UserDetailsDocument) => {
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
          // Generate a token for the user.
          const token: string = Authenticate.signToken(user.id, user.role[0]),
              // Decode the token in order to get the expiry.
              decoded: string | {[key: string]: any} = Jwt.decode(token, {
                complete: true,
                json: true
              });

          // Set the token expiration on the user object.
          user.expires = (decoded.payload.exp as number);

          // Set the response object.
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              user: user.privateProfile
              //lead: leadConversion
            }
          }, 201, 'Account created successfully');

          // Send a welcome email to the user.
          Notifications.AddEmailToList(user.email, ContactList.ALL)
            .then((email: string) => {
              Notifications.SendTransactionalEmail(
                {email: email, name: 'N/A'},
                EmailTemplate.SIGNUP
              );
            })
            .catch((error: Error) => {
              // Log the failed email handling.
              console.log(error);
            });

        // Set CSRF values.
        Authenticate.setAuthenticatedResponseHeader(token, response);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        throw error;
      })
    })
    .catch((error: Error) => {
      // Declare the responseObject.
      let responseObject: ResponseObject;

      // If this is a validation error.
      if (error.name === 'ValidationError') {
        // Define the responseObject with a Validation error.
        responseObject = Connect.setValidationResponse(error);

        // Return the response.
        return response.status(responseObject.status).json(responseObject.data).end();
      }

      // Define the responseObject.
      responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED',
            title: 'Please try to sign up again'
          }
        }, 422, 'Your sign up was unsuccessful');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Checks if a user handle is available.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  public static HandleAvailability(request: Request, response: Response): void {
    // Determine if the handle is available.
    User.findOne({
      'handle': request.params.id
    })
    .lean()
    .then((user: UserDetailsDocument) => {
      let responseObject: ResponseObject;

      if (!user) {
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            title: `This user handle is available`
          }
        }, 200, `This user handle is available`);

      } else {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'HANDLE_NOT_AVAILABLE',
            title: `This user handle isn't available`
          }
        }, 404, `This user handle isn't available`);

      }

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch(() => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_CHECK_HANDLE',
            title: `There was a problem checking the availability of this handle. Please try again`
          }
        }, 404, `There was a problem checking the availability of this handle. Please try again`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * Send a password reset link.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  /*
  static SendPasswordResetLink(req, res) {
    // Declare the response object
    let responseObject;

    // Search for the user by the email address provided.
    User.findOne({
      'email': req.body.email,
    })
    .select('email name')
    .execAsync()
    .spread(user => {

      // If we have found a user.
      if (user) {
        // Create a password reset link for the applicant.
        let passwordResetLink = User.generatePasswordResetToken(user.email, user._id),
            name = '';

        // If the user's name is present.
        if (user.name) {
          // Set the user's name.
          name = user.fullname;
        }

        // Request the user to reset their password.
        UserNotifications.sendResetPasswordToken([{
            email: user.email,
            name: name
          }],
          passwordResetLink
        );

      }

      // Set the response object.
      responseObject = Connect.setResponse({
        data: { }
      }, 200, 'Password reset link sent successfully');

      // Return the response.
      res.status(responseObject.status).json(responseObject.data);

    })
    .catch(error => {
      console.log(error);
      // Define the responseObject.
      responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_RESET_LOOKUP',
          message: 'Please enter your email and try again'
        }
      }, 404, 'We could not reset your password');

      // Return the response.
      res.status(responseObject.status).json(responseObject.data);

    });
  }
  */

  /**
   * Change the user password.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  /*
  static ChangePassword(req, res) {
    // Declare the response object
    let responseObject,
        // Decode the provided token.
        decodedToken = User.getPasswordResetToken(req.body.token);

    // If we haven't been provided with a valid decoded token.
    if (!decodedToken) {

      // Return an error.
      responseObject = Connect.setResponse({
        data: {
          errorCode: 'INVALID_TOKEN',
          message: 'Please try to reset your password again'
        }
      }, 404, 'This password change link is no longer valid');

      // Return the response.
      return res.status(responseObject.status).json(responseObject.data).end();

    }

    // Find the user based on the decrypted values.
    User.findOne({
        '_id': decodedToken.userId,
        'email': decodedToken.emailAddress
      })
      .execAsync()
      .spread(user => {

        // Set the password on the user and save the object.
        user.updatePassword(req.body.password, (error, passwordHash, salt) => {

          // If there was an error.
          if (error) {

            // Return an error.
            responseObject = Connect.setResponse({
              data: {
                errorCode: 'PASSWORD_NOT_CREATED',
                message: 'Please try to reset your password again'
              }
            }, 404, 'Your password could not be changed');

            // Return the response.
            return res.status(responseObject.status).json(responseObject.data).end();

          }

          // Update the user's password and salt based on the new values.
          User.findByIdAndUpdate(
            user._id,
            {
              $set: {
                'password': passwordHash,
                'salt': salt
              }
            },
            { 'new': true }
          )
          .execAsync()
          .spread(updatedUser => {

            // Generate a new token for the user.
            let newToken = Authenticate.signToken(updatedUser.id, updatedUser.role[0]),
                // Decode the token in order to get the expiry.
                decoded = Jwt.decode(newToken);

            // Set the token expiration on the user object.
            updatedUser.expires = decoded.exp;

            // Set the response object.
            responseObject = Connect.setResponse({
              data: {
                user: updatedUser.privateProfile
              }
            }, 200, 'Password changed successfully');

            // Set CSRF header values.
            Authenticate.setAuthenticatedResponseHeader(newToken, res);

            // Return the response.
            res.status(responseObject.status).json(responseObject.data);

          })
          .catch(error => {

            // Return an error.
            responseObject = Connect.setResponse({
              data: {
                errorCode: 'PASSWORD_NOT_CHANGED',
                message: 'Please try to reset your password again'
              }
            }, 404, 'Your password could not be changed');

            // Return the response.
            res.status(responseObject.status).json(responseObject.data).end();
          });
        });
      })
      .catch(error => {
        console.log(error);
        // Return an error.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'INVALID_USER_TOKEN',
            message: 'Please try to reset your password again'
          }
        }, 404, 'This password change link is no longer valid');

        // Return the response.
        res.status(responseObject.status).json(responseObject.data).end();

      });

  }
  */

  /**
   * Log the user out of the application.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  /*
  static Logout(req, res) {

    // Remove all authentication tokens for the user.
    res = Authenticate.removeAuthentication(res);

    let responseObject = Connect.setResponse({
      data: {
        authenticated: false
      }
    }, 200, 'User is no longer Authenticated');

    // Return the response for the authenticated user.
    res.status(responseObject.status).json(responseObject.data);
  }
  */

  /**
   * Get current user's state.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  /*
  static Validate(req, res) {
    // Set the response object.
    let responseObject;

    // If the user object was found.
    if (req.user) {
      // Attach the authenticated state to the response.
      responseObject = Connect.setResponse({
        data: {
          authenticated: true
        }
      }, 200, 'User is Authenticated');
    } else {
      // Attach the error response.
      responseObject = Connect.setResponse({
        data: {
          errorCode: 'USER_NOT_AUTHENTICATED',
          message: 'You will need to log in again before continuing'
        }
      }, 401, 'We could not validate your login');

    }

    // Return the response for the authenticated user.
    res.status(responseObject.status).json(responseObject.data);
  }
  */

  /**
   * Update a single field for the current user.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  /*
  static UpdateField(req, res) {

    // Declare the responseObject.
    let responseObject;

    // Dynamically set the path and value of the update query based on the
    // field data provided.
    var $set = { $set: {} };
    $set.$set[req.body.field.path] = req.body.field.value;

    // // Execute the update.
    User.findByIdAndUpdateAsync(req.user._id, $set, { new: true })
      .spread(user => {

        // Set the response error.
        responseObject = Connect.setResponse({
          data: {
            profile: user.privateProfile
          }
        }, 200, 'The ' + req.body.field.path + ' field on the User has been updated');

        // Return the error response for the list of users.
        res.status(responseObject.status).json(responseObject.data);
      })
      .catch(error => {

        // Set the response error.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'COULD_NOT_UPDATE_USER_FIELD',
            message: 'There was an issue saving this user profile field field.'
          }
        }, 404, 'The user profile field could not be updated. Please try again.');

        // Return the error response for the list of users.
        res.status(responseObject.status).json(responseObject.data).end();
      });
  }
  */
}
