/**
 * Review.common.ts
 * Common functions performed with a review document.
 */

// Modules.
import Notifications from '../../shared/notifications/Notifications.model';
import Review from './review.model';

// Enumerators.
import {
  EmailTemplate,
  ContactList
} from '../../shared/notifications/Notifications.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';

// Interfaces.
import { Category } from '../product/product.interface';
import {
  ReviewDetails,
  ReviewDocument,
  ReviewGroup,
  ReviewPublishedSNS
} from './review.interface';

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
          Notifications.AddEmailToList(
            reviewDocument.user.email,
            reviewDocument.user.handle,
            ContactList.REVIEWERS)
            .then((email: string) => {
              Notifications.SendTransactionalEmail(
                {email: email, name: 'N/A'},
                EmailTemplate.REVIEW_PUBLISHED,
                {
                  productTitle: reviewDocument.product.name,
                  reviewLink: `${process.env.PUBLIC_CLIENT}/${reviewDocument.url}`,
                  reviewTitle: reviewDocument.title
                }
              );
            })
        });
      })
      .catch((error: Error) => {
        console.log(error);
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
        console.log(error);
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

    do {
      // Capture the public details for the review and the categories.
      const currentReview: ReviewDetails = {...reviews[i].details},
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
            reviewGroup[currentQuery].push({...currentReview});
          } else {
            reviewGroup[currentQuery] = [{...currentReview}];
          }

          break;
        }

        j++;
      } while (j < queries.length);

      i++;
    } while (i < reviews.length);

    return reviewGroup;
  }

  /**
   * Captures all of the expected thumbnail images.
   *
   * @param { Array<string> } thumbnails - the list of thumbnail images.
   */
  /*
  static captureThumbnails(thumbnails: Array<string>): Array<string> {
    if (!thumbnails || thumbnails.length === 0) {
      return thumbnails;
    }

    const latest: string = thumbnails[0],
          items: Array<string> = [];

    // Get the thumbnail pattern.
    const compartments: Array<string> = latest.split('.'),
          filename: string = latest.substr(0, latest.lastIndexOf('.') - 1),
          imageNumberText = compartments[compartments.length - 2],
          characterCount = imageNumberText.length;

    const imageNumber = +imageNumberText;

    let i = 0;

    do {
      items.push(`${filename}.`);
      i++;
    } while { i < imageNumber }
  }
  */
}
