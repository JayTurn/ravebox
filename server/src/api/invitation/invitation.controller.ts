/**
 * invitation.controller.js
 * A Invitation Controller Class.
 */
'use strict';

// Modules.
//import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
//import EnvConfig from '../../config/environment/environmentBaseConfig';
import Logging from '../../shared/logging/Logging.model';
import Invitation from './invitation.model';
import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
//import Review from '../review/review.model';
import User from '../user/user.model';
//import UserCommon from '../user/user.common';
//import UserStatistics from '../userStatistics/userStatistics.model'
import Notifications from '../../shared/notifications/Notifications.model';

// Enumerators.
import {
  EmailTemplate,
  ContactList
} from '../../shared/notifications/Notifications.enum';
import { InvitationStatus } from './invitation.enum';
import { LogLevel } from '../../shared/logging/Logging.enum';
//import { UserRole } from '../user/user.enum';
//import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
//import {
  //AuthenticatedUserRequest
//} from '../../models/authentication/authentication.interface';
import {
  InvitationDetails,
  InvitationDetailsDocument
} from './invitation.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import { UserDetailsDocument } from '../user/user.interface';

/**
 * Defines the InvitationController Class.
 */
export default class InvitationController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'invitation';

    // Get the index route.
    router.get(path, (req: Request, res: Response) => {
      new InvitationController().getStatus(req, res);
    });

    // Request an invitation to join.
    router.post(
      `${path}`,
      InvitationController.RequestInvitation
    );

    // Validates an invitation.
    router.get(`${path}/:id`, InvitationController.ValidateInvitation);

  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Invitations are healthy!'});
  }

  /**
   * Requests and invitation to join the app.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RequestInvitation(request: Request, response: Response, next: NextFunction): void {
    const email: string = request.body.email,
          existingChannel: string = request.body.existingChannel

    if (!email) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'INVITATION_EMAIL_NOT_PROVIDED',
          title: `Please provide an email to be used for the invitation`
        }
      }, 200, `Please provide an email to be used for the invitation`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      Logging.Send(LogLevel.WARNING, responseObject);
      return next();
    }

    const invite: InvitationDetailsDocument = new Invitation({
      email: email,
      existingChannel: existingChannel
    });

    // Check to make sure the email address isn't already associated with a
    // user account or an existing invitation.
    User.findOne({
      email: email
    })
    .lean()
    .then((existingUser: UserDetailsDocument) => {

      // If the user exists, return a notification message.
      if (existingUser) {

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_EMAIL_ALREADY_REGISTERED',
            title: `Someone has already registered an account with this email address.`
          }
        }, 200, `Someone has already registered an account with this email address.`);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);

        Logging.Send(LogLevel.WARNING, responseObject);
        return next();
      }

      // Check if the email is already registered with a requested invitation.
      return Invitation.findOne({
        email: email
      })
      .lean()
      .then((existingInvite: InvitationDetails) => {
        // If the email has already been used to request an invitation, return
        // a notification message.
        if (existingInvite) {
          // Set the response object.
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              errorCode: 'INVITATION_PREVIOUSLY_REQUESTED_FOR_EMAIL_ADDRESS',
              title: `An invitation has already been requested for this email address.`
            }
          }, 200, `An invitation has already been requested for this email address.`);

          // Return the response.
          response.status(responseObject.status).json(responseObject.data);

          Logging.Send(LogLevel.WARNING, responseObject);
          return next();
        }

        invite.save()
          .then((invitation: InvitationDetailsDocument) => {
            // Return the successful response.
            const responseObject: ResponseObject = Connect.setResponse({
              data: {
                title: `Your request for an invitation has been submitted`
              }
            }, 200, `Your request for an invitation has been submitted`);

            Notifications.AddEmailToList(
              invitation.email,
              '',
              ContactList.REQUESTED_INVITE
            )
            .then((email: string) => {

              Notifications.SendTransactionalEmail(
                {email: email, name: 'Unknown'},
                EmailTemplate.INVITATION_REQUEST
              );

            });
            // Return the response.
            response.status(responseObject.status).json(responseObject.data);
          });
      })
      .catch((error: Error) => {
        throw error;
      });
    })
    .catch((error: Error) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: error.name,
          title: error.message
        }
      }, 404, error.message);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    });
  }

  /**
   * Validates an invitation to join the app.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static ValidateInvitation(request: Request, response: Response, next: NextFunction): void {
    const invitationId: string = request.params.id;

    // If we haven't been provided an id, respond with an error.
    if (!invitationId) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: 'INVITATION_ID_NOT_PROVIDED',
          title: `This invitation is invalid`
        }
      }, 200, `This invitation is invalid`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      Logging.Send(LogLevel.WARNING, responseObject);
      return next();
    }

    // Perform a search for the invitation.
    Invitation.findOne({
      _id: invitationId
    })
    .lean()
    .then((invitationDetails: InvitationDetails) => {
      // Declare the response object to be returned.
      let responseObject: ResponseObject;

      if (!invitationDetails || invitationDetails.status !== InvitationStatus.WAITING) {
        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'INVITATION_NOT_AVAILABLE',
            title: `Invitation ${invitationId} is not available`
          }
        }, 200, `This invitation is not available`);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);

        Logging.Send(LogLevel.WARNING, responseObject);

        return next();
      }

      // Return the successful response.
      responseObject = Connect.setResponse({
        data: {
          invitation: invitationDetails
        }
      }, 200, `Your request for an invitation has been submitted`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_VALIDATE_INVITATION',
            title: `We couldn't validate your invitation`
          },
          error: error
        }, 404, `We couldn't validate your invitation`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }
}
