/**
 * review.controller.ts
 */

// Modules.
import { Request, Response, Router } from 'express';
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import Review from './review.model';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  ReviewDetails,
  ReviewDocument
} from './review.interface';
import { ResponseObject } from '../../models/database/connect.interface';

/**
 * Routing controller for reviews.
 * @class ReviewController
 *
 * Route: /api/review
 *
 */
export default class ReviewController {

  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'review';

    // Get the index route.
    router.get(path, (req: Request, res: Response) => {
      new ReviewController().getStatus(req, res);
    });

    // Create a new review.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated, 
      ReviewController.Create
    );
  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'data api yay!'});
  }

  /**
   * Creates a new review.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Create(request: AuthenticatedUserRequest, response: Response): void {
    // Define the provided review details.
    const reviewDetails: ReviewDetails = request.body;

    // Create a new review from the request data.
    const newReview: ReviewDocument = new Review({
      ...reviewDetails,
      user: request.auth._id
    });

    // Save the new product.
    newReview.save()
      .then((review: ReviewDocument) => {
        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            review: review
          }
        }, 201, 'Review created successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch(() => {
        // Attach the private user profile to the response.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_CREATED',
            message: 'There was a problem creating your review'
          }
        }, 401, 'There was a problem creating your review');

        // Return the error response for the user.
        response.status(401).json(responseObject.data);
      });
  }
}
