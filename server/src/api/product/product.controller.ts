/**
 * product.controller.ts
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import { Request, Response, Router, NextFunction } from 'express';
import Product from './product.model';
//import ProductCommon from './product.common';
import Review from '../review/review.model';

// Enumerators.
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  ProductDetails,
  ProductDetailsDocument
} from './product.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ReviewDetails,
  ReviewDocument
} from '../review/review.interface';

// Utilities.
import Keywords from '../../shared/keywords/keywords.model';

/**
 * Routing controller for products.
 * @class ProductController
 *
 * Route: /api/product
 *
 */
export default class ProductController {

  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'product';

    // Get the index route.
    router.get(path, ProductController.getStatus);

    // Create a new product.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated, 
      ProductController.Create
    );

    // Retrieves a product.
    router.get(`${path}/:id`, ProductController.RetrieveById);

    // Retrieve a product by its public path.
    router.get(
      `${path}/view/:category/:subCategory/:brand/:productName`,
      ProductController.RetrieveByURL
    );

    // Search for products by name.
    router.post(
      `${path}/search/name`,
      ProductController.SearchByName
    );
  }

  /**
   * GET /
   * Index route.
   */
  static getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Products are healthy!'});
  }

  /**
   * Creates a new product.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Create(request: AuthenticatedUserRequest, response: Response): void {
    // Define the provided product details.
    const productDetails: ProductDetails = request.body;

    // Create the product name partial keyword matching list.
    productDetails.namePartials = Keywords.CreatePartialMatches(
      `${productDetails.brand} ${productDetails.name}`);

    // Create a new product from the request data.
    const newProduct: ProductDetailsDocument = new Product({
      ...productDetails,
      creator: request.auth._id
    });

    // Save the new product.
    newProduct.save()
      .then((product: ProductDetailsDocument) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            product: product.details
          }
        }, 201, 'Product created successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch(() => {
        // Attach the private user profile to the response.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_NOT_CREATED',
            message: 'There was a problem creating your product'
          }
        }, 401, 'There was a problem creating your product');

        // Return the error response for the user.
        response.status(401).json(responseObject.data);
      });
  }

  /**
   * Retrieves a product based on the id provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveById(request: Request, response: Response, next: NextFunction): void {
    // Get the id.
    const id: string = request.params.id;

    if (!id) {
      // Attach the error to the response.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_NOT_FOUND',
          message: 'There was a problem retrieving the requested product'
        }
      }, 401, 'The product could not be found');

      // Return the error response for the user.
      response.status(401).json(responseObject.data);

      next();
    }

    // We have an id so let's retrieve the product.
    Product.findOne({
      _id: id
    })
    .then((product: ProductDetailsDocument) => {
        // Attach the product to the response.
        const responseObject = Connect.setResponse({
          data: {
            product: product.details
          }
        }, 200, 'Profile returned successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
    })
    .catch(() => {

      // Attach the error to the response.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_RETRIEVAL_FAILED',
          message: 'There was a problem retrieving the requested product'
        }
      }, 401, 'There was a problem retrieving the product');

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    })
  }

  /**
   * Retrieves a list of products based on the name provided.
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
            errorCode: 'PRODUCT_NAME_NOT_PROVIDED',
            title: `A product name was not provided for searching`
          }
        }, 404, `A product name was not provided for searching`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Regular expression to support fuzzy matching.
    const regEx = new RegExp(query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

    Product.find({
      namePartials: regEx,
    })
    .lean()
    .then((products: Array<ProductDetails>) => {
        // Attach the product to the response.
        const responseObject = Connect.setResponse({
          data: {
            products: products
          }
        }, 200, 'Products search successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
    })
    .catch(() => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_NAME_SEARCH_FAILED',
            title: `The search couldn't be completed`
          }
        }, 404, `The search couldn't be completed`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * Retrieves a product and it's reviews using the url provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveByURL(request: Request, response: Response): void {
    const brand = request.params.brand,
          category = request.params.category,
          productName = request.params.productName,
          subCategory = request.params.subCategory;

    // If we don't have a product name, return an error.
    if (!productName) {
      // Set the response object.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_NAME_NOT_PROVIDED',
          message: 'There was a problem retrieving this product'
        }
      }, 404, `The product could not be found`);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Declare a variable to store the product information.
    let product: ProductDetails;

    Product.findOne({
      url: `${category}/${subCategory}/${brand}/${productName}`,
    })
    .then((productDetails: ProductDetailsDocument) => {
      if (!productDetails) {
        throw new Error('Product not found');
      }

      product = productDetails.details;

      return Review.find({
        product: product._id,
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
      });
    })
    .then((reviews: Array<ReviewDocument>) => {
      // Define an empty reviews list to be populated with reviews if they've
      // been found.
      const reviewList: Array<ReviewDetails> = [];

      // Loop through the reviews and format each item with review, product
      // and user details.
      if (reviews.length > 0) {
        // Fitler the results for each review to the details object only.

        let i = 0;

        // Create the list of reviews using the details virtual property.
        do {
          const current: ReviewDocument = reviews[i];

          if (current) {
            reviewList.push({
              ...current.details,
              product: {...current.product.details},
              user: {...current.user.publicProfile}
            });
          }

          i++
        } while (i < reviews.length);
      }

      // Return the product and reviews with the response
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          product: product,
          reviews: reviewList
        }
      }, 200, 'Reviews found');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      console.log(error);

      // Return an error indicating the product wasn't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this product'
        }
      }, 404, 'There was a problem retrieving the product');

      // Return the error response for the user.
      response.status(404).json(responseObject.data);
    });
  }

}
