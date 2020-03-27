/**
 * review.controller.ts
 */

// Modules.
import { Request, Response, Router, NextFunction } from 'express';
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import * as S3 from 'aws-sdk/clients/s3';
import Review from './review.model';
import Video from '../../shared/video/Video.model';

// Enumerators.
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import { ProductDetailsDocument } from '../product/product.interface';
import {
  ReviewDetails,
  ReviewDocument,
  ReviewRequestBody
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

    // Retrieve a review by it's path.
    router.get(
      `${path}/view/:brand/:productName/:reviewTitle`,
      ReviewController.RetrieveByURL
    )
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
    const reviewDetails: ReviewRequestBody = request.body;

    // Create a new review from the request data.
    const newReview: ReviewDocument = new Review({
      product: reviewDetails.product,
      recommended: reviewDetails.recommended,
      published: Workflow.PUBLISHED,
      title: reviewDetails.title,
      user: request.auth._id
    });

    // Create a presigned url for uploading a video to S3.
    Video.CreatePresignedRequest(
      reviewDetails.videoTitle,
      reviewDetails.videoSize,
      reviewDetails.videoType,
      `reviews/raw/${newReview._id}`
    )
    .then((requestData: S3.PresignedPost) => {
      newReview.save()
        .then((review: ReviewDocument) => {

          // Set the response object.
          const responseObject: ResponseObject = Connect.setResponse({
            data: {
              review: review.details,
              presigned: requestData
            }
          }, 201, 'Review created successfully');

          // Return the response for the authenticated user.
          response.status(responseObject.status).json(responseObject.data);

        })
        .catch((error: Error) => {
          throw error;
        });
      })
      .catch((error: Error) => {
        // Return an error indicating the review wasn't created.
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

  /**
   * Retrieves a review and product using the url provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveByURL(request: AuthenticatedUserRequest, response: Response): void {
    const brand = request.params.brand,
          productName = request.params.productName,
          reviewTitle = request.params.reviewTitle;

    const path = `${brand}/${productName}/${reviewTitle}`;

    Review.findOne({
      url: path,
      published: Workflow.PUBLISHED
    })
    .populate({
      path: 'product',
      model: 'Product',
    })
    .populate({
      path: 'user',
      model: 'User'
    })
    .then((reviewDocument: ReviewDocument) => {
      return {
        ...reviewDocument.details,
        product: reviewDocument.product.details,
        user: reviewDocument.user.publicProfile
      };
    })
    .then((review: ReviewDetails) => {
      let responseObject: ResponseObject;

      if (!review) {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_FOUND',
            message: 'There was a problem retrieving this review'
          }
        }, 400, `The review could not be found`);

      } else {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            review: review
          }
        }, 201, 'Review returned successfully');
      }

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch(() => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'REVIEW_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this review'
        }
      }, 401, 'There was a problem retrieving the review');

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }
}
