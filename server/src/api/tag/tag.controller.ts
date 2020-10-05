/**
 * tag.controller.ts
 */

// Modules.
//import Connect from '../../models/database/connect.model';
//import Logging from '../../shared/logging/Logging.model';
import {
  //NextFunction,
  Request,
  Response,
  Router
} from 'express';
//import Tag from './tag.model';

// Enumerators.
//import {
  //TagAssociation,
  //TagStatus
//} from './tag.enum';

// Interfaces.
//import {
  //TagDetailsDocument
//} from './tag.interface';
//import {
  //ResponseObject
//} from '../../models/database/connect.interface';

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
  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Tags are healthy!'});
  }
}
