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
import ReviewCommon from './review.common';
import User from '../user/user.model';
import Video from '../../shared/video/Video.model';

// Enumerators.
import { Workflow } from '../../shared/enumerators/workflow.enum';
import { SNSMessageType } from '../../shared/sns/sns.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  PrivateReviewDetails,
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
import { UserDetailsDocument } from '../user/user.interface';
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

    // Retrieve a list of reviews owned by the current logged in user.
    router.get(
      `${path}/list/user`,
      Authenticate.isAuthenticated,
      ReviewController.RetrieveListByOwner
    );

    // Retrieve a review by it's path.
    router.get(
      `${path}/list/user/:handle`,
      ReviewController.RetrieveListByHandle
    );

    // Review published successfully.
    router.post(
      `${path}/published`,
      ReviewController.Published
    );

    // Retrieve a review for editing.
    router.get(
      `${path}/edit/:id`,
      Authenticate.isAuthenticated,
      ReviewController.RetrieveForEditing
    );

    // Edit an existing review.
    router.patch(
      `${path}/edit/:id`,
      Authenticate.isAuthenticated,
      ReviewController.Update
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
      archiveSource: true,
      destBucket: EnvConfig.s3.video,
      frameCapture: true,
      reviewId: request.body.reviewId,
      srcBucket: 'ravebox-media-source',
      srcVideo: videoTitle
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

          if (publishMessage.workflowStatus === 'Error') {
            console.log('Error: ', publishMessage);

            ReviewCommon.ProcessingFailed(publishMessage);
            break;
          }

          // Publish the video and notify the user.
          ReviewCommon.PublishReview(publishMessage);

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
  static RetrieveByURL(request: Request, response: Response): void {
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
  /**
   * Retrieves a list of reviews owned by the currently logged in user.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveListByOwner(request: AuthenticatedUserRequest, response: Response): void {
    // Perform the lookup for reviews owned by the authenticated user.
    Review.find({
      user: request.auth._id,
      published: { $ne: Workflow.REMOVED }
    })
    .then((reviews: Array<ReviewDocument>) => {
      // Fitler the results for each review to the details object only.
      const reviewList: Array<PrivateReviewDetails> = [];

      let i = 0;

      // Create the list of reviews using the details virtual property.
      do {
        const current: ReviewDocument = reviews[i];

        if (current) {
          reviewList.push({...current.privateDetails});
        }

        i++
      } while (i < reviews.length);

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          reviews: reviewList
        }
      }, 200, 'Reviews found');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch(() => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'OWN_REVIEWS_NOT_FOUND',
          message: `We experienced an issue attempting to retrieve your reviews`
        }
      }, 404, `We experienced an issue attempting to retrieve your reviews`);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }

  /**
   * Retrieves a rave for editing by it's owner.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveForEditing(request: AuthenticatedUserRequest, response: Response): void {
    const id = request.params.id,
          userId = request.auth._id;

    Review.findOne({
      _id: id,
      user: userId
    })
    .populate({
      path: 'product',
      model: 'Product',
    })
    .then((reviewDocument: ReviewDocument) => {
      return {
        ...reviewDocument.details,
        product: reviewDocument.product.details
      };
    })
    .then((review: ReviewDetails) => {
      let responseObject: ResponseObject;

      if (!review) {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'EDIT_REVIEW_NOT_FOUND',
            message: 'There was a problem retrieving this review for editing'
          }
        }, 400, `The review could not be found for editing`);

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
          errorCode: 'EDIT_REVIEW_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this review for editing'
        }
      }, 401, 'There was a problem retrieving the review for editing');

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }

  /**
   * Retrieves a list of reviews based on the user's name.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveListByHandle(request: Request, response: Response): void {
    const handle: string = request.params.handle;

    if (!handle) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'USER_NOT_FOUND_FOR_REVIEWS',
            title: `We couldn't find reviews for the user you requested`
          }
        }, 403, `We couldn't find reviews for the user you requested`);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    User.findOne({
      handle: handle,
      published: Workflow.PUBLISHED
    })
    .then((user: UserDetailsDocument) => {
      return Review.find({
        user: user._id,
        published: Workflow.PUBLISHED
      });
    })
    .then((reviews: Array<ReviewDocument>) => {
      // Fitler the results for each review to the details object only.
      const reviewList: Array<ReviewDetails> = [];

      let i = 0;

      // Create the list of reviews using the details virtual property.
      do {
        const current: ReviewDocument = reviews[i];

        if (current) {
          reviewList.push({...current.details});
        }

        i++
      } while (i < reviews.length);

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          reviews: reviewList
        }
      }, 200, 'Reviews found');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch(() => {

      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'USER_REVIEWS_NOT_FOUND',
          message: `We experienced an issue retrieving reviews for the user`
        }
      }, 404, `We experienced an issue retrieving reviews for the user`);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Updates a review.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Update(request: AuthenticatedUserRequest, response: Response): void {
    const id = request.params.id,
          userId = request.auth._id,
          title = request.body.title,
          recommended = request.body.recommended,
          videoSize = request.body.videoSize,
          videoTitle = request.body.videoTitle,
          videoType = request.body.videoType;

    Review.findOneAndUpdate({
      _id: id,
      user: userId
    }, {
      title: title,
      recommended: recommended
    }, {
      new: true,
      upsert: false
    })
    .then((review: ReviewDocument) => {

      // Declare the response object.
      let responseObject: ResponseObject;

      // If we haven't submitted a new video with the request, return a success
      // response.
      if (!videoTitle) {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            review: review
          }
        }, 200, 'Review updated successfully');
        
        // Return the response for the successful update.
        response.status(responseObject.status).json(responseObject.data);
        return;
      }  

      // Create a presigned request for the new video file.
      Video.CreatePresignedVideoRequest(
        videoTitle,
        videoSize,
        videoType,
        `reviews/${review._id}`
      ).then((requestData: S3.PresignedPost) => {

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            review: review.details,
            presigned: requestData
          }
        }, 200, 'Review updated successfully');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch(() => {
        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_UPDATED',
            message: 'There was a problem updating your review'
          }
        }, 401, 'There was a problem updating your review');

        // Return the error response for the user.
        response.status(responseObject.status).json(responseObject.data);
      });
    })
    .catch(() => {

      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'EDIT_REVIEW_FAILED',
          message: 'There was a problem updating your review'
        }
      }, 403, 'There was a problem updating your review');

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }
}
