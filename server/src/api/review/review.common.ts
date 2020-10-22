/**
 * Review.common.ts
 * Common functions performed with a review document.
 */

// Modules.
import Connect from '../../models/database/connect.model';
import Logging from '../../shared/logging/Logging.model';
import * as Mongoose from 'mongoose';
import Notifications from '../../shared/notifications/Notifications.model';
import Review from './review.model';

// Enumerators.
import {
  EmailTemplate,
  ContactList
} from '../../shared/notifications/Notifications.enum';
import { LogLevel } from '../../shared/logging/Logging.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import { Category } from '../product/product.interface';
import {
  CategorizedReviewGroup,
  ProductReviewGroup,
  ReviewDetails,
  ReviewDocument,
  ReviewGroup,
  ReviewGroupItem,
  ReviewPublishedSNS
} from './review.interface';
import {
  ProductDetails
} from '../product/product.interface';
import {
  PublicUserDetails
} from '../user/user.interface';

// Utilities.
import Formatting from '../../shared/formatting/formatting.model';

/**
 * ReviewCommon class.
 */
export default class ReviewCommon {
  /**
   * Publishes a review and sends a notification using a document id.
   *
   * @param { string } _id - the review id.
   */
  static PublishReview(publishMessage: ReviewPublishedSNS): void {

      // Retrieve the review with the product and user details populated so
      // we can send a notification email.
      Review.findOne({
        _id: publishMessage.reviewId
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
        // Perform the review update.
        reviewDocument.updateOne({
          published: Workflow.PUBLISHED,
          video: publishMessage,
          thumbnails: publishMessage.thumbNailUrl
        })
        .lean()
        .then(() => {

          // Send a notification to the user informing them of their review
          console.log('NOTIFICATION_ADD_TO_LIST');
          Notifications.AddEmailToList(
            reviewDocument.user.email,
            reviewDocument.user.handle,
            ContactList.REVIEWERS)
            .then((email: string) => {
              console.log('NOTIFICATION_SEND_EMAIL');
              Notifications.SendTransactionalEmail(
                {email: email, name: 'N/A'},
                EmailTemplate.REVIEW_PUBLISHED,
                {
                  productTitle: reviewDocument.product.name,
                  reviewLink: `${process.env.PUBLIC_CLIENT}/review/${reviewDocument.url}`,
                  reviewTitle: reviewDocument.title
                }
              );
            })
        });
      })
      .catch((error: Error) => {
        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'FAILED_TO_PUBLISH_REVIEW',
            message: 'There was a problem publishing the review'
          },
          error: error
        }, 401, `${publishMessage.reviewId} review failed to publish`);

