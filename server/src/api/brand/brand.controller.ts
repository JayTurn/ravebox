/**
 * brand.controller.ts
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import {
  Request,
  Response,
  Router
} from 'express';
import Brand from './brand.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  BrandDetails,
  BrandDetailsDocument
} from './brand.interface';
import {
  ResponseObject
} from '../../models/database/connect.interface';

// Utilities.
import Keywords from '../../shared/keywords/keywords.model';

/**
 * Routing controller for brands.
 * @class BrandController
 *
 * Route: /api/brand
 *
 */
export default class BrandController {

  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'brand';

    // Get the index route.
    router.get(path, BrandController.getStatus);

    // Create a new brand.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated, 
      BrandController.Create
    );

    // Search for brands by name.
    router.post(
      `${path}/search/name`,
      BrandController.SearchByName
    );
  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Brands are healthy!'});
  }

  /**
   * Retrieves a list of brands based on the name provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static SearchByName(request: Request, response: Response): void {
    const query: string = request.body.name;

    // Exit if a value wasn't provided.
    if (!query) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'BRAND_NAME_NOT_PROVIDED',
            title: `A brand name was not provided for searching`
          }
        }, 404, `A brand name was not provided for searching`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Regular expression to support fuzzy matching.
    const regEx = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

    Brand.find({
      namePartials: regEx,
    })
    .lean()
    .then((brands: Array<BrandDetails>) => {
        // Attach the brands to the response.
        const responseObject = Connect.setResponse({
          data: {
            brands: brands
          }
        }, 200, 'Brands returned successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'BRAND_NAME_SEARCH_FAILED',
            title: `The search couldn't be completed`
          },
          error: error
        }, 404, `The search couldn't be completed`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Creates a new brand.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Create(request: AuthenticatedUserRequest, response: Response): void {

    // Define the provided brand name.
    const brandDetails: BrandDetails = request.body;

    // Create the brand name partial keyword matching.
    brandDetails.namePartials = Keywords.CreatePartialMatches(
      brandDetails.name);

    // Create a new product from the request data.
    const newBrand: BrandDetailsDocument = new Brand({
      ...brandDetails
    });

    // Save the new brand.
    newBrand.save()
      .then((brand: BrandDetailsDocument) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            brand: brand.details
          }
        }, 201, `Brand ${brand.name} (${brand._id}) created successfully`);

        Logging.Send(LogLevel.INFO, responseObject);

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        // Attach the private user profile to the response.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'BRAND_NOT_CREATED',
            message: 'There was a problem adding this brand'
          },
          error: error
        }, 401, 'There was a problem adding this brand');

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the error response for the user.
        response.status(401).json(responseObject.data);
      });
  }
}
