/**
 * Review.common.tsx
 * Common functions for reviews.
 */

// Enumerators.
import {
  Recommended
} from './recommendation/Recommendation.enum';
import {
  ScreenContext
} from './Review.enum';

// Interfaces.
import { Review } from './Review.interface';
import { EventObject } from '../analytics/Analytics.interface';

/**
 * Formats a review for tracking an event.
 *
 * @param { Review } review - the review object.
 *
 * @return EventObject
 */
export const formatReviewForTracking: (
  context: ScreenContext
) => (
  review: Review
) => EventObject = (
  context: ScreenContext
) => (
  review: Review
): EventObject => {
  // Format the review data.
  const data: EventObject = formatReviewProperties(review);
  
  // Append the context data.
  data['context'] = context;

  return data;
}

/**
 * Formats the review properties.
 *
 * @param { Review } review - the review to be formatted.
 *
 * @return EventObject
 */
export const formatReviewProperties: (
  review: Review
) => EventObject = (
  review: Review
): EventObject => {
  const data: EventObject = {
    'product recommended': review.recommended === Recommended.RECOMMENDED,
    'review id': review._id,
    'review title': review.title,
    'sponsored review': review.sponsored,
  };

  if (review.user) {
    data['reviewer id'] = review.user._id;
    data['reviewer handle'] = review.user.handle;
  }

  if (review.product) {
    data['brand name'] = review.product.brand;
    data['product id'] = review.product._id;
    data['product name'] = review.product.name;

    if (review.product.categories && review.product.categories.length > 0) {
      data['product category'] = review.product.categories[0].key;

      if (review.product.categories.length > 1) {
      data['product sub-category'] = review.product.categories[1].key;
      }
    }
  }

  return data;
}
