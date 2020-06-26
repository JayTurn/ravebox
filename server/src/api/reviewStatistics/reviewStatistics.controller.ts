/**
 * reviewStatistics.controller.ts
 */

// Modules.
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import * as Jwt from 'jsonwebtoken';
import Logging from '../../shared/logging/Logging.model';
import {
  Request,
  Response,
  Router } from 'express';
import ReviewStatistics from './reviewStatistics.model';
import ReviewStatisticsCommon from './reviewStatistics.common';
import UserStatisticsCommon from '../userStatistics/userStatistics.common';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { RatingOptions } from './reviewStatistics.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  ReviewIncrementQuery,
  ReviewRatings,
  ReviewStatisticsDocument
} from './reviewStatistics.interface';

/**
 * Routing controller for review statistics.
 * @class ReviewStatisticsController
 *
 * Route: /api/statistics
 *
 */
export default class ReviewStatisticsController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'statistics/review';

    // Get the index route.
    router.get(path, (req: Request, res: Response) => {
      new ReviewStatisticsController().getStatus(req, res);
    });

    // Rates a review using a previously created token.
    router.post(
      `${path}/rate/:token`,
      Authenticate.AddUserToRequest,
      UserStatisticsCommon.AttachUserStatistics,
      ReviewStatisticsController.Rate
    );

    // Creates a review rating token, allowing a user to rate content.
    router.post(
      `${path}/rate`,
      Authenticate.AddUserToRequest,
      ReviewStatisticsController.CreateRatingToken
    );

    // Retrieves the rating statistics for a review.
    router.get(
      `${path}/rating/:id`,
      Authenticate.AddUserToRequest,
      UserStatisticsCommon.AttachUserStatistics,
      ReviewStatisticsController.RetrieveReviewRatings
    );
  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Review statistics logging successfully'});
  }

  /**
   * POST /rate/:token
   * Submits a review rating.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Rate(request: AuthenticatedUserRequest, response: Response): void {
    // Capture the rating value provided.
    const rating: RatingOptions = request.body.rating as RatingOptions;

    // Decode the token so we can confirm the user has watched a sufficient
    // amount of the review.
    const decoded: string | {[key: string]: any} = Jwt.decode(request.params.token, {
      complete: true,
      json: true
    });

    if (!decoded || typeof rating === 'undefined') {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_PROVIDED_FOR_RATING',
            title: `A review id wasn't provided for the rating`
          }
        }, 404, `A review id wasn't provided for the rating`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    const id: string = decoded.payload.reviewId as string,
          duration: number = decoded.payload.duration as number,
          created: number = decoded.payload.iat as number;

    const ratingAllowed: boolean = ReviewStatisticsCommon.RatingAllowed(created, duration);

    if (!ratingAllowed || !id) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_MINIMUM_WATCH_DURATION',
            title: `You must watch a minimum duration of a rave prior to rating it`
          }
        }, 404, `You must watch a minimum duration of a rave prior to rating it`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // Create the query we're working with.
    let incrementQuery: ReviewIncrementQuery;

    let currentReview: RatingOptions | undefined;

    if (request.userStatistics) {
      currentReview = UserStatisticsCommon.RetriveReviewRating(
        id, request.userStatistics.reviews || []);
    }

    if (typeof currentReview === 'undefined') {
      if (rating === RatingOptions.HELPFUL) {
        incrementQuery = {
          $inc: {
            'ratings.up': 1
          }
        };
      } else {
        incrementQuery = {
          $inc: {
          'ratings.down': 1
          }
        };
      }
    } else {
      if (currentReview === RatingOptions.HELPFUL && rating === RatingOptions.UNHELPFUL) {
        incrementQuery = {
          $inc: {
            'ratings.down': 1,
            'ratings.up': -1
          }
        };
      }
      if (currentReview === RatingOptions.UNHELPFUL && rating === RatingOptions.HELPFUL) {
        incrementQuery = {
          $inc: {
            'ratings.up': 1,
            'ratings.down': -1
          }
        };
      }
    }

    // Update the user's rating.
    UserStatisticsCommon.AddReviewRating(id, rating, request.userStatistics);

    // Add the rating.
    ReviewStatistics.findOneAndUpdate({
      review: id,
    },
    incrementQuery,
    { new: true, upsert: true})
    .then((statistics: ReviewStatisticsDocument) => {
      // Return the updated statistics.
      
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          results: {
            ...statistics.ratings,
            userRating: rating
          }
        }
      }, 200, `Review ratings returned successfully`);

      // Return the response.
      response.json(responseObject.data);
    })
    .catch((error: Error) => {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_RATED',
            title: `We couldn't add your rating for this review`
          },
          error: error
        }, 404, `${(request.user) ? request.user.handle : ''} rated ${id} unsucessfully`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * POST /rate/
   * Creates a token for the user to submit with a review.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CreateRatingToken(request: AuthenticatedUserRequest, response: Response): void {
    const reviewId: string = request.body.reviewId,
          userId: string = request.auth ? request.auth._id : 'anonymous',
          duration: number = request.body.duration;

    const token: string = ReviewStatisticsCommon.GenerateRatingToken(
      reviewId, userId, duration);

    ReviewStatistics.findOneAndUpdate({
      review: reviewId
    }, {
      $inc: { views: 1}
    }, {
      new: true, upsert: true
    })
    .then(() => {
      // If we have a user, increment their watch statistics.
      if (request.auth) {
        UserStatisticsCommon.AddReviewWatchEvent(reviewId, userId);
      }

      // Set the response object.
      const responseObject = Connect.setResponse({
        data: {
          token: token
        }
      }, 200, 'Review rating token created');

      // Return the response for the successful update.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_CREATE_RATING_TOKEN',
            title: `We couldn't add your rating for this review`
          },
          error: error
        }, 404, `Failed to create a rating token for ${reviewId}`);

      Logging.Send(LogLevel.ERROR, responseObject);

      response.status(responseObject.status).json(responseObject.data);
    })
  }

  /**
   * GET /rating/:id
   * Gets the ratings for a review based on the id provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveReviewRatings(request: AuthenticatedUserRequest, response: Response): void {
    const reviewId: string = request.params.id;

    if (!reviewId) {
      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'RATINGS_NOT_FOUND_FOR_REVIEW',
            title: `No ratings have been provided for this review`
          }
        }, 200, `No ratings have been provided for this review`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    }

    ReviewStatistics.findOne({
      review: reviewId
    })
    .then((statistics: ReviewStatisticsDocument) => {
      let responseObject: ResponseObject;

      if (!statistics) {
        // Define the responseObject.
        responseObject = Connect.setResponse({
            data: {
              errorCode: 'RATINGS_NOT_FOUND_FOR_REVIEW',
              title: `No ratings have been provided for this review`
            }
          }, 200, `No ratings have been provided for this review`);

        // Return the response.
        response.status(responseObject.status).json(responseObject.data);
        return;
      }

      const ratings: ReviewRatings = {...statistics.ratings};

      if (request.userStatistics) {
        const userRating: RatingOptions | undefined = UserStatisticsCommon.RetriveReviewRating(reviewId, request.userStatistics.reviews || []);

        if (typeof userRating !== 'undefined') {
          ratings.userRating = userRating;
        }
      }

      responseObject = Connect.setResponse({
        data: {
          results: ratings
        }
      }, 200, `Review ratings returned successfully`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Define the responseObject.
      const responseObject: ResponseObject = Connect.setResponse({
          data: {
            errorCode: 'RATINGS_NOT_FOUND_FOR_REVIEW',
            title: `No ratings have been provided for this review`
          },
          error: error
        }, 404, `No ratings have been provided for this review`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

    });
  }
}
