/**
 * search.controller.ts
 */

// Modules.
import Brand from '../brand/brand.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import Product from '../product/product.model';
import {
  Request,
  Response,
  Router
} from 'express';
import ReviewCommon from '../review/review.common';
import Tag from '../tag/tag.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { ResultType } from './search.enum';
import { TagAssociation } from '../tag/tag.enum'; 

// Interfaces.
import {
  AutocompleteItem,
} from './search.interface';
import {
  BrandDetails,
  BrandDetailsDocument
} from '../brand/brand.interface';
import { CategorizedReviewGroup } from '../review/review.interface';
import {
  ProductDetails,
  ProductDetailsDocument
} from '../product/product.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  TagDetailsLight,
  TagDetailsDocument
} from '../tag/tag.interface';

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

    // Performs a complete search query.
    router.get(
      `${path}/discover/:query`,
      SearchController.Discover
    );

    // Performs a brand search.
    router.get(
      `${path}/brand/autocomplete/:query`,
      SearchController.AutocompleteBrands
    );

    // Performs a product search.
    router.get(
      `${path}/product/autocomplete/:query`,
      SearchController.AutocompleteProducts
    );

    // Performs a tag search.
    router.post(
      `${path}/tag/autocomplete/:query`,
      SearchController.AutocompleteTags
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
    .limit(8)
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

      // Return an error indicating the list of reviews weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'SEARCH_AUTOCOMPLETE_FAILED',
          message: `We experienced a problem finding search results`
        },
        error: error
      }, 404, `We experienced a problem finding search results`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Returns a list of matches based on the brand search query.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static AutocompleteBrands(request: Request, response: Response): void {
    let query: string = request.params.query;

    if (!query) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: []
        }
      }, 200, 'No results were found for your brand search');

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
    const searchResults: Array<BrandDetails> = [];

    // Begin by searching for product types, categories and brands.
    Brand.find({
      namePartials: regEx,
    })
    .limit(8)
    .then((brandDetails: Array<BrandDetailsDocument>) => {

      // If we found brands, loop through them and add them to the
      // search results array.
      if (brandDetails.length > 0) {
        let i = 0;

        do {
          const current: BrandDetails = brandDetails[i];

          searchResults.push(current.details);

          i++;
        } while (i < brandDetails.length);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: searchResults
        }
      }, 200, 'Brands successfully returned');

      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Return an error indicating the list of reviews weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'SEARCH_BRANDS_FAILED',
          message: `We experienced a problem finding search results for brands`
        },
        error: error
      }, 404, `We experienced a problem finding search results for brands`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Returns a list of matches based on the product search query.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static AutocompleteProducts(request: Request, response: Response): void {
    let query: string = request.params.query;

    if (!query) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: []
        }
      }, 200, 'No results were found for your product search');

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
    const searchResults: Array<ProductDetails> = [];

    // Begin by searching for product types, categories and brands.
    Product.find({
      namePartials: regEx,
    })
    .populate({
      path: 'brand',
      model: 'Brand'
    })
    .limit(8)
    .then((productDetails: Array<ProductDetailsDocument>) => {

      // If we found products, loop through them and add them to the
      // search results array.
      if (productDetails.length > 0) {
        let i = 0;

        do {
          const current: ProductDetailsDocument = productDetails[i];

          searchResults.push(current.details);

          i++;
        } while (i < productDetails.length);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: searchResults
        }
      }, 200, 'Products successfully returned');

      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Return an error indicating the searched products weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'SEARCH_PRODUCTS_FAILED',
          message: `We experienced a problem finding search results for products`
        },
        error: error
      }, 404, `We experienced a problem finding search results for products`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Returns a list of matches based on the tag search query.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static AutocompleteTags(request: Request, response: Response): void {
    let query: string = request.params.query;

    const association: TagAssociation = request.body.association;

    if (!query) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: []
        }
      }, 200, 'No results were found for your tag search');

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
    const searchResults: Array<TagDetailsLight> = [];

    // Begin by searching for product types, categories and brands.
    Tag.find({
      namePartials: regEx,
      association: association
    })
    .limit(8)
    .then((tagDetails: Array<TagDetailsDocument>) => {

      // If we found brands, loop through them and add them to the
      // search results array.
      if (tagDetails.length > 0) {
        let i = 0;

        do {
          const current: TagDetailsDocument = tagDetails[i];

          searchResults.push(current.light);

          i++;
        } while (i < tagDetails.length);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: searchResults
        }
      }, 200, 'Tags successfully returned');

      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Return an error indicating the tag results weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'SEARCH_TAGS_FAILED',
          message: `We experienced a problem finding search results for tags`
        },
        error: error
      }, 404, `We experienced a problem finding search results for tags`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Returns a list of complete results based on the search query.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Discover(request: Request, response: Response): void {
    let query: string = request.params.query;

    if (!query) {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          groups: [] 
        }
      }, 200, 'No results were found for your search');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Decode the query.
    query = decodeURI(query);

    // Create a regex to query search results.
    const regEx = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

    // Begin by searching for product types, categories and brands.
    Product.find({
      namePartials: regEx,
    })
    .lean()
    .then((products: Array<ProductDetails>) => {
      // If we don't have any results, exit the flow. 
      if (products.length < 0) {
        return;
      }
      return ReviewCommon.RequestAndCategorizeReviewsFromProducts(products);
    })
    .then((groups: Array<CategorizedReviewGroup>) => {

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          groups: groups 
        }
      }, 200, 'Categorized search results retrieved successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {

      // Return an error indicating the list of reviews weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'SEARCH_RESULTS_FAILED',
          message: `We experienced a problem finding search results`
        },
        error: error
      }, 404, `We experienced a problem finding search results`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);

    });
  }
}
