/**
 * product.controller.ts
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import { Request, Response, Router } from 'express';
import Product from './product.model';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  ProductDetails,
  ProductDetailsDocument
} from './product.interface';
import { ResponseObject } from '../../models/database/connect.interface';

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
    router.get(path, (req: Request, res: Response) => {
      new ProductController().getStatus(req, res);
    });

    // Create a new product.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated, 
      ProductController.Create
    );
  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
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
            product: product
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
}
