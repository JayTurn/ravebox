/**
 * user.controller.js
 * A User Controller Class.
 */
'use strict';

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import Follow from '../follow/follow.model';
import * as Jwt from 'jsonwebtoken';
import Images from '../../shared/images/Images.model';
import Invitation from '../invitation/invitation.model';
import LocalController from './authenticate/local.strategy';
import Logging from '../../shared/logging/Logging.model';
import {
  Request,
  Response,
  Router
} from 'express';
import Review from '../review/review.model';
import * as S3 from 'aws-sdk/clients/s3';
import User from './user.model';
import UserCommon from './user.common';
import UserStatistics from '../userStatistics/userStatistics.model'
import Notifications from '../../shared/notifications/Notifications.model';

// Enumerators.
import {
  EmailTemplate,
  ContactList
} from '../../shared/notifications/Notifications.enum';
import { InvitationStatus } from '../invitation/invitation.enum';
import { LogLevel } from '../../shared/logging/Logging.enum';
import { UserRole } from './user.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  FollowDocument
} from '../follow/follow.interface';
import { InvitationDetailsDocument } from '../invitation/invitation.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ProfileSettings,
  SignupDetails,
  UserChannel,
  UserDetailsDocument
} from './user.interface';
import {
  ProfileStatistics,
  UserStatistics as UserStats,
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

    // Create a metadata file for a review an upload to S3.
    router.post(
      `${path}/image/request`,
      Authenticate.isAuthenticated,
      UserController.CreateImageRequest
    );

    // Retrieves the raves a user is following.
    router.get(`${path}/following`, Authenticate.isAuthenticated, UserController.RetrieveFollowing);

    // Attempt to reset the user's password.
    router.patch(`${path}/password/new`, UserController.SetNewPassword);

    // Attempt to reset the user's password.
    router.patch(`${path}/password/reset`, UserController.RequestPasswordResetLink);

    // Attempt to verify the user's password.
    router.patch(`${path}/password/verify`, Authenticate.isAuthenticated, UserController.VerifyPassword);

    // Attempt to verify a password token for reset.
    router.get(`${path}/password/:token`, UserController.VerifyPasswordToken);

    // Retrieve the user's profile.
    router.get(`${path}/profile`, Authenticate.isAuthenticated, UserController.Profile);

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
      .populate({
        path: 'following',
        model: 'Follow'
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
      .catch((error: Error) => {
        // Attach the private user profile to the response.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_NOT_FOUND',
            message: 'Please log in and try again'
          },
          error: error
        }, 401, 'Account not found');

        Logging.Send(LogLevel.ERROR, responseObject);

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

      Logging.Send(LogLevel.WARNING, responseObject);

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
    const userDetails: SignupDetails = {
      email: request.body.email,
      handle: request.body.handle,
      password: request.body.password,
      provider: EnvConfig.providers[0]
    };

    // Capture the invitation id.
    const invitation: string = request.body.invitationId;

    // Check to make sure the invitation is valid.
    Invitation.findOne({
      _id: invitation,
      status: InvitationStatus.WAITING
    })
    .then((invitationDetails: InvitationDetailsDocument) => {
      // Exit if we don't have any invitation details.
      if (!invitationDetails) {
        throw new Error(`We couldn't validate your invitation`);
      }

      return invitationDetails;
    })
    .then((invitationDetails: InvitationDetailsDocument) => {

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
      newUserStatistics.save();

      // Update the new follow document with the user id.
      newFollow.user = newUser._id;
      newFollow.save();

      // Set the provider type.
      newUser.provider = EnvConfig.providers[0];

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
                // Set the response object.
                const responseObject = Connect.setResponse({
                    data: {
                      errorCode: 'FAILED_SENDING_SIGNUP_EMAIL',
                      message: `We couldn't send a signup email`
                    },
                    error: error
                  }, 422, 'Signup email failed');

                // Log the failed email handling.
                Logging.Send(LogLevel.ERROR, responseObject);

              });

            Invitation.updateOne({
              _id: invitationDetails._id
            }, {
              status: InvitationStatus.ADDED
            }, {new: true, upsert: false}
            ).then(() => {
              // Retrieve the referring user and add this one to their list of
              // successful invites.
              User.findById(
                invitationDetails.invitedBy
              )
              .populate({
                path: 'statistics',
                model: 'UserStatistic'
              })
              .then((invitedUserDetails: UserDetailsDocument) => {
                // Update the user statistics with the added user.
                const userStats: UserStats = {...invitedUserDetails.statistics};

                let invited: Array<string>;

                if (userStats.invited) {
                  invited = [...userStats.invited];

                  invited.push(user._id);
                } else {
                  invited = [user._id]
                }

                UserStatistics.updateOne({
                  user: invitedUserDetails._id
                }, {
                  $set: {
                    invited: invited
                  }
                }, {new: true, upsert: false})
                .catch((error: Error) => {
                  // Set the response object.
                  const responseObject = Connect.setResponse({
                      data: {
                        errorCode: 'FAILED_TO_UPDATE_INVITED_LIST',
                        message: `We couldn't send a signup email`
                      },
                      error: error
                    }, 422, `Failed to update list of invited users for ${invitedUserDetails._id}`);

                  // Log the failed email handling.
                  Logging.Send(LogLevel.ERROR, responseObject);
                });
              });
            })
            .catch((error: Error) => {
              // Set the response object.
              const responseObject = Connect.setResponse({
                  data: {
                    errorCode: 'FAILED_UPDATING_INVITATION_STATUS',
                    message: `Invitation ${invitationDetails._id} failed to update`
                  },
                  error: error
                }, 422, `Invitation ${invitationDetails._id} failed to update`);

              // Log the failed email handling.
              Logging.Send(LogLevel.ERROR, responseObject);
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

          // Log the error.
          Logging.Send(LogLevel.ERROR, responseObject);

          // Return the response.
          return response.status(responseObject.status).json(responseObject.data).end();
        }

        // Define the responseObject.
        responseObject = Connect.setResponse({
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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_CHECK_HANDLE',
            message: `There was a problem checking the availability of this handle. Please try again`
          },
          error: error
        }, 404, `There was a problem checking the availability of this handle. Please try again`);

        Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * Performs a request to POST the image metadata.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CreateImageRequest(request: AuthenticatedUserRequest, response: Response): void {
    const imageTitle: string = request.body.imageTitle,
          imageSize: string = request.body.imageSize,
          imageType: string = request.body.imageType,
          userId: string = request.auth._id;

    if (!imageTitle || !imageSize || !imageType || !userId) {
      return;
    }

    // Define the path to be stored in the database.
    const storagePath = `images/avatars/${userId}/${imageTitle}`;

    // Create a presigned request for the new image file.
    Images.CreatePresignedImageRequest(
      imageTitle,
      imageSize,
      imageType,
      `images/avatars/${userId}`
    ).then((requestData: S3.PresignedPost) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          presigned: requestData,
          path: `${EnvConfig.CDN}${storagePath}`
        }
      }, 200, `${userId}: Presigned image request successful`);

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'REVIEW_NOT_UPDATED',
          message: 'There was a problem updating your review'
        },
        error: error
      }, 401, 'There was a problem updating your review');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
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
      {
        handle: settings.handle,
        avatar: settings.avatar
      },
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
    .catch((error: Error) => {

      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_UPDATE_PROFILE',
            message: `There was a problem updating your profile`
          },
          error: error
        }, 403, `There was a problem updating your profile`);

      Logging.Send(LogLevel.ERROR, responseObject);

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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_RESET_LOOKUP',
          message: 'Please enter your email and try again'
        },
        error: error
      }, 404, 'We could not reset your password');

      Logging.Send(LogLevel.ERROR, responseObject);

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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_VERIFICATION',
          message: `We couldn't verify your email address`
        },
        error: error
      }, 404, `We couldn't verify your email address`);

      Logging.Send(LogLevel.ERROR, responseObject);

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
      .catch((error: Error) => {

        // Define the responseObject.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_PASSWORD_VERIFICATION',
            message: `We couldn't verify your password`
          },
          error: error
        }, 404, `We couldn't verify your password`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      });
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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_EMAIL_VERIFICATION',
          message: `We couldn't verify your email address`
        },
        error: error
      }, 404, `We couldn't verify your email address`);

      Logging.Send(LogLevel.ERROR, responseObject);

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
      .catch((error: Error) => {

        // Define the responseObject.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_PASSWORD_VERIFICATION',
            message: `We couldn't verify your password`
          },
          error: error
        }, 404, `Failed to verify the password`);

        Logging.Send(LogLevel.ERROR, responseObject);

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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_PASSWORD_RESET_LINK',
          message: `We couldn't send a password reset link. Please try again`
        },
        error: error
      }, 403, `We couldn't send a password reset link. Please try again`);

      Logging.Send(LogLevel.ERROR, responseObject);

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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_SET_NEW_PASSWORD',
            title: `We couldn't update your password with the token provided`
          },
          error: error
        }, 403, `We couldn't update your password with the token provided`);

      Logging.Send(LogLevel.ERROR, responseObject);

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

    User.findById(userId)
    .populate({
      path: 'statistics',
      model: 'UserStatistic'
    })
    .then((userDetails: UserDetailsDocument) => {

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          statistics: {
            ravesCount: userDetails.statistics.ravesCount,
            followers: userDetails.statistics.followers
          }
        }
      }, 200, 'User profile statistics returned successfully');

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_STATISTICS_FAILED_FOR_USER',
            title: `We couldn't find results for the requested user`
          },
          error: error
        }, 404, `We couldn't find results for the requested user`);

      Logging.Send(LogLevel.ERROR, responseObject);

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
        path: 'product',
        model: 'Product',
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
        const reviewDetails: ReviewDetails = {
          ...current.details,
          user: channel.profile
        };

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

      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'ERROR_LOADING_CHANNEL',
            message: `We couldn't load the channel for the handle requested`
          },
          error: error
        }, 404, `We couldn't load the channel for the handle requested`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Retrieves the list of reviews a user is following.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveFollowing(request: AuthenticatedUserRequest, response: Response): void {
    const id: string = request.auth._id;

    if (!id) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_ID_NOT_PROVIDED_FOR_FOLLOWING',
            message: `You must be logged in to retrieve your followed raves`
          },
          error: new Error('ID not provided for request.')
        }, 403, `You must be logged in to retrieve your followed raves`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Request the list of users currently followed.
    User.findOne({
      _id: id
    })
    .populate({
      path: 'following',
      model: 'Follow'
    })
    .then((userDocument: UserDetailsDocument) => {

      if (userDocument.following.channels) {
        return userDocument.following.channels;
      } else {
        return [];
      }
    })
    .then((users: Array<string>) => {
      if (users.length <= 0) {
        // Return the updated list of followers.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            reviews: []
          }
        }, 200, 'No followed raves found');

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
        return;
      }

      Review.find({
        user: {
          $in: users
        },
        published: Workflow.PUBLISHED
      })
      .populate({
        path: 'product',
        model: 'Product',
      })
      .populate({
        path: 'statistics',
        model: 'ReviewStatistic'
      })
      .populate({
        path: 'user',
        model: 'User'
      })
      .populate({
        path: 'user.userStatistics',
        model: 'UserStatistic'
      })
      .sort({
        created: -1
      })
      .then((reviews: Array<ReviewDocument>) => {

        const publicReviews: Array<ReviewDetails> = [];

        if (reviews.length > 0) {
          // If we have a list of reviews, loop through and populate the channel
          // reviews.
          let i = 0;

          do {
            // Curate the reviews with reduced details and statistics.
            const current: ReviewDocument = reviews[i];
            const reviewDetails: ReviewDetails = {
              ...current.details,
              product: current.product.details,
              user: current.user.publicProfile
            };

            publicReviews.push({...reviewDetails});

            i++;

          } while (i < reviews.length);
        }

        // Return the updated list of followers.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            reviews: publicReviews
          }
        }, 200, 'Reviews returned successfully');

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        throw error;
      })

    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'ERROR_RETRIEVING_FOLLOWED_REVIEWS',
          message: `We encountered a problem when attempting to retrieve the raves you're following`
        },
        error: error
      }, 404, `We encountered a problem when attempting to retrieve the raves you're following`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }
}
