/**
 * product.controller.ts
 * Product controller class.
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import Images from '../../shared/images/Images.model';
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
import * as S3 from 'aws-sdk/clients/s3';
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
  ProductDetailsDocument,
  ProductUpdates
} from './product.interface';
import {
  ResponseObject
} from '../../models/database/connect.interface';
import {
  ReviewDetails,
  ReviewDocument
} from '../review/review.interface';
import {
  TagDetailsDocument
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

    // Create a presigned request URL for uploading a product image.
    router.post(
      `${path}/image/request`,
      Authenticate.isAuthenticated,
      Authenticate.isAdmin,
      ProductController.CreateImageRequest
    );

    // Updates a product.
    router.post(
      `${path}/update`,
      Authenticate.isAuthenticated, 
      Authenticate.isAdmin,
      ProductController.Update
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
      .then((productDetails: ProductDetailsDocument) => {
        return productDetails.populate({
          path: 'brand',
          model: 'Brand'
        })
        .execPopulate();
      })
      .then((productDetails: ProductDetailsDocument) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            product: productDetails.details
          }
        }, 201, `Product ${productDetails._id} created successfully`);

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
   * Performs a request to POST the image metadata.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CreateImageRequest(request: AuthenticatedUserRequest, response: Response): void {
    const imageTitle: string = request.body.imageTitle,
          imageSize: string = request.body.imageSize,
          imageType: string = request.body.imageType,
          productId: string = request.body.id;

    if (!imageTitle || !imageSize || !imageType || !productId) {
      return;
    }

    // Define the path to be stored in the database.
    const storagePath = `images/products/${productId}/${imageTitle}`;

    // Create a presigned request for the new image file.
    Images.CreatePresignedImageRequest(
      imageTitle,
      imageSize,
      imageType,
      `images/products/${productId}`
    ).then((requestData: S3.PresignedPost) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          presigned: requestData,
          path: `${EnvConfig.CDN}${storagePath}`
        }
      }, 200, `${productId}: Presigned image request successful`);

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_IMAGE_NOT_SIGNED',
          message: 'There was a problem updating your product'
        },
        error: error
      }, 401, 'There was a problem updating your product');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Updates an existing product.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Update(request: AuthenticatedUserRequest, response: Response): void {

    // If we didn't receive a product object exit.
    if (!request.body.product) {

      const responseObject = Connect.setResponse({
        data: {
          errorCode: `PRODUCT_CHANGES_NOT_PROVIDED`,
          message: `Product updates weren't provided with your request`
        },
      }, 401, `Product updates weren't provided with your request`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);

      return;
    }

    // Get the id of the product we're updating.
    const id: string = request.body.product._id;

    // Get the product details from the values provided.
    const query: ProductUpdates = {
      name: request.body.product.name,
      description: request.body.product.description,
      website: request.body.product.website
    };

    // Assign the brand id if it's been provided.
    if (request.body.product.brand) {
      query.brand = Mongoose.Types.ObjectId(request.body.product.brand);
    }
    // Assign the category id if it's been provided.
    if (request.body.product.category) {
      query.category = Mongoose.Types.ObjectId(request.body.product.category);
    }

    // Assign the product images if they've been provided.
    if (request.body.product.images) {
      query.images = request.body.product.images;
    }

    // Assign the product type id if it's been provided.
    if (request.body.product.productType) {
      query.productType = Mongoose.Types.ObjectId(request.body.product.productType);
    }

    if (request.body.product.name) {
      query.namePartials = Keywords.CreatePartialMatches(request.body.product.name);
    }

    Product.findOneAndUpdate({
      _id: id
    },
    query,
    {
      new: true,
      upsert: false
    })
    .populate({
      path: 'brand',
      model: 'Brand'
    })
    .populate({
      path: 'category',
      model: 'Tag'
    })
    .populate({
      path: 'productType',
      model: 'Tag'
    })
    .then((productDetails: ProductDetailsDocument) => {
        // Attach the updated product to the response.
        const responseObject = Connect.setResponse({
          data: {
            product: productDetails.details
          }
        }, 200, 'Product updated successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_UPDATE_FAILED',
            title: `Product could not be updated`
          },
          error: error
        }, 401, `Product could not be updated`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
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
