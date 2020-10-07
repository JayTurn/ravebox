/**
 * product.controller.ts
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import * as Mongoose from 'mongoose';
import {
  NextFunction,
  Request,
  Response,
  Router
} from 'express';
import Product from './product.model';
import Review from '../review/review.model';
import Tag from '../tag/tag.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { TagAssociation } from '../tag/tag.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  ProductDetails,
  ProductDetailsDocument
} from './product.interface';
import {
  ResponseObject
} from '../../models/database/connect.interface';
import {
  ReviewDetails,
  ReviewDocument
} from '../review/review.interface';
import {
  TagDetailsDocument,
  TagDetails
} from '../tag/tag.interface';

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

    // Updates a product type.
    router.post(
      `${path}/update/type`,
      Authenticate.isAuthenticated, 
      ProductController.UpdateProductType
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

    const namePartials = Keywords.CreatePartialMatches(
      request.body.name);

    // Create a new product from the request data.
    const newProduct: ProductDetailsDocument = new Product({
      name: request.body.name,
      namePartials: namePartials,
      brand: Mongoose.Types.ObjectId(request.body.brand),
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
        }, 201, `Product ${product._id} created successfully`);

        Logging.Send(LogLevel.INFO, responseObject);

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch((error: Error) => {
        // Attach the private user profile to the response.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_NOT_CREATED',
            message: 'There was a problem creating your product'
          },
          error: error
        }, 401, 'There was a problem creating your product');

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the error response for the user.
        response.status(401).json(responseObject.data);
      });
  }

  /**
   * Updates the product type.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static UpdateProductType(
    request: AuthenticatedUserRequest,
    response: Response
  ): void {
    const productId: string = request.body.id,
          tagName: string = request.body.name;

    // See if we have a tag id available to use from the request.
    const tagId: string = request.body.tagId;

    if (!tagId) {
      if (!tagName) {
        // Return an error response because we don't have a tag to associate
        // with the product type.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: `PRODUCT_TYPE_NAME_NOT_PROVIDED`,
            message: `A product type name was missing from your submission`
          },
        }, 401, 'A product type name was missing from your submission');

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the error response for the user.
        response.status(401).json(responseObject.data);

        return;
      }

      // Capture the label as a lower case value to be compared with other
      // possible tags that exist.
      const label: string = tagName.toLowerCase(); 

      Tag.findOne({
        labels: label,
        association: TagAssociation.PRODUCT
      })
      .lean()
      .then((tagDetails: TagDetailsDocument) => {
        let productTypeTag: TagDetailsDocument;

        // If a matching tag already exists, use that.
        if (tagDetails) {
          productTypeTag = tagDetails;
        } else {
          // Create and store a new tag to be associated with the product.
          productTypeTag = new Tag({
            name: tagName,
            labels: [label],
            partials: Keywords.CreatePartialMatches(tagName),
            association: TagAssociation.PRODUCT
          });
          productTypeTag.save();
        }

        // Update the product with the tag we've identified.
        Product.findOneAndUpdate({
          _id: productId
        }, {
          productType: productTypeTag._id
        }, {
          new: true,
          upsert: false
        })
        .populate({
          path: 'brand',
          model: 'Brand'
        })
        .populate({
          path: 'productType',
          model: 'Tag'
        })
        .then((productDetails: ProductDetailsDocument) => {

          // Attach the brands to the response.
          const responseObject = Connect.setResponse({
            data: {
              product: productDetails.details
            }
          }, 200, 'Product type updated successfully');

          // Return the response for the authenticated user.
          response.status(responseObject.status).json(responseObject.data);
        })
        .catch((error: Error) => {
          // Define the responseObject.
          const responseObject = Connect.setResponse({
              data: {
                errorCode: 'PRODUCT_TYPE_UPDATE_FAILED',
                title: `Product type could not be added`
              },
              error: error
            }, 401, `Product type could not be added`);

          Logging.Send(LogLevel.ERROR, responseObject);

          // Return the response.
          response.status(responseObject.status).json(responseObject.data);
        });

      })
      .catch((error: Error) => {
        // Define the responseObject.
        const responseObject = Connect.setResponse({
            data: {
              errorCode: 'PRODUCT_TYPE_UPDATE_FAILED',
              title: `Product type could not be added`
            },
            error: error
          }, 401, `Product type could not be added`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      });

    } else {

      Product.findOneAndUpdate({
        _id: productId
      }, {
        productType: Mongoose.Types.ObjectId(tagId)
      }, {
        new: true,
        upsert: false
      })
      .populate({
        path: 'brand',
        model: 'Brand'
      })
      .populate({
        path: 'productType',
        model: 'Tag'
      })
      .then((productDetails: ProductDetailsDocument) => {
        // Attach the brands to the response.
        const responseObject = Connect.setResponse({
          data: {
            product: productDetails.details
          }
        }, 200, 'Product type updated successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {
        // Define the responseObject.
        const responseObject = Connect.setResponse({
            data: {
              errorCode: 'PRODUCT_TYPE_UPDATE_FAILED',
              title: `Product type could not be added`
            },
            error: error
          }, 401, `Product type could not be added`);

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
      });
    }
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

      Logging.Send(LogLevel.WARNING, responseObject);

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
    .catch((error: Error) => {

      // Attach the error to the response.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_RETRIEVAL_FAILED',
          message: 'There was a problem retrieving the requested product'
        },
        error: error
      }, 401, 'There was a problem retrieving the product');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
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
    const name: string = request.body.name,
          brand: string = request.body.brand;

    // Exit if a value wasn't provided.
    if (!name) {
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
    const regEx = new RegExp(name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), 'gi');

    Product.find({
      namePartials: regEx,
      brand: brand
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
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_NAME_SEARCH_FAILED',
            title: `The search couldn't be completed`
          },
          error: error
        }, 404, `The search couldn't be completed`);

      Logging.Send(LogLevel.ERROR, responseObject);

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

      Logging.Send(LogLevel.WARNING, responseObject);

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

      // Return an error indicating the product wasn't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this product'
        },
        error: error
      }, 404, 'There was a problem retrieving the product');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(404).json(responseObject.data);
    });
  }

}
