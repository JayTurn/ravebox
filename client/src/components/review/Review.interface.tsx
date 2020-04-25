/**
 * Review.interface.tsx
 * Interfaces for the reviews.
 */

// Enumerators.
import { Recommended } from './recommendation/Recommendation.enum';
import { Workflow } from './Review.enum';

// Interfaces.
import { Product } from '../product/Product.interface';
import { PublicProfile } from '../user/User.interface';

/**
 * Review interface.
 */
export interface Review {
  created: Date;
  _id: string;
  product?: Product;
  user?: PublicProfile;
  title: string;
  recommended: Recommended;
  thumbnailURL?: string;
  videoURL?: string;
  url: string;
}

/**
 * Private review interface.
 */
export interface PrivateReview extends Review {
  published: Workflow;
}

/**
 * Response from the api when requesting a review.
 */
export interface ReviewResponse {
  review: Review;
}

/**
 * Response from the api when requesting a list of reviews.
 */
export interface ReviewsResponse {
  reviews: Array<Review>;
}

/**
 * Paramters used when retrieving a review from the api.
 */
export interface RetrieveReviewByIdParams {
  id: string;
  xsrf?: string;
}

/**
 * Paramters used when retrieving a review from the api.
 */
export interface RetrieveReviewByURLParams {
  brand: string;
  productName: string;
  reviewTitle: string;
}
