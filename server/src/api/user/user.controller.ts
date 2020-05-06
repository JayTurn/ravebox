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
import Review from '../review/review.model';
import User from './user.model';
import UserCommon from './user.common';
import UserStatistics from '../userStatistics/userStatistics.model'
//import UserNotifications from './userNotifications.model';
import LocalController from './authenticate/local.strategy';
import Notifications from '../../shared/notifications/Notifications.model';

// Enumerators.
import { UserRole } from './user.enum';
import {
  EmailTemplate,
  ContactList
} from '../../shared/notifications/Notifications.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ProfileSettings,
  SignupDetails,
  UserChannel,
  UserDetailsDocument
} from './user.interface';
import {
  ProfileStatistics,
  UserStatisticsDocument
} from '../userStatistics/userStatistics.interface'
import {
  ReviewDetails,
  ReviewDocument
} from '../review/review.interface';

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

    // Retrieves a user's channel.
    router.get(`${path}/channel/:handle`, UserController.RetrieveChannel);

    // Validate the existing of a user handle.
    router.get(`${path}/handle/:id`, UserController.HandleAvailability);

    // Attempt to reset the user's password.
    router.patch(`${path}/password/new`, UserController.SetNewPassword);

    // Attempt to reset the user's password.
    router.patch(`${path}/password/reset`, UserController.RequestPasswordResetLink);

    // Attempt to verify the user's password.
    router.patch(`${path}/password/verify`, Authenticate.isAuthenticated, UserController.VerifyPassword);

    // Attempt to verify a password token for reset.
    router.get(`${path}/password/:token`, UserController.VerifyPasswordToken);

    // Retrieve the user's profile.
    //router.get(`${path}/profile`, Authenticate.isAuthenticated, UserController.Profile);

    // Attempt to sign up a user based on the form data.
    router.post(`${path}/signup`, UserController.SignUp);

    // Retrieves a user's publicly accessible statistics.
    router.get(`${path}/statistics/profile/:id`, UserController.RetrievePublicProfileStatistics);

    // Attempt to change the email address.
    router.patch(`${path}/update/email`, Authenticate.isAuthenticated, UserController.UpdateEmail);

    // Attempt to change the user's password.
    router.patch(`${path}/update/password`, Authenticate.isAuthenticated, UserController.UpdatePassword);

    // Attempt to retrieve the user.
    router.patch(`${path}/update/profile`, Authenticate.isAuthenticated, UserController.UpdateProfile);

    // Verify the email address.
    router.get(`${path}/verify/:token`, UserController.VerifyEmail);

  }

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
    const newUserStatistics: UserStatisticsDocument = new UserStatistics(),
          newUser: UserDetailsDocument = new User({
            ...userDetails,
            statistics: newUserStatistics._id
          });
        //leadConversion = false;
        //mailchimp = new Mailchimp(EnvConfig.mailchimp.apiKey);

    // Update the new user statistics with the user id.
    newUserStatistics.user = newUser._id;
    newUserStatistics.save();

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
          Notifications.AddEmailToList(
            user.email,
            user.handle,
            ContactList.ALL
          )
            .then((email: string) => {
              Notifications.SendTransactionalEmail(
                {email: email, name: user.handle},
                EmailTemplate.SIGNUP
              );

              UserCommon.SendEmailVerification(user);

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
   * Get current user handler.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static UpdateProfile(request: AuthenticatedUserRequest, response: Response): void {
    const settings: ProfileSettings = request.body;

    // Find the user and update the profile settings.
    User.findByIdAndUpdate(
      request.auth._id,
      { handle: settings.handle },
      { new: true, upsert: false }
    )
    .then((user: UserDetailsDocument) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          user: user.privateProfile
        }
      }, 200, 'Account updated successfully');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch(() => {

      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_UPDATE_PROFILE',
            title: `There was a problem updating your profile`
          }
        }, 403, `There was a problem updating your profile`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Send an email verification link.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  static UpdateEmail(request: AuthenticatedUserRequest, response: Response): void {
    // Declare the response object
    const email: string = request.body.email;

    // if we don't have an email throw a response error.
    if (!email) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_PROVIDE_EMAIL',
            title: `We need a new email to update your existing one`
          }
        }, 403, `We need a new email to update your existing one`);

      // Return the response.
      throw responseObject;
    }

    // Search for the user by the email address provided.
    User.findById(request.auth._id)
    .then((user: UserDetailsDocument) => {

      // If we have found a user.
      if (user) {

        return User.findByIdAndUpdate(
          user._id,
          {
            oldEmail: user.email,
            email: email,
            emailVerified: false
          },
          { new: true, upsert: false}
        );
      } else {
        throw new Error('User not found');
      }
    })
    .then((user: UserDetailsDocument) => {

      // Send the verification email.
      UserCommon.SendEmailVerification(user);

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          user: user.privateProfile
        }
      }, 200, 'Email updated successfully.');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch(() => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_RESET_LOOKUP',
          message: 'Please enter your email and try again'
        }
      }, 404, 'We could not reset your password');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    });
  }

  /**
   * Verifies the email token provided.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  public static VerifyEmail(request: Request, response: Response): void {
    const token: string = request.params.token;

    // Decode the token so we can confirm the email address matches in the
    // database.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    if (!decoded) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_RETRIEVE_EMAIL',
            title: `We couldn't retrieve your email`
          }
        }, 403, `We couldn't retrieve your email`);

      // Return the response.
      throw responseObject;
    }

    const email: string = decoded.payload.email as string,
          _id: string = decoded.payload.userId as string;

    // Find the user by their id, email address and update their verification
    // status.
    User.findOneAndUpdate({
      _id: _id,
      email: email
    }, {
      emailVerified: true,
    }, {
      new: true,
      upsert: false
    })
    .then((user: UserDetailsDocument) => {

      // Define the response object.
      let responseObject: ResponseObject;

      if (!user) {
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            verified: false
          }
        }, 200, 'Your email could not be verified');
      } else {
        if (user.oldEmail) {
          // Remove the old email from all notification lists.
          Notifications.UpdateContactEmail(user.oldEmail, user.email);
        }
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            verified: true
          }
        }, 200, 'Your email has been successfully verified');
      }

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch(() => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_VERIFICATION',
          message: `We couldn't verify your email address`
        }
      }, 404, `We couldn't verify your email address`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Updates the current user's password.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static UpdatePassword(request: AuthenticatedUserRequest, response: Response): void {
    const oldPassword: string = request.body.oldPassword,
          password: string = request.body.password;

    // Retrieve the current logged in user.
    User.findById(request.auth._id)
      .then((user: UserDetailsDocument) => {
        user.authenticate(oldPassword, (error: Error, verified: boolean) => {
          if (error) {
            throw error;
          }

          if (verified) {
            user.updatePassword(password, (error: Error, hash: string, salt: string) => {
              if (error) {
                throw error;
              }
              User.findByIdAndUpdate(
                user._id,
                { password: hash, salt: salt },
                {
                  new: true,
                  upsert: false
                }
              )
              .then((user: UserDetailsDocument) => {
                // Set the response object.
                const responseObject = Connect.setResponse({
                  data: {
                    user: user.privateProfile
                  }
                }, 200, 'Verification complete');

                // Return the response.
                response.status(responseObject.status).json(responseObject.data);
              })
              .catch((error: Error) => {
                throw error;
              })
            });
          } else {

            // Define the responseObject.
            const responseObject = Connect.setResponse({
              data: {
                errorCode: 'FAILED_PASSWORD_UPDATE',
                message: `The old password you entered was incorrect`
              }
            }, 404, `The old password you entered was incorrect`);

            // Return the response.
            response.status(responseObject.status).json(responseObject.data);
          }
        });
      })
      .catch(() => {

        // Define the responseObject.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_PASSWORD_VERIFICATION',
            message: `We couldn't verify your password`
          }
        }, 404, `We couldn't verify your password`);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);

      })
  }

  /**
   * Verifies the password token provided.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  public static VerifyPasswordToken(request: Request, response: Response): void {
    const token: string = request.params.token;

    // Decode the token so we can confirm the email address matches in the
    // database.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    if (!decoded) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_CONFIRM_ACCOUNT',
            title: `We couldn't confirm your account`
          }
        }, 403, `We couldn't confirm your account`);

      // Return the response.
      throw responseObject;
    }

    const email: string = decoded.payload.email as string,
          _id: string = decoded.payload.userId as string;

    // Find the user by their id and email address.
    User.findOne({
      _id: _id,
      email: email
    })
    .then((user: UserDetailsDocument) => {

      // Define the response object.
      let responseObject: ResponseObject;

      if (!user) {
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            allowed: false
          }
        }, 200, 'Account not found');
      } else {
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            allowed: true
          }
        }, 200, 'Account found');
      }

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch(() => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_VERIFICATION',
          message: `We couldn't verify your email address`
        }
      }, 404, `We couldn't verify your email address`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Verifies the current user's password.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static VerifyPassword(request: AuthenticatedUserRequest, response: Response): void {
    const password: string = request.body.password;

    // Retrieve the current logged in user.
    User.findById(request.auth._id)
      .then((user: UserDetailsDocument) => {
        user.authenticate(password, (error: Error, verified: boolean) => {
          if (error) {
            throw error;
          }
          // Set the response object.
          const responseObject = Connect.setResponse({
            data: {
              verified: verified
            }
          }, 200, 'Verification complete');

          // Return the response.
          response.status(responseObject.status).json(responseObject.data);
        });
      })
      .catch(() => {

        // Define the responseObject.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_PASSWORD_VERIFICATION',
            message: `We couldn't verify your password`
          }
        }, 404, `We couldn't verify your password`);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);

      })
  }

  /**
   * Request a password reset link.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  static RequestPasswordResetLink(request: Request, response: Response): void {

    const email: string = request.body.email;

    if (!email) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_RETRIEVE_EMAIL',
            title: `We couldn't retrieve your email`
          }
        }, 403, `We couldn't retrieve your email`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
      return;
    }

    // Search for the user by the email address provided.
    User.findOne({
      'email': email,
    })
    .then((user: UserDetailsDocument) => {

      // If we have found a user.
      if (user) {
        UserCommon.SendPasswordResetLink(user.privateProfile);
      }

      // Set the response object.
      const responseObject = Connect.setResponse({
        data: { }
      }, 200, 'Password reset link sent successfully');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch(error => {
      console.log(error);
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_PASSWORD_RESET_LINK',
          message: `We couldn't send a password reset link. Please try again`
        }
      }, 403, `We couldn't send a password reset link. Please try again`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    });
  }

  /**
   * Sets a new password using the token and new password provided.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  static SetNewPassword(request: Request, response: Response): void {
    const password: string = request.body.password,
          token: string = request.body.token;

    // Decode the token so we can confirm the email address matches in the
    // database.
    const decoded: string | {[key: string]: any} = Jwt.decode(token, {
      complete: true,
      json: true
    });

    if (!password || !decoded) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_SET_NEW_PASSWORD',
            title: `We couldn't update your password with the token provided`
          }
        }, 403, `We couldn't update your password with the token provided`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    const email: string = decoded.payload.email as string,
          _id: string = decoded.payload.userId as string;

    // Encrypt the password and store it with the user.
    User.findOne({
      _id: _id,
      email: email
    })
    .then((user: UserDetailsDocument) => {

      if (!user) {
        throw new Error(`User doesn't exsit`);
      }

      // Update the user's password.
      user.updatePassword(password, (error: Error, hash: string, salt: string) => {
        if (error) {
          throw error;
        }
        User.findByIdAndUpdate(
          user._id,
          { password: hash, salt: salt },
          {
            new: true,
            upsert: false
          }
        )
        .then(() => {
          // Set the response object.
          const responseObject = Connect.setResponse({
            data: {
              success: true
            }
          }, 200, 'Password updated');

          // Return the response.
          response.status(responseObject.status).json(responseObject.data);
        })
        .catch((error: Error) => {
          throw error;
        })
      });
    })
    .catch(() => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_SET_NEW_PASSWORD',
            title: `We couldn't update your password with the token provided`
          }
        }, 403, `We couldn't update your password with the token provided`);

      // Return the response.
      return response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Retrieves a user's public profile statistics.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  public static RetrievePublicProfileStatistics(request: Request, response: Response): void {
    const userId: string = request.params.id;

    if (!userId) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_ID_MISSING_FROM_PROFILE_STATISTICS_REQUEST',
            title: `We couldn't find results for the requested user`
          }
        }, 404, `We couldn't find results for the requested user`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
      return;
    }

    // Create a user statistics object to be returned.
    const userStatistics: ProfileStatistics = {
      ravesCount: 0
    };

    Review.countDocuments({
      user: userId
    })
    .then((count: number) => {
      userStatistics.ravesCount = count;

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          statistics: userStatistics
        }
      }, 200, 'User profile statistics returned successfully');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      console.log(error);
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_COUNT_FAILED_FOR_USER',
            title: `We couldn't find results for the requested user`
          }
        }, 404, `We couldn't find results for the requested user`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * Retrieves the data that forms a user's channel.
   *
   * @param {object} req
   *   The request object.
   * @param {object} res
   *   The response object.
   */
  public static RetrieveChannel(request: Request, response: Response): void {
    // Define the user's handle.
    const handle: string = request.params.handle;

    // If we don't have a handle, return an error.
    if (!handle) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_HANDLE_MISSING_FROM_CHANNEL_REQUEST',
            title: `We couldn't find a channel for the handle requested`
          }
        }, 404, `We couldn't find a channel for the handle requested`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
      return;
    }

    // Define the channel object to be built upon.
    const channel: UserChannel = {
      reviews: []
    };

    // Perform the request to retrieve the user.
    User.findOne({
      handle: handle
    })
    .populate({
      path: 'statistics',
      model: 'UserStatistic'
    })
    .then((userDetails: UserDetailsDocument) => {
      // Add the public user details to the channel object.
      if (userDetails) {
        channel.profile = {...userDetails.publicProfile};
      }

      // Perform a request to retrieve the reviews the user has recored.
      return Review.find({
        user: userDetails._id,
        published: Workflow.PUBLISHED
      })
      .populate({
        path: 'statistics',
        model: 'ReviewStatistic'
      });
    })
    .then((reviews: Array<ReviewDocument>) => {
      let responseObject: ResponseObject;

      // Return the channel without reviews if none exist.
      if (!reviews || reviews.length <= 0) {
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            channel: channel
          }
        }, 200, 'Channel returned successfully without reviews');

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);

        return;
      }

      // If we have a list of reviews, loop through and populate the channel
      // reviews.
      let i = 0;

      do {
        // Curate the reviews with reduced details and statistics.
        const current: ReviewDocument = reviews[i];
        const reviewDetails: ReviewDetails = {...current.details};

        if (current.statistics) {
          reviewDetails.statistics = {...current.statistics.details};
        }

        channel.reviews.push({...reviewDetails});

        i++;

      } while (i < reviews.length);
      
      // Set the response object.
      responseObject = Connect.setResponse({
        data: {
          channel: channel
        }
      }, 200, 'Channel returned successfully with reviews');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      console.log(error);

      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'ERROR_LOADING_CHANNEL',
            title: `We couldn't load the channel for the handle requested`
          }
        }, 404, `We couldn't load the channel for the handle requested`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

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
