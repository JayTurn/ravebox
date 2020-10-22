/**
 * reviewStatistics.common.ts
 * Common functions performed with review statistics.
 */

// Modules.
import * as Jwt from 'jsonwebtoken';
import EnvConfig from '../../config/environment/environmentBaseConfig';

// Interfaces.
import {
  ReviewStatisticsDetails,
  ReviewStatisticsDocument
} from './reviewStatistics.interface';

/**
 * ReviewStatisticsCommon class.
 */
export default class ReviewStatisticsCommon {
  /**
   * Creates a token to allow a rating.
   *
   * @param { string } reviewId - the review id.
   */
  static GenerateRatingToken(
    reviewId: string,
    userId: string,
    duration: number
  ): string {
    return Jwt.sign({
      'reviewId': reviewId,
      'userId': userId,
      'duration': duration
    }, EnvConfig.security.secret, {
      expiresIn: '15m'
    })
  }

  /**
   * Determines if a rating is allowable.
   */
  static RatingAllowed(created: number, duration: number): boolean {
    // Define the values to evaluate the minimum duration.
    const minimumDuration = Math.floor(15),
          current: number = Math.floor(Date.now() / 1000),
          difference: number = current - created;

    let allowed = false;

    // Determine the current time as a second based value.
    if (difference > minimumDuration) {
      allowed = true;
    }
    return allowed;
  }

  /**
   * Retrieve the review statistics details from a document.
   *
   * @param { ReviewStatisticsDocument | ReviewStatisticsDetails } product - the product object.
   *
   * @return ReviewStatisticsDetails
   */
  static RetrieveDetailsFromDocument(
    reviewStatisticsDocument: ReviewStatisticsDetails | ReviewStatisticsDocument
  ): ReviewStatisticsDetails {
    if (!ReviewStatisticsCommon.isDocument(reviewStatisticsDocument)) {
      return reviewStatisticsDocument as ReviewStatisticsDetails;
    }

    return (reviewStatisticsDocument as ReviewStatisticsDocument).details;
  }

  /**
   * Checks if the review statistics is a document or details.
   */
  static isDocument(
    reviewStatistics: ReviewStatisticsDetails | ReviewStatisticsDocument
  ): reviewStatistics is ReviewStatisticsDocument {
    if ((reviewStatistics as ReviewStatisticsDocument).details) {
      return true;
    } else {
      return false;
    }
  }
}

