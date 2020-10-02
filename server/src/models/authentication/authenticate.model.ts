/**
 * authenticate.model.js
 * Authentication middleware.
 */
'use strict';

// Modules.
import Connect from '../database/connect.model';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as ExpressJwt from 'express-jwt';
import * as Jwt from 'jsonwebtoken';
import * as Compose from 'compose-middleware';
import User from '../../api/user/user.model';
import * as _ from 'lodash';

// Enumerators.
import { UserRole } from '../../api/user/user.enum';

// Interfaces.
import { Request, Response, NextFunction } from 'express';
import {
  AuthenticatedUserRequest,
  UserAttachedRequest
} from './authentication.interface';
import { UserDetailsDocument } from '../../api/user/user.interface';
import { ResponseObject } from '../database/connect.interface';

const JWT = 'ravebox';
const JWTADMIN = 'ravebox-admin';
const CSRF = 'XSRF-TOKEN';
const CSRFADMIN = 'XSRF-TOKEN-ADMIN';

/**
 * Validate the CSRF Token matches the header, cookie and JWT.
 *
 * @param { string } token - the JWT token.
 * @param { object } req - the request object.
 *
 * @return { string }
 */
const validateCSRF = (token: string, request: Request): string => {
  // Decode the token string.
  const decoded: string | {[key: string]: any} = Jwt.decode(token, {
    complete: true,
    json: true
  });

  const expires: number = (decoded.payload.exp as number) * 1000;
  const csrf: string = decoded.payload.csrf as string;
  const csrfHeader: string | Array<string> = request.headers['x-xsrf-token'];
  const csrfCookie: string | Array<string> = request.cookies[CSRF];

  // Check the JWT hasn't expired.
  if (expires <= Date.now()) {
    return;
  }

  // Check the X-XSRF-TOKEN header against the csrf.
  if (csrf !== csrfHeader) {
    return;
  }

  // Check the XSRF-TOKEN cookie against the csrf.
  if (csrf !== csrfCookie) {
    return;
  }

  // All checks have passed so return the JWT token.
  return token;
};

// Set the ExpressJwt secret to be used for database authentication.
const ValidateJwt: ExpressJwt.RequestHandler = ExpressJwt({
  secret: (EnvConfig.database) ? EnvConfig.database.secret : '',
  requestProperty: 'auth',
  getToken: function fromHeaderOrQueryString (req) {

    // Define the token.
    let token = '';

    // If the token doesn't exist, return an undefined token.
    if (_.isUndefined(req.cookies[JWT])) {
      return token;
    }

    // Validates the token and returns it or a null value.
    token = validateCSRF(req.cookies[JWT], req);

    // Return the token.
    return token;
  }
});

// Perform an authentication check but allow unauthenticated users to access.
const isAuthenticatedJWT: ExpressJwt.RequestHandler = ExpressJwt({
  credentialsRequired: false,
  secret: (EnvConfig.database) ? EnvConfig.database.secret : '',
  requestProperty: 'auth',
  getToken: function fromHeaderOrQueryString (req) {

    // Define the token.
    let token = '';

    // If the token doesn't exist, return an undefined token.
    if (_.isUndefined(req.cookies[JWT]) || _.isUndefined(req.cookies[CSRF])) {
      return token;
    }

    // Validates the token and returns it or a null value.
    token = validateCSRF(req.cookies[JWT], req);

    // Return the token.
    return token;
  }
});

/**
 * Defines the Authenticate Class.
 */
export default class Authenticate {

