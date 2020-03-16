/**
 * local.strategy.model.js
 * A Local Passport Strategy for Authentication.
 */
'use strict';

import Authenticate from '../../../models/authentication/authenticate.model';
import Connect from '../../../models/database/connect.model';
//import * as Jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { Request, Response, Router, NextFunction } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../user.model';

// Interfaces.
import { ResponseObject } from '../../../models/database/connect.interface';
import { UserDetailsDocument } from '../user.interface';

/**
 * Defines the LocalController Class.
 */
export default class LocalController {

  /**
   * Static Local login Access method.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   * @param {function} next
   *   The next handler callback
   */
  static Access(
    request: Request,
    response: Response,
    next: NextFunction
  ): void {
    // Authenticate the user via the passport local strategy.
    passport.authenticate('local', (error, user, info) => {
      let responseObject;

      // Define the error with a fallback to the info parameter.
      error = error || info;

      // If there was an error or info.
      if (error) {
        // Build the error response.
        responseObject = Connect.setResponse({
          data: {
            message: 'Check your email and try to enter your password again',
            errorCode: 'EMAIL_OR_PASSWORD_INCORRECT'
          }
        }, 401, 'The email or password you have provided is incorrect');

        // Return the error response.
        return response.status(responseObject.status).json(responseObject.data).send();

        //return next();
      }

      // If the user wasn't created.
      if (!user) {
        // Send an error message.
        responseObject = Connect.setResponse({
          data: {
            errorCode: error.errorCode,
            message: 'Please try to sign up again'
          }
        }, 403, error.message);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);

        return next();
      }

      // Sign the token for the login request.
      const token: string = Authenticate.signToken(user._id, user.role[0]);

      // Build the successful response, using the private user profile.
      responseObject = Connect.setResponse({
        data: {
          user: user
        }
      }, 200, 'Login Successful!');

      // Set CSRF values.
      response = Authenticate.setAuthenticatedResponseHeader(token, response);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
      
      next();
    })(request, response, next);
  }
  /**
   * Authenticate Method.
   *
   * @param {string} email
   * User provided email.
   *
   * @param {string} password
   * User provided password.
   *
   * @param {function} callback
   * Callback function to trigger when complete.
   */
  static authenticate(email: string, password: string, callback: Function): void {
    // Find the email address provided.
    User.findOne({
      email: email.toLowerCase()
    })
    .then((user: UserDetailsDocument) => {
      // If we haven't found the user.
      if (!user) {
        // Return a false user to provide error handling.
        return callback(null, false, {
          title: 'Email or password are incorrect',
          errorCode: 'EMAIL_OR_PASSWORD_INCORRECT'
        });
      }
      // Authenticate the user.
      user.authenticate(password, function(error: Error, authenticated: boolean) {
        // If there was an error authenticating.
        if (error) {
          return callback(error);
        }

        // If the user isn't authenticated.
        if (!authenticated) {
          return callback(null, false, {
            title: 'Email or password are incorrect',
            errorCode: 'EMAIL_OR_PASSWORD_INCORRECT'
          });
        } else {
          return callback(null, user);
        }
      });
    })
    // If there was an error getting the user.
    .catch((error: Error) => {
      // Return the error response.
      throw error;
    });
  }

  /**
   * Setup Method.
   *
   * @param {object} Router
   * The Express Router middleware instance.
   */
  static setup(router: Router, apiPath: string): void {
    // Define the Local Password strategy.
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, (email, password, done) => {
      // Return the authenticated state.
      return this.authenticate(email, password, done);
    }));

    // Set the Local Authentication route.
    router.post(`${apiPath}/login`, LocalController.Access);
  }
}