        Logging.Send(LogLevel.ERROR, responseObject);
      });
  }

  /**
   * Notifies a user that their review failed.
   *
   * @param { string } _id - the review id.
   */
  static ProcessingFailed(publishMessage: ReviewPublishedSNS): void {

      // Retrieve the review with the product and user details populated so
      // we can send a notification email.
      Review.findOne({
        _id: publishMessage.reviewId
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

        let template: EmailTemplate = EmailTemplate.REVIEW_PROCESSING_FAILED;

        if (publishMessage.errorCode &&
            publishMessage.errorCode === 'DURATION_EXCEEDED') {
          template = EmailTemplate.REVIEW_DURATION_EXCEEDED;
        }

        Notifications.SendTransactionalEmail(
          {email: reviewDocument.user.email, name: 'N/A'},
          template,
          {
            productTitle: reviewDocument.product.name,
            reviewLink: `${process.env.PUBLIC_CLIENT}/${reviewDocument.url}`,
            reviewTitle: reviewDocument.title
          }
        );

      })
      .catch((error: Error) => {
        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'VIDEO_PROCESSING_FAILED',
            message: 'There was a problem processing the video'
          },
          error: error
        }, 401, `${publishMessage.reviewId} : Review video failed processing`);

        Logging.Send(LogLevel.ERROR, responseObject);
      });
  }

  /**
   * Formats an array of reviews into groups based on query keys.
   *
   * @param { Array<string> } queries - the list of queries provided.
   * @param { Array<ReviewDocument> } reviews - the list of reviews.
   *
   * @return ReviewGroup
   */
  static GroupReviewsByCategoryQueries(
    queries: Array<string>,
    reviews: Array<ReviewDocument>
  ): ReviewGroup {
    const reviewGroup: ReviewGroup = {};

    let i = 0;

    if (reviews.length > 0) {
      do {
        // Capture the public details for the review and the categories.
        const currentReview: ReviewDocument = reviews[i],
              categories: Array<string> = currentReview.product.categories.map(
                (category: Category) => category.key);

        // Loop through the reviews and appened it to the relevant group. 
        let j = 0;
        
        do {
          const currentQuery: string = queries[j];

          const index: number = categories.indexOf(currentQuery); 

          // If we have found a match for the category, add it to the review group.
          if (index >= 0 ) {
            if (reviewGroup[currentQuery]) {
              reviewGroup[currentQuery].push({
                ...currentReview.details,
                product: currentReview.product.details,
                user: currentReview.user.publicProfile
              });
            } else {
              reviewGroup[currentQuery] = [{
                ...currentReview.details,
                product: currentReview.product.details,
                user: currentReview.user.publicProfile
              }];
            }

            break;
          }

          j++;
        } while (j < queries.length);

        i++;
      } while (i < reviews.length);
    }

    return reviewGroup;
  }

  /**
   * Formats an array of reviews into groups based on product ids.
   *
   * @param { Array<string> } ids - the list of ids provided.
   * @param { Array<ReviewDocument> } reviews - the list of reviews.
   *
   * @return ReviewGroup
   */
  static GroupReviewsByProductIds(
    reviews: Array<ReviewDocument>
  ): ReviewGroup {
    const reviewGroup: ReviewGroup = {};

    let i = 0;

    do {

      // Capture the public details for the review and the categories.
      const currentReview: ReviewDocument = reviews[i];

      if (reviewGroup[currentReview.product._id]) {
        reviewGroup[currentReview.product._id].push({
          ...currentReview.details,
          product: currentReview.product.details,
          user: currentReview.user.publicProfile
        });
      } else {
        reviewGroup[currentReview.product._id] = [{
          ...currentReview.details,
          product: currentReview.product.details,
          user: currentReview.user.publicProfile
        }];
      }

      i++;

    } while (i < reviews.length);

    return reviewGroup;
  }

  /**
   * Requests reviews based on the product id's and categorizes results.
   *
   * @param { Array<ProductDetails> }
   *
   * @return Promise<Array<CategorizedReviewGroup>>
   */
  static RequestAndCategorizeReviewsFromProducts(
    products: Array<ProductDetails>
  ): Promise<Array<CategorizedReviewGroup>> {
    return new Promise<Array<CategorizedReviewGroup>>((resolve: Function, reject: Function) => {

      // Exit if we don't have any products.
      if (products.length <= 0) {
        return resolve([]);
      }

      // Create an array of promises to be resolved based on the array of
      // product ids provided.
      const productIds: Array<Mongoose.Types.ObjectId> = [];

      let i = 0;

      do {
        const current: ProductDetails = products[i]
        productIds.push(current._id);
        i++;
      } while (i < products.length);

      Review.find({
        product: {
          $in: productIds
        },
        published: Workflow.PUBLISHED
      })
      .populate({
        path: 'product',
        model: 'Product',
      })
      .populate({
        path: 'statistics',
        model: 'ReviewStatistic'
      })
      .populate({
        path: 'user',
        model: 'User',
        populate: {
          path: 'statistics',
          model: 'UserStatistic'
        }
      })
      .then((reviews: Array<ReviewDocument>) => {
        const reviewGroups: Array<CategorizedReviewGroup> = ReviewCommon
          .CreateCategorizedReviewGroups(reviews);

        resolve(reviewGroups);
      })
      .catch((error: Error) => {
        reject(error);
      })
    });
  }

  /**
   * Creates a categorised group of reviews.
   */
  static CreateCategorizedReviewGroups(
    reviews: Array<ReviewDocument>
  ): Array<CategorizedReviewGroup> {
    const groups: Array<CategorizedReviewGroup> = [];

    let i = 0;

    do {

      const current: ReviewDocument = reviews[i],
            product: ProductDetails = reviews[i].product.details,
            user: PublicUserDetails = reviews[i].user.publicProfile,
            category: Category = current.product.categories[0],
            subCategory: Category = current.product.categories[1];

      if (!category || !subCategory) {
        continue;
      }

      const groupIndex: number = groups.findIndex((groupItem: CategorizedReviewGroup) => {
        return groupItem.category.key === category.key;
      });

      // If we don't have a group index, this is a new category.
      if (groupIndex < 0) {
        groups.push({
          category: category,
          items: [{
            category: subCategory,
            items: [{
              product: {...product},
              reviews: [{
                ...current.details,
                product: {...product},
                user: {...user}
              }]
            }]
          }]
        });
      } else {
        // Check if we have results for the current sub-category
        const subGroupIndex: number = groups[groupIndex].items.findIndex(
          (item: ReviewGroupItem) => {
            return item.category.key === subCategory.key;
          }
        );

        // If we don't have a sub-group index, this is a new sub-category.
        if (subGroupIndex < 0) {
          groups[groupIndex].items.push({
            category: subCategory,
            items: [{
              product: {...product},
              reviews: [{
                ...current.details,
                product: {...product},
                user: {...user}
              }]
            }]
          });

        } else {

          // Check if we have results for the current product.
          const productIndex: number = groups[groupIndex].items[subGroupIndex]
            .items.findIndex((item: ProductReviewGroup) => {
              return item.product._id === current.product._id;
            });

          // If we don't have a product index this is the first review for the
          // product. Add a new product and review.
          if (productIndex < 0) {

            groups[groupIndex].items[subGroupIndex].items.push({
              product: {...product},
              reviews: [{
                ...current.details,
                product: {...product},
                user: {...user}
              }]
            });

          } else {
            // We already have a product listed so we just need to add the
            // review to the existing product in the group.
            groups[groupIndex].items[subGroupIndex].items[productIndex].reviews.push({
              ...current.details,
              product: {...product},
              user: {...user}
            });
          }
        }
      }

      i++;

    } while (i < reviews.length);

    return groups;
  }

  /**
   * Formats a list of reviews to be returned in a stream.
   *
   * @param { Array<ReviewDocument> } reviewDocuments - the list of reviews.
   *
   * @return Array<ReviewDetails>
   */
  static FormatStreamReviews(
    reviewDocuments: Array<ReviewDocument>,
    firstReviewURL?: string
  ): Array<ReviewDetails> {

    const reviews: Array<ReviewDetails> = [];

    if (reviewDocuments.length <= 0) {
      return reviews;
    }

    const firstReviewPath: string = firstReviewURL ? `${reviewDocuments[0].product.url}/firstReviewURL` : '';

    let i = 0;

    do {
      const current: ReviewDetails = {
        ...reviewDocuments[i].details,
      };

      if (current.url === firstReviewPath) {
        reviews.unshift({...current});
      } else {
        reviews.push({...current});
      }

      i++;
    } while (i < reviewDocuments.length);

    return reviews;
  }

  /**
   * Handles the updating of urls on updates.
   *
   * @param { ReviewDocument } review - the review we're updating.
   *
   * @return Promise<ReviewDocument>
   */
  static async UpdateReviewURL(
    review: ReviewDocument
  ): Promise<ReviewDocument> {

    // Create a raw title to be used for creating a URL formatted title.
    // This will be stored in the model so we can append a numeric value in the
    // URL for reviews that have similar titles.
    const titleRaw = Formatting.URLString(review.title);

    // Check if a review already exists with this url and append an
    // incremented count if it does.
    await Review.count({
      titleRaw: titleRaw
    })
    .then((count: number) => {

      // Set the url.
      if (count <= 0) {
        review.url = titleRaw;
      } else {
        review.url = `${titleRaw}_${count++}`;
      }

      // Set the raw title.
      review.titleRaw = titleRaw;
    })
    .catch((error: Error) => {

      // Return an error indicating the reviews couldn't be queried.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: `REVIEW_SAVE_FAILED_COUNT`,
          message: 'There was a problem creating the review'
        },
        error: error
      }, 401, 'There was a problem creating this review');

      Logging.Send(LogLevel.ERROR, responseObject);

    });

    return review;
  }
}
