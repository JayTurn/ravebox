/**
 * Review.interface.tsx
 * Interfaces for the reviews.
 */

// Enumerators.
import { Recommended } from './recommendation/Recommendation.enum';

// Interfaces.
import { Product } from '../product/Product.interface';
import { PublicProfile } from '../user/User.interface';

/**
 * Review interface.
 */
export interface Review {
  _id: string;
  product?: Product;
  user?: PublicProfile;
  title: string;
  recommended: Recommended;
  videoURL?: string;
  url: string;
}

/**
 * Response from the api when requesting a review.
 */
export interface ReviewResponse {
  review: Review;
}

/**
 * Paramters used when retrieving a review from the api.
 */
export interface RetrieveReviewByIdParams {
  id: string;
}

/**
 * Paramters used when retrieving a review from the api.
 */
export interface RetrieveReviewByURLParams {
  brand: string;
  productName: string;
  reviewTitle: string;
}
