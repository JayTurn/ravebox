/**
 * userStatistics.common.ts
 * Common functions performed with user statistics.
 */

// Modules.
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import {
  NextFunction,
  Response
} from 'express';
import UserStatistics from './userStatistics.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { RatingOptions } from '../reviewStatistics/reviewStatistics.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  Reviewed,
  UserStatisticsDocument
} from './userStatistics.interface';

/**
 * UserStatisticsCommon class.
 */
export default class UserStatisticsCommon {
  /**
   * Increments the viewing statistics for a review.
   */
  static AddReviewWatchEvent(
    reviewId: string,
    userId: string
  ): void {
    // Load the reviews.
    UserStatistics.findOne({
      user: userId
    })
    .then((statistics: UserStatisticsDocument) => {
      let reviews: Array<Reviewed> = [];
      if (statistics) {
        // Loop through the stastics array and update it.
        reviews = UserStatisticsCommon.IncrementReviewWatch(
          statistics.reviews || [], reviewId);
      } else {
        reviews.push({
          review: reviewId,
          watchCount: 1,
          watchSeconds: 0,
          watchPercentage: 0
        });
      }

      // Update the user's statistics with the new review data.
      UserStatistics.findOneAndUpdate({
        user: userId
      }, {
        reviews: reviews
      }, {
        new: true, upsert: true
      })
      .then(() => {
        return;
      })
      .catch((error: Error) => {
        throw error;
      });
    })
    .catch((error: Error) => {
      // Attach the private user profile to the response.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_TO_ADD_WATCH_EVENT',
          message: 'There was a problem registering the watch event'
        },
        error: error
      }, 401, 'There was a problem registering the watch event');

      Logging.Send(LogLevel.ERROR, responseObject);
    });
  }

  /**
   * Increments the follower count.
   *
   * @param { string } userId - the id of the user statistic to increment.
   * @param { number } value - the number to be incremented.
   */
  static IncrementFollowers(userId: string, value: number): void {
    UserStatistics.findOne({
      user: userId
    })
    .then((statistics: UserStatisticsDocument) => {
      let query;
      if (statistics.followers) {

        query = {
          $inc: {
            followers: value
          }
        };
      } else {
        query = {
          followers: 1
        }
      }

      UserStatistics.findOneAndUpdate({
        user: userId
      }, query, {
        upsert: true
      })
      .catch((error: Error) => {
        throw error;
      });
    })
    .catch((error: Error) => {
      // Log the error for updating the user's statistics.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_TO_INCREMENT_FOLLOW_COUNT',
          message: `We couldn't increment the follower count`
        },
        error: error
      }, 401, `Failed to increment the follower count`);

      Logging.Send(LogLevel.ERROR, responseObject);
    });
  }

  /**
   * Adds a review rating.
   *
   * @param { string } reviewId - the id of the review to be rated.
   * @param { RatingOptions } rating - the rating given to the review.
   * @param { UserStatisticsDocument } statistics - the current user statistics.
   */
  static AddReviewRating(
    reviewId: string,
    rating: RatingOptions,
    statistics: UserStatisticsDocument
  ): void {

    // Update the user's rating with the new value.
    UserStatistics.updateOne({
      user: statistics.user,
      'reviews.review': reviewId
    }, {
      $set: {
        'reviews.$.rating': rating
      }
    }, { new: true, upsert: true })
    .catch((error: Error) => {
      // Attach the private user profile to the response.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'FAILED_TO_ADD_RATING',
          message: `We couldn't add the review rating`
        },
        error: error
      }, 401, `Failed to add the review rating`);

      Logging.Send(LogLevel.ERROR, responseObject);
    });
  }

  /**
   * Updates the review array with new view data.
   *
   * @param { Array<ReviewStatistics> } statistics - the review statistics.
   * @param { string } reviewId - the id of the review.
   *
   * @return Array<ReviewStatistics>
   */
  static IncrementReviewWatch(
    reviews: Array<Reviewed>,
    reviewId: string
  ): Array<Reviewed> {
    const updated: Array<Reviewed> = [...reviews];

    let exists = false,
        i = 0;

    do {
      const current: Reviewed = {...updated[i]};

      if (current.review === reviewId) {
        updated[i].watchCount += 1;

        exists = true;
      }

      i++;

    } while(i < reviews.length);

    // If the current review wasn't found, increment the reviews list with the
    // new id.
    if (!exists) {
      updated.push({
        review: reviewId,
        watchCount: 1,
        watchPercentage: 0,
        watchSeconds: 0
      });
    }

    return updated;
  }

  /**
   * Returns the current review values if they exist.
   *
   * @param { string } reviewId - the id of the review we're looking for.
   * @param { Array<Reviewed> } reviews - the user reviews.
   *
   * @return RationOptions | undefined
   */
  static RetriveReview(
    reviewId: string,
    reviews: Array<Reviewed>
  ): Reviewed | undefined {
    // Loop through the list of reviews and return the current rating option
    // if it's found.
    let i = 0;

    do {
      const current: Reviewed = {...reviews[i]};

      // We've found an existing review.
      if (current.review === reviewId) {
        return current;
      }

      i++;
    } while (i < reviews.length);

    return;
  }

  /**
   * Returns the rating for a review if it exists.
   *
   * @param { string } reviewId - the id of the review we're looking for.
   * @param { Array<Reviewed> } reviews - the user reviews.
   *
   * @return RationOptions | undefined
   */
  static RetriveReviewRating(
    reviewId: string,
    reviews: Array<Reviewed>
  ): RatingOptions | undefined {
    // Loop through the list of reviews and return the current rating option
    // if it's found.
    let i = 0;

    do {
      const current: Reviewed = {...reviews[i]};

      // We've found an existing review.
      if (current.review === reviewId) {
        return current.rating;
      }

      i++;
    } while (i < reviews.length);

    return;
  }

  /**
   * Attaches a user's statistics to the request if they are authenticated.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static AttachUserStatistics(
    request: AuthenticatedUserRequest,
    response: Response,
    next: NextFunction
  ): void {
    const userId: string = request.auth ? request.auth._id : '';

    if (!request.auth) {
      return next();
    } else {
      UserStatistics.findOne({
        user: userId
      })
      .then((statistics: UserStatisticsDocument) => {
        if (!statistics) {
          next();
        } else {
          request.userStatistics = statistics;
          next();
        }
      })
    }
  }
}
