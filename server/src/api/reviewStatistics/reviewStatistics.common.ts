/**
 * reviewStatistics.common.ts
 * Common functions performed with review statistics.
 */

// Modules.
import * as Jwt from 'jsonwebtoken';
import EnvConfig from '../../config/environment/environmentBaseConfig';

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
    const minimumDuration = Math.floor(duration / 2),
          current: number = Math.floor(Date.now() / 1000),
          difference: number = current - created;

    let allowed = false;

    // Determine the current time as a second based value.
    if (difference > minimumDuration) {
      allowed = true;
    }
    return allowed;
  }
}
