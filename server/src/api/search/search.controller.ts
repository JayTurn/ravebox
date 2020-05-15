/**
 * search.controller.ts
 */

// Modules.
import Connect from '../../models/database/connect.model';
import {
  Request,
  Response,
  Router
} from 'express';
import Product from '../product/product.model';

// Enumerators.
import { ResultType } from './search.enum';

// Interfaces.
import {
  AutocompleteItem
} from './search.interface';
import { ProductDetails } from '../product/product.interface';
import { ResponseObject } from '../../models/database/connect.interface';

/**
 * Routing controller for search.
 * @class SearchController
 *
 * Route: /api/search
 *
 */
export default class SearchController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'search';

    // Get the index route.
    router.get(path, (req: Request, res: Response) => {
      new SearchController().getStatus(req, res);
    });

    // Performs an autocomplete search.
    router.get(
      `${path}/autocomplete/:query`,
      SearchController.Autocomplete
    );
  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Search api healthy'});
  }

  /**
   * Returns a list of matches based on the search query.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Autocomplete(request: Request, response: Response): void {
    let query: string = request.params.query;

    if (!query) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: []
        }
      }, 200, 'No results were found for your search');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Decode the query.
    query = decodeURI(query);

    // As a poor person's search, let's just use regex for now and replace it
    // with elastic at some point in the future.
    const regEx = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

    // Define an autocomplete results array.
    const searchResults: Array<AutocompleteItem> = [];

    // Begin by searching for product types, categories and brands.
    Product.find({
      namePartials: regEx,
    })
    .lean()
    .then((products: Array<ProductDetails>) => {
      // If we found products, loop through them and add them to the
      // autocomplete search results array.
      if (products.length > 0) {
        let i = 0;

        do {
          const current: ProductDetails = products[i];

          searchResults.push({
            id: current._id,
            resultType: ResultType.PRODUCT,
            title: `${current.brand} ${current.name}`,
            url: current.url
          });

          i++;
        } while (i < products.length);
      }

      return Product.find({
        brand: regEx
      })
      .lean();
    })
    .then((products: Array<ProductDetails>) => {
      // If we found products, loop through them and add them to the
      // autocomplete search results array.
      if (products.length > 0) {
        let i = 0;

        do {
          const current: ProductDetails = products[i];

          searchResults.push({
            id: current._id,
            resultType: ResultType.BRAND,
            title: `${current.brand}`
          });

          i++;
        } while (i < products.length);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: searchResults 
        }
      }, 200, 'No results were found for your search');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      console.log(error);

      // Return an error indicating the list of reviews weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'SEARCH_AUTOCOMPLETE_FAILED',
          message: `We experienced a problem finding search results`
        }
      }, 404, `We experienced a problem finding search results`);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);

    });
  }
}
