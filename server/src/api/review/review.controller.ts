/**
 * review.controller.ts
 */

// Modules.
import { Request, Response, Router } from 'express';
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as http from 'http';
import * as https from 'https';
import * as S3 from 'aws-sdk/clients/s3';
import Review from './review.model';
import Video from '../../shared/video/Video.model';

// Enumerators.
import { Workflow } from '../../shared/enumerators/workflow.enum';
import { SNSMessageType } from '../../shared/sns/sns.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  ReviewDetails,
  ReviewDocument,
  ReviewPublishedSNS,
  ReviewRequestBody
} from './review.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import {
  SNSConfirmation,
  SNSNotification
} from '../../shared/sns/sns.interface';
import { VideoUploadMetadata } from '../../shared/video/Video.interface';

// Import the SNS validator module to confirm the authenticity of SNS messages.
const MessageValidator = require('sns-validator');

/**
 * Routing controller for reviews.
 * @class ReviewController
 *
 * Route: /api/review
 *
 */
export default class ReviewController {

  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'review';

    // Get the index route.
    router.get(path, (req: Request, res: Response) => {
      new ReviewController().getStatus(req, res);
    });

    // Create a new review and a presigned url to upload video to S3.
    router.post(
      `${path}/create`,
      Authenticate.isAuthenticated,
      ReviewController.Create
    );

    // Create a metadata file for a review an upload to S3.
    router.post(
      `${path}/metadata`,
      Authenticate.isAuthenticated,
      ReviewController.CreateVideoMetadata
    );

    // Retrieve a review by it's path.
    router.get(
      `${path}/view/:brand/:productName/:reviewTitle`,
      ReviewController.RetrieveByURL
    );

    // Review published successfully.
    router.post(
      `${path}/published`,
      ReviewController.Published
    );
  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'data api yay!'});
  }

  /**
   * Creates a new review.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Create(request: AuthenticatedUserRequest, response: Response): void {
    // Define the provided review details.
    const reviewDetails: ReviewRequestBody = request.body;

    // Create a new review from the request data.
    const newReview: ReviewDocument = new Review({
      product: reviewDetails.product,
      recommended: reviewDetails.recommended,
      published: Workflow.PUBLISHED,
      title: reviewDetails.title,
      user: request.auth._id
    });


    Video.CreatePresignedVideoRequest(
      reviewDetails.videoTitle,
      reviewDetails.videoSize,
      reviewDetails.videoType,
      `reviews/${newReview._id}`
    ).then((requestData: S3.PresignedPost) => {

        newReview.save()
          .then((review: ReviewDocument) => {

            // Set the response object.
            const responseObject: ResponseObject = Connect.setResponse({
              data: {
                review: review.details,
                presigned: requestData
              }
            }, 201, 'Review created successfully');

            // Return the response for the authenticated user.
            response.status(responseObject.status).json(responseObject.data);

          })
          .catch((error: Error) => {
            throw error;
          });
        })
        .catch(() => {
          // Return an error indicating the review wasn't created.
          const responseObject = Connect.setResponse({
            data: {
              errorCode: 'REVIEW_NOT_CREATED',
              message: 'There was a problem creating your review'
            }
          }, 401, 'There was a problem creating your review');

          // Return the error response for the user.
          response.status(401).json(responseObject.data);
        });
  }

  /**
   * Performs a request to POST the video metadata.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CreateVideoMetadata(request: AuthenticatedUserRequest, response: Response): void {

    const videoTitle = `reviews/${request.body.reviewId}/${request.body.videoTitle}`;

    const metadata: VideoUploadMetadata = {
      srcVideo: videoTitle,
      archiveSource: true,
      frameCapture: true,
      srcBucket: 'ravebox-media-source',
      destBucket: EnvConfig.s3.video,
      reviewId: request.body.reviewId
    };

    Video.CreateMetadataFile(metadata).promise()
      .then(() => {

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            message: 'SUCCESS'
          }
        }, 201, 'Review video metadata created successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch(() => {
        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'METADATA_SUBMISSION_FAILED',
            message: 'The video review metadata failed to upload'
          }
        }, 401, 'The video review metadata file failed to upload');

        response.status(responseObject.status).json(responseObject.data);
      });
  }

  /**
   * Publishes the review based on the message provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Published(request: Request, response: Response): void {
    const validator = new MessageValidator();

    validator.validate(request.body, function(error: Error, message: SNSConfirmation | SNSNotification) {
      if (error) {
        console.log('ERROR: ', error);

        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'SNS_VALIDATION_FAILED',
            message: 'The SNS message could not be validated with AWS'
          }
        }, 401, 'The SNS message could not be validated with AWS');

        return response.status(responseObject.status).json(responseObject.data);
      }

      let publishMessage: ReviewPublishedSNS;

      // Adapt the publishing action based on the SNS type.
      switch (message.Type) {
        case SNSMessageType.NOTIFICATION:
          message = JSON.parse(request.body) as SNSNotification;

          publishMessage = JSON.parse(message.Message);

          if (publishMessage.status === 'Error') {
            console.log('Error: ', publishMessage);
            break;
          }

          Review.findOneAndUpdate({
            _id: publishMessage.reviewId
          }, {
            published: Workflow.PUBLISHED,
            videoPaths: publishMessage.videoPaths
          }, {
            new: true,
            upsert: false
          })
          .then((updatedReview: ReviewDocument) => {
            // Send a notification to the user informing them of their review
            // transitioning to a published state.
            console.log('Review status updated');
          })
          .catch((error: Error) => {
            console.log(error);
          });

          break;
        case SNSMessageType.SUBSCRIPTION:
          message = JSON.parse(request.body) as SNSConfirmation;

          https.get(message.SubscribeURL, (response: http.IncomingMessage) => {
            console.log('SUBSCRIPTION_RESPONSE: ', response);
          });
          break;
        default:

      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          message: 'SUCCESS'
        }
      }, 200, 'SNS message received successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    });

  }

  /**
   * Retrieves a review and product using the url provided.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveByURL(request: AuthenticatedUserRequest, response: Response): void {
    const brand = request.params.brand,
          productName = request.params.productName,
          reviewTitle = request.params.reviewTitle;

    const path = `${brand}/${productName}/${reviewTitle}`;

    Review.findOne({
      url: path,
      published: Workflow.PUBLISHED
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
      return {
        ...reviewDocument.details,
        product: reviewDocument.product.details,
        user: reviewDocument.user.publicProfile
      };
    })
    .then((review: ReviewDetails) => {
      let responseObject: ResponseObject;

      if (!review) {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_FOUND',
            message: 'There was a problem retrieving this review'
          }
        }, 400, `The review could not be found`);

      } else {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            review: review
          }
        }, 201, 'Review returned successfully');
      }

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch(() => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'REVIEW_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this review'
        }
      }, 401, 'There was a problem retrieving the review');

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }
}
