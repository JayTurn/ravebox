/**
 * tag.controller.ts
 */

// Modules.
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
  TagAssociation,
  TagStatus
} from './tag.enum';

// Interfaces.
import {
  TagDetails,
  TagDetailsDocument
} from './tag.interface';
import {
  ResponseObject
} from '../../models/database/connect.interface';

// Utilities.
//import Keywords from '../../shared/keywords/keywords.model';

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
      const responseObject = Connect.setResponse({
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
      const responseObject = Connect.setResponse({
        data: {
          tags: tags
        }
      }, 200, 'Tags search successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
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
