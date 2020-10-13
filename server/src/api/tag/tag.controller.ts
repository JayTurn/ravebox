/**
 * tag.controller.ts
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import {
  //NextFunction,
  Request,
  Response,
  Router
} from 'express';
import Tag from './tag.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import {
  TagAssociation
} from './tag.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  TagDetails,
  TagDetailsDocument
} from './tag.interface';
import {
  ResponseObject
} from '../../models/database/connect.interface';

// Utilities.
import Keywords from '../../shared/keywords/keywords.model';

/**
 * Routing controller for tags.
 * @class TagController
 *
 * Route: /api/tag
 *
 */
export default class TagController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'tag';

    // Get the index route.
    router.get(
      path,
      TagController.getStatus
    );

    // Create a new tag.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated,
      TagController.Create
    );

    // Search for tags by name.
    router.post(
      `${path}/search/name`,
      TagController.SearchByName
    );
  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Tags are healthy!'});
  }

  /**
   * Creates a new tag.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Create(request: AuthenticatedUserRequest, response: Response): void {

    // Define the provided brand name.
    const name: string = request.body.name,
          association: TagAssociation = request.body.association;

    // Exit if we don't have a tag name provided.
    if (!name) {
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          errorCode: `TAG_NAME_NOT_PROVIDED`,
          message: `A tag name was missing from your submission`
        },
      }, 401, 'A tag name was missing from your submission');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);

      return;
    }

    // Capture the label as a lower case value to be compared with other
    // possible tags that exist.
    const label: string = name.toLowerCase();

    // Attempt to find any existing tags.
    Tag.findOne({
      labels: label,
      association: association
    })
    .lean()
    .then((tagDetails: TagDetailsDocument) => {
      let tag: TagDetailsDocument;

      // If a matching tag already exists, use that.
      if (tagDetails) {

        return tagDetails;

      } else {

        // Create and store a new tag to be associated with the product.
        tag = new Tag({
          name: name,
          labels: [label],
          partials: Keywords.CreatePartialMatches(name),
          association: association
        });
        return tag.save();
      }
    })
    .then((tagDetails: TagDetailsDocument) => {

      // Attach the tag to the response.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          tag: tagDetails.light
        }
      }, 200, 'Tag created successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'TAG_CREATION_FAILED',
            title: `Tag could not be created`
          },
          error: error
        }, 401, `Tag could not be created`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Retrieves a list of tags based on the name and association.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static SearchByName(request: Request, response: Response): void {
    const name: string = request.body.name,
          association: TagAssociation = request.body.association;

    // Exit if a value wasn't provided.
    if (!name || !association) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'TAG_NAME_NOT_PROVIDED',
            title: `A tag name was not provided for searching`
          }
        }, 404, `A tag name was not provided for searching`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Regular expression to support fuzzy matching.
    const regEx = new RegExp(name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

    Tag.find({
      partials: regEx,
      association: association
    })
    .lean()
    .then((tags: Array<TagDetails>) => {
      // Attach the product to the response.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          tags: tags
        }
      }, 200, 'Tags search successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'TAG_NAME_SEARCH_FAILED',
            title: `The search couldn't be completed`
          },
          error: error
        }, 404, `The search couldn't be completed`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }
}
