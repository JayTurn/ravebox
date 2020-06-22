/**
 * follow.controller.js
 * A follow Controller Class.
 */
'use strict';

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Follow from './follow.model';
import Logging from '../../shared/logging/Logging.model';
import {
  Request,
  Response,
  Router
} from 'express';
import User from '../user/user.model';
import UserStatisticsCommon from '../userStatistics/userStatistics.common';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  FollowDocument,
  Following
} from './follow.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  UserDetailsDocument
} from '../user/user.interface';

/**
 * Defines the FollowController Class.
 */
export default class FollowController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'follow';

    // Get the index route.
    router.get(path, FollowController.getStatus);

    // Follows or unfollows the user based on the channel handle provided.
    router.get(`${path}/channel/:id`, Authenticate.isAuthenticated, FollowController.Channel);
  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Follows are healthy!'});
  }

  /**
   * Follows the channel based on the handle provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Channel(request: AuthenticatedUserRequest, response: Response): void {
    // Define the user's handle.
    const id: string = request.params.id;

    // If we haven't been provided a handle, return an error response.
    if (!id) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'HANDLE_NOT_PROVIDED_FOR_FOLLOWING',
            message: `We couldn't follow the user based on the handle provided`
          },
          error: new Error(`Handle not provdied`)
        }, 404, `We couldn't follow the user based on the handle provided`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Attempt to find the user of the channel we should be following.
    User.findOne({
      _id: id
    })
    .then((channel: UserDetailsDocument) => {

      if (!channel) {
        throw new Error('Channel not found');
      }

      // Find the current user's follow document.
      User.findOne({
        _id: request.auth._id
      })
      .populate({
        path: 'following',
        model: 'Follow'
      })
      .then((userDocument: UserDetailsDocument) => {

        const following: Following | undefined = userDocument.following ? userDocument.following.details : undefined;

        if (!following) {
          const newFollow: FollowDocument = new Follow({
            user: request.auth._id,
            channels: [channel._id]
          });

          // Save the new follow document with the user added.
          newFollow.save();

          UserStatisticsCommon.IncrementFollowers(channel._id, 1);

          User.findOneAndUpdate({
            _id: userDocument._id
          }, {
            following: newFollow._id
          }, {
            new: false, upsert: false
          })
          .catch((error: Error) => {
            throw error;
          });

          return newFollow;
        } else {

          // Check if the channel already exists in the list of follows.
          const index: number = following.channels.indexOf(channel._id);

          UserStatisticsCommon.IncrementFollowers(channel._id, index >= 0 ? -1 : 1);

          let channels: Array<string> = [...following.channels];

          // If the channel was found we need to remove it.
          if (index >= 0) {
            channels = channels.filter((value: string) => {
              return value.toString() !== channel._id.toString();
            });

          } else {
            channels.push(channel._id);
          }

          return Follow.findOneAndUpdate({
            user: userDocument._id
          }, {
            channels: channels
          }, {
            new: true,
            upsert: false
          });
        }
      })
      .then((following: FollowDocument) => {
        // Return the updated list of followers. 
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            following: following.details
          }
        }, 200, 'User profile statistics returned successfully');

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
        
      })
      .catch((error: Error) => {
        // Define the responseObject.
        const responseObject: ResponseObject = Connect.setResponse({
            data: {
              errorCode: 'FAILED_TO_FOLLOW_CHANNEL',
              message: `We couldn't follow the user based on the handle provided`
            },
            error: error
          }, 404, `We couldn't follow the user based on the handle provided`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      });
    })
    // Retrieve the current 
    // Find the user and then follow them.
    //User.findOne({
    //})
  }
}