  /**
   * Checks if the user has the necessary role.
   *
   * @param {string} role - the string representation of the role required.
   */
  public static hasRole(
    role: UserRole
  ): Compose.RequestHandler<UserAttachedRequest, Response, void> {
    // If the required role wasn't provided.
    if (!role) {
      throw new Error('Role must be provided.');
    }
    // Compose authentication and the role validation into a single
    // middleware.
    return Compose.compose([
      //Authenticate.isAuthenticated(),
      (request: UserAttachedRequest, res: Response, next: NextFunction): void => {
        // Check the role provided is greater or equal to the permission level
        // of the role required.
        if (EnvConfig.roles.indexOf(request.user.role[0]) >= EnvConfig.roles.indexOf(role)) {
          // Allow progress to the next middleware.
          next();
        } else {
          // Return an error.
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              errorCode: 'ROLE_NOT_PERMITTED'
            }
          }, 403, 'Forbidden access');

          res.status(responseObject.status).json(responseObject.data).end();
        }
      }
    ]);
  }

  /**
   * Attaches the user to the request if they are logged in.
   */
  public static attachUser(
  ): Compose.RequestHandler<UserAttachedRequest, Response, void> {
    // Compose the Jwt validation and user authentication into a single
    // middleware to be attached to a request.
    return Compose.compose([
      // Validate the Jwt secret.
      (request: Request, response: Response, next: NextFunction): void => {

        // Retrieve the token passed by the client.
        if (_.isUndefined(request.cookies[JWT]) || _.isUndefined(request.cookies[CSRF])) {
          // Trigger the next middleware without attaching the user.
          return next();
        }

        // Validate the authorization header in the request.
        ValidateJwt(request, response, next);
      },
      // Attach the user to the request object.
      (request: UserAttachedRequest, response: Response, next: NextFunction): void => {

        // If the user doesn't exist.
        if (!request.user) {
          // Exit.
          return next();
        }

        // Find the User by the id provided in the request.
        User.findById(request.user._id)
          .then((user: UserDetailsDocument) => {
            // Define the token variable.
            let token;

            // If the user wasn't found.
            if (!user) {
              return next();
            }

            // Get the token from the Header.
            token = request.cookies[JWT];

            // If we should refresh the token.
            if (Authenticate.checkJWTExpiration(token)) {
              // Create a new token to be returned to the user.
              token = Authenticate.tokenRefresh(token);

              // Attach the token to the request object.
              response = Authenticate.setAuthenticatedResponseHeader(token, response);
            }

            // Attach the user to the request object for controller access.
            request.user = user.privateProfile;

            // Trigger the next middleware method.
            return next();

          })
          .catch((error: Error) => {
            console.log(error);
            // Return the error.
            return next();
          });
      }
    ]);

  }

  /**
   * Checks if the user is authenticated.
   *
   * @param { Request } request - the request object.
   * @param { Response } response - the response object.
   * @param { NextFunction } next - the function to progress to the next step.
   */
  static isAuthenticated(request: Request, response: Response, next: NextFunction): void {
    // Retrieve the token passed by the client.
    if (_.isUndefined(request.cookies[JWT]) || _.isUndefined(request.cookies[CSRF])) {
      // Define an error response to be returned.
      const responseObject = Connect.setResponse({
            data: {
              errorCode: 'NO_AUTHORIZATION_COOKIE',
              message: 'Please log in and try again'
            }
          }, 401, 'You need an active session to access this area');

      return response.status(responseObject.status).json(responseObject.data).end();
    }

    // Validate the authorization header in the request.
    ValidateJwt(request, response, next);
  }

  /**
   * Checks if the user has an admin role.
   *
   * @param { Request } request - the request object.
   * @param { Response } response - the response object.
   * @param { NextFunction } next - the function to progress to the next step.
   */
  static isAdmin(request: AuthenticatedUserRequest, response: Response, next: NextFunction): void {

    let responseObject: ResponseObject;

    if (!request.auth) {
      // Define an error response to be returned.
      responseObject = Connect.setResponse({
            data: {
              errorCode: 'NO_AUTHORIZATION_COOKIE',
              message: 'Please log in and try again'
            }
          }, 401, 'You need an active session to access this area');

      return response.status(responseObject.status).json(responseObject.data).end();
    }

    User.findOne({
      _id: request.auth._id,
      role: 'admin'
    })
    .then((userDocument: UserDetailsDocument) => {
      if (userDocument) {
        next();
      } else {
        throw new Error('Admin user not found.');
      }
    })
    .catch(() => {
      // Define an error response to be returned.
      responseObject = Connect.setResponse({
            data: {
              errorCode: 'NOT_AN_ADMIN',
              message: 'This is a restricted area for admins only.'
            }
          }, 401, 'This is a restricted area for admins only.');

      return response.status(responseObject.status).json(responseObject.data).end();
    })
  }
  /**
   * Checks if the user is authenticated and attaches them to the request.
   *
   * @param { Request } request - the request object.
   * @param { Response } response - the response object.
   * @param { NextFunction } next - the function to progress to the next step.
   */
  static AddUserToRequest(request: Request, response: Response, next: NextFunction): void {
    // Retrieve the token passed by the client.
    if (_.isUndefined(request.cookies[JWT]) || _.isUndefined(request.cookies[CSRF])) {
      return next();
    }

    // Validate the authorization header in the request.
    isAuthenticatedJWT(request, response, next);
  }

  /**
   * Attaches a user object to a request if an authenticated user exists.
   *
   * @param { Request } request - the request object.
   * @param { Response } response - the response object.
   * @param { NextFunction } next - the function to progress to the next step.
   */
  static AttachUser(request: AuthenticatedUserRequest, response: Response, next: NextFunction): void {
    // Find the User by the id provided in the request.
    User.findById(request.auth._id)
      .then((user: UserDetailsDocument) => {
        // Define the token variable.
        let token;
        // If the user wasn't found.
        if (!user) {
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              errorCode: 'EMAIL_NOT_FOUND'
            }
          }, 401, 'Email not registered.');

          return response.status(responseObject.status).json(responseObject.data).end();
        }

        // Get the token from the Header.
        token = request.cookies[JWT];

        // If we should refresh the token.
        if (Authenticate.checkJWTExpiration(token)) {
          // Create a new token to be returned to the user.
          token = Authenticate.tokenRefresh(token);

          // Attach the token to the request object.
          response = Authenticate.setAuthenticatedResponseHeader(token, response);
        }

        // Attach the user to the request object for controller access.
        request.user = user.privateProfile;

        // Trigger the next middleware method.
        return next();

      })
      .catch(error => {
        // Return the error.
        return next(error);
      });
  }

  /**
   * Returns a JWT based on the secret.
   *
   * @param { string } id - the user id.
   * @param { string } role - the user role.
   */
  static signToken(id: string, role: UserRole): string {
    // Generate a CSRF Token.
    const csrf: string = Authenticate.generateCSRF();

    // Return a JWT token using the id and role of the user, with a 3 hour
    // expiry.
    return Jwt.sign({_id: id, role: role, csrf: csrf}, EnvConfig.database.secret, {
      expiresIn: EnvConfig.authenticationTimeout
    });
  }

  /**
   * Creates a new token to extend user authentication.
   *
   * @param {string} oldToken - the existing token to be replaced.
   *
   * @return {string}
   */
  static tokenRefresh(oldToken: string): string {
    // Decode the token string.
    const decoded: string | {[key: string]: any} = Jwt.decode(oldToken, {
      complete: true,
      json: true
    });

    // Create a new token using the old user id and role values.
    return Authenticate.signToken(decoded.payload._id as string, decoded.payload.role as UserRole);
  }

  /**
   * Returns the CSRF token from the JWT.
   */
  static getCSRF(token: string): string {
    // Decode the token string.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    // Return the CSRF token from the decoded JWT.
    return decoded.payload.csrf as string;
  }

  /**
   * Creates a CSRF Token to be used for security against XSS and XSRF attacks.
   *
   * @return { string }
   */
  static generateCSRF(): string {
    // Create a CSRF JWT.
    return Jwt.sign({ now: Date.now() }, EnvConfig.security.csrfSecret, {
      expiresIn: EnvConfig.authenticationTimeout
    });
  }

  /**
   * Removes the Authentication cookie and header.
   *
   * @param { object } res - the response object.
   * 
   * @return { object }
   */
  static removeAuthentication(response: Response): Response {
    // Remove the JWT Cookie.
    response.clearCookie(JWT);

    // Remove the CSRF Cookie.
    response.clearCookie('XSRF-TOKEN');

    return response;
  }

  /**
   * Retrieves the admin id from the token if it exists.
   *
   * @param { object } res - the response object.
   * 
   * @return { object }
   */
  static getAdminUserIdFromToken(
    request: Request
  ): string {
    let id = '';

    const token: string = request.cookies[JWTADMIN];

    if (token) {
      // Decode the token string.
      const decoded: string | {[key: string]: any} = Jwt.decode(token, {
        complete: true,
        json: true
      });

      id = decoded.payload._id;
    }

    return id;
  }

  /**
   * Removes the administration cookie and header.
   *
   * @param { object } res - the response object.
   * 
   * @return { object }
   */
  static removeAdminAuthenticationResponseHeader(
    request: Request,
    response: Response
  ): Response {

    const token: string = request.cookies[JWTADMIN];

    // Decode the token string.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    // Generate the expiry date.
    const expiration: Date = new Date((decoded.payload.exp as number) * 1000);

    response.cookie(JWT, token, {
      domain: '.ravebox.io',
      expires: expiration,
      httpOnly: true
    });

    // Set the response cookie.
    response.cookie(CSRF, decoded.payload.csrf, {
      domain: '.ravebox.io',
      expires: expiration,
      httpOnly: false
    });

    // Remove the JWT Cookie.
    response.clearCookie(JWTADMIN);

    // Remove the CSRF Cookie.
    response.clearCookie('XSRF-TOKEN-ADMIN');

    return response;
  }

  /**
   * Sets an administration cookie and header.
   *
   * @param { object } res - the response object.
   * 
   * @return { object }
   */
  static setAdminAuthenticationResponseHeader(
    request: Request,
    response: Response
  ): Response {

    const token: string = request.cookies[JWT];

    // Decode the token string.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    // Generate the expiry date.
    const expiration: Date = new Date((decoded.payload.exp as number) * 1000);

    response.cookie(JWTADMIN, token, {
      domain: '.ravebox.io',
      expires: expiration,
      httpOnly: true
    });

    // Set the response cookie.
    response.cookie(CSRFADMIN, decoded.payload.csrf, {
      domain: '.ravebox.io',
      expires: expiration,
      httpOnly: false
    });

    return response;
  }

  /**
   * Sets the authentication values on the response object.
   *
   * @param { string } token - the decoded CSRF token.
   * @param { object } res - the response object.
   *
   * @return { object }
   */
  static setAuthenticatedResponseHeader(
    token: string,
    response: Response
  ): Response {
    // Decode the token string.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    // Generate the expiry date.
    const expiration: Date = new Date((decoded.payload.exp as number) * 1000);

    // Set the read only JWT.
    response.cookie(JWT, token, {
      domain: '.ravebox.io',
      expires: expiration,
      httpOnly: true
    });

    // Set the response cookie.
    response.cookie('XSRF-TOKEN', decoded.payload.csrf, {
      domain: '.ravebox.io',
      expires: expiration,
      httpOnly: false
    });

    return response;
  }

  /**
   * Checks the expiration state of the JWT.
   *
   * @param { string } token = the JWT token.
   *
   * @return { boolean }
   */
  static checkJWTExpiration(token: string): boolean {
    // Decode the token string.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    const bufferTime = Math.floor((Date.now() / 1000)) + EnvConfig.refreshBuffer;

    // If the token expriation is less than the current time plus the refresh
    // buffer time, we need to create a new token.
    return (decoded.payload.exp <= bufferTime) ? true : false;
  }

}


