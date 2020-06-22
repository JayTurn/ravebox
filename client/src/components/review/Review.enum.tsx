/**
 * Review.enum.tsx
 * Enumerators for the reviews.
 */

/**
 * Workflow state for reviews.
 */
export enum Workflow {
  UNPUBLISHED = 0,
  PUBLISHED = 1,
  DRAFT = 2
}

/**
 * Emphasis enumerator to be used for setting hierarchy.
 */
export enum ListDisplayType {
  PRODUCT = 'product'
}

/**
 * Screen context for reviews.
 */
export enum ScreenContext {
  CATEGORY_LIST = 'category list',
  CHANNEL = 'channel',
  DISCOVER = 'discover',
  FOLLOWING = 'following',
  HOME = 'home',
  MY_REVIEWS = 'my reviews',
  PRODUCT = 'product',
  PRODUCT_CATEGORY_LIST = 'product: category list',
  REVIEW_PRODUCT_LIST = 'review: product list',
  SEARCH = 'search'
}
