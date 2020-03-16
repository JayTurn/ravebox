/**
 * product.controller.ts
 */
import { Request, Response, Router } from 'express';

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
  static Product(request: Request, response: Response) {
    // Set the response object.
    let responseObject;
  }
}
