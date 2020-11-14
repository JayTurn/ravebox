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
import { VideoType } from './Review.enum';

// Interfaces.
import {
  AggregateReviewScore,
  Review
} from './Review.interface';
import { EventObject } from '../analytics/Analytics.interface';

// Utilities.
import { emptyProduct } from '../product/Product.common';

/**
 * Creates an empty Review object for use in object definitions.
 *
 * @return EventObject
 */
export const emptyReview: (
) => Review = (
): Review => {
  return {
    _id: '',
    created: new Date(),
    endTime: 0,
    links: [],
    product: emptyProduct(),
    recommended: Recommended.RECOMMENDED,
    sponsored: false,
    startTime: 0,
    thumbnail: '',
    title: '',
    url: '',
    videoType: VideoType.YOUTUBE
  };
}

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
    data['brand id'] = review.product.brand._id;
    data['brand name'] = review.product.brand.name;
    data['product id'] = review.product._id;
    data['product name'] = review.product.name;
    data['product type id'] = review.product.productType._id;
    data['product type'] = review.product.productType.name;

    /*
    if (review.product.categories && review.product.categories.length > 0) {
      data['product category'] = review.product.categories[0].key;

      if (review.product.categories.length > 1) {
      data['product sub-category'] = review.product.categories[1].key;
      }
    }
    */
  }

  return data;
}

/**
 * Returns an array of reviews excluding the one with the id provided.
 *
 * @param { Array<Review> } reviews - the list of reviews.
 * @param { string } id - the id of the review to exclude.
 */
export const filterReviews: (
  reviews: Array<Review>
) => (
  id: string
) => Array<Review> = (
  reviews: Array<Review>
) => (
  id: string
): Array<Review> => {
  const updatedReviews: Array<Review> = [];

  if (reviews.length <= 0) {
    return updatedReviews;
  }

  let i: number = 0;

  do {
    const current: Review = reviews[i];

    if (current._id !== id) {
      updatedReviews.push({...current});
    }
    
    i++;
  } while (i < reviews.length);

  return updatedReviews;
}

/**
 * Calculates the aggregate review score based on the reviews provided.
 *
 * @param { Array<Review> } reviews - the reviews.
 *
 * @return number
 */
export const calculateAggregateReviewScore: (
  reviews: Array<Review>
) => AggregateReviewScore = (
  reviews: Array<Review>
): AggregateReviewScore => {
  let score: AggregateReviewScore = {
    averageScore: 0,
    count: 0,
    highestAllowedRating: Recommended.RECOMMENDED,
    lowestAllowedRating: Recommended.NOT_RECOMMENDED,
    totalScore: 0,
  };

  if (reviews.length <= 0) {
    return score;
  }

  let i: number = 0;

  do {
    const current: Review = {...reviews[i]};

    score.totalScore += current.recommended;
    score.count ++;

    i++;
  } while (i < reviews.length);

  score.averageScore = score.totalScore / score.count;

  return score;
}
