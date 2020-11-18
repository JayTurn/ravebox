/**
 * review.controller.ts
 */

// Modules.
import { Request, Response, Router } from 'express';
import Authenticate from '../../models/authentication/authenticate.model';
import Connect from '../../models/database/connect.model';
import { DocumentQuery } from 'mongoose';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as http from 'http';
import * as https from 'https';
import Images from '../../shared/images/Images.model';
import Logging from '../../shared/logging/Logging.model';
import Product from '../product/product.model';
import Review from './review.model';
import ReviewCommon from './review.common';
import ReviewStatistics from '../reviewStatistics/reviewStatistics.model';
import * as S3 from 'aws-sdk/clients/s3';
import User from '../user/user.model';
import UserStatisticsCommon from '../userStatistics/userStatistics.common';
import Video from '../../shared/video/Video.model';

// Enumerators.
import { LogLevel } from '../../shared/logging/Logging.enum';
import { SNSMessageType } from '../../shared/sns/sns.enum';
import { Workflow } from '../../shared/enumerators/workflow.enum';
import { VideoType } from './review.enum';

// Interfaces.
import {
  AuthenticatedUserRequest
} from '../../models/authentication/authentication.interface';
import {
  ProductDocument
} from '../product/product.interface';
import {
  PrivateReviewDetails,
  ReviewDetails,
  ReviewDocument,
  ReviewGroup,
  ReviewPublishedSNS,
  ReviewRequestBody
} from './review.interface';
import { ResponseObject } from '../../models/database/connect.interface';
import { ReviewStatisticsDocument } from '../reviewStatistics/reviewStatistics.interface';
import {
  SNSConfirmation,
  SNSNotification
} from '../../shared/sns/sns.interface';
import { UserDocument } from '../user/user.interface';
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

    // Create a presigned request URL for uploading a profile image.
    router.post(
      `${path}/image/request`,
      Authenticate.isAuthenticated,
      ReviewController.CreateImageRequest
    );

    // Retrieve a list of reviews from the same product.
    router.post(
      `${path}/list/category`,
      ReviewController.RetrieveListsByCategories
    );

    // Retrieve a list of reviews from the same product.
    router.post(
      `${path}/list/product`,
      ReviewController.RetrieveListByProductIds
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


    // Create a metadata file for a review an upload to S3.
    router.post(
      `${path}/metadata`,
      Authenticate.isAuthenticated,
      ReviewController.CreateVideoMetadata
    );

    // Review published successfully.
    router.post(
      `${path}/published`,
      ReviewController.Published
    );

    // Delete an existing review.
    router.delete(
      `${path}/remove/:id`,
      Authenticate.isAuthenticated,
      ReviewController.Remove
    );

    // Retrieve a review by it's path.
    router.get(
      `${path}/view/:brand/:productName/:reviewTitle`,
      ReviewController.RetrieveByURL
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

    // Create a review stastics document to be cross-referenced with the
    // review document.
    const newReviewStatistics: ReviewStatisticsDocument = new ReviewStatistics({
      score: reviewDetails.videoType === VideoType.YOUTUBE ? 0 : 50
    });

    // Create a new review from the request data.
    const newReview: ReviewDocument = new Review({
      description: reviewDetails.description,
      links: reviewDetails.links,
      product: reviewDetails.product,
      published: Workflow.DRAFT,
      recommended: reviewDetails.recommended,
      sponsored: reviewDetails.sponsored,
      statistics: newReviewStatistics._id,
      title: reviewDetails.title,
      thumbnail: reviewDetails.thumbnail,
      user: request.auth._id,
      videoType: reviewDetails.videoType
    });

    // Update the review statistics with the new review id.
    newReviewStatistics.review = newReview._id;

    if (reviewDetails.videoType === VideoType.YOUTUBE) {

      // Publish the review immediately.
      newReview.published = Workflow.PUBLISHED;

      // Add the YouTube video details to the review and save it.
      newReview.youtube = {
        endTime: reviewDetails.endTime,
        startTime: reviewDetails.startTime,
        url: reviewDetails.videoURL
      };

      newReview.save()
        .then((review: ReviewDocument) => {
          // Save the statistics object now that we have a review.
          newReviewStatistics.save();

            // Increment the raves count in the user statistics.
            UserStatisticsCommon.IncrementRavesCount(request.auth._id, 1);

            // Set the response object.
            const responseObject: ResponseObject = Connect.setResponse({
              data: {
                review: review.details
              }
            }, 201, `Review ${review._id} created successfully`);

            Logging.Send(LogLevel.INFO, responseObject);

            // Return the response for the authenticated user.
            response.status(responseObject.status).json(responseObject.data);

        })
        .catch((error: Error) => {
          // Return an error indicating the review wasn't created.
          const responseObject = Connect.setResponse({
            data: {
              errorCode: 'REVIEW_NOT_CREATED',
              message: 'There was a problem creating your review'
            },
            error: error
          }, 401, 'There was a problem creating your review');

          Logging.Send(LogLevel.ERROR, responseObject);

          // Return the error response for the user.
          response.status(401).json(responseObject.data);
        });
    } else {

      Video.CreatePresignedVideoRequest(
        reviewDetails.videoTitle,
        reviewDetails.videoSize,
        reviewDetails.videoFileType,
        `reviews/${newReview._id}`
      ).then((requestData: S3.PresignedPost) => {

          newReview.save()
            .then((review: ReviewDocument) => {

              // Save the statistics object now that we have a review.
              newReviewStatistics.save();

              // Increment the raves count in the user statistics.
              UserStatisticsCommon.IncrementRavesCount(request.auth._id, 1);

              // Set the response object.
              const responseObject: ResponseObject = Connect.setResponse({
                data: {
                  review: review.details,
                  presigned: requestData
                }
              }, 201, `Review ${review._id} created successfully`);

              Logging.Send(LogLevel.INFO, responseObject);

              // Return the response for the authenticated user.
              response.status(responseObject.status).json(responseObject.data);

            })
            .catch((error: Error) => {
              throw error;
            });
          })
          .catch((error: Error) => {
            // Return an error indicating the review wasn't created.
            const responseObject = Connect.setResponse({
              data: {
                errorCode: 'REVIEW_NOT_CREATED',
                message: 'There was a problem creating your review'
              },
              error: error
            }, 401, 'There was a problem creating your review');

            Logging.Send(LogLevel.ERROR, responseObject);

            // Return the error response for the user.
            response.status(401).json(responseObject.data);
          });
    }
  }

  /**
   * Performs a request to POST the image metadata.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static CreateImageRequest(request: AuthenticatedUserRequest, response: Response): void {
    const imageTitle: string = request.body.imageTitle,
          imageSize: string = request.body.imageSize,
          imageType: string = request.body.imageType,
          reviewId: string = request.body.id;

    if (!imageTitle || !imageSize || !imageType || !reviewId) {
      return;
    }

    // Define the path to be stored in the database.
    const storagePath = `images/reviews/${reviewId}/${imageTitle}`;

    // Create a presigned request for the new image file.
    Images.CreatePresignedImageRequest(
      imageTitle,
      imageSize,
      imageType,
      `images/reviews/${reviewId}`
    ).then((requestData: S3.PresignedPost) => {
      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          presigned: requestData,
          path: `${EnvConfig.CDN}${storagePath}`
        }
      }, 200, `${reviewId}: Presigned image request successful`);

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);

    })
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'REVIEW_NOT_UPDATED',
          message: 'There was a problem updating your review'
        },
        error: error
      }, 401, 'There was a problem updating your review');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
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
      environment: process.env.ENVIRONMENT,
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
      .catch((error: Error) => {
        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'METADATA_SUBMISSION_FAILED',
            message: 'The video review metadata failed to upload'
          },
          error: error
        }, 401, 'The video review metadata file failed to upload');

        Logging.Send(LogLevel.ERROR, responseObject);

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
          },
          error: error
        }, 401, 'The SNS message could not be validated with AWS');

        Logging.Send(LogLevel.ERROR, responseObject);

        return response.status(responseObject.status).json(responseObject.data);
      }

      let publishMessage: ReviewPublishedSNS;

      // Adapt the publishing action based on the SNS type.
      switch (message.Type) {
        case SNSMessageType.NOTIFICATION:
          message = JSON.parse(request.body) as SNSNotification;

          publishMessage = JSON.parse(message.Message);

          if (publishMessage.workflowStatus === 'Error') {
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
    const reviewTitle: string = request.params.reviewTitle;

    Review.findOne({
      url: reviewTitle,
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
    .then((reviewDocument: ReviewDocument) => {
      const details: ReviewDetails = {
        ...reviewDocument.details,
        product: reviewDocument.product.details,
        user: reviewDocument.user.publicProfile,
      }

      if (reviewDocument.statistics) {
        details.statistics = reviewDocument.statistics.details;
      }

      return details;
    })
    .then((review: ReviewDetails) => {
      let responseObject: ResponseObject;

      if (!review) {

        // Set the response object.
        responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_FOUND',
            message: 'There was a problem retrieving this review'
          },
        }, 404, `${reviewTitle} review not found`);

        Logging.Send(LogLevel.WARNING, responseObject);

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
        
        return;
      }

      // Set the response object.
      responseObject = Connect.setResponse({
        data: {
          review: review
        }
      }, 201, 'Review returned successfully');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'REVIEW_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this review'
        },
        error: error
      }, 401, 'There was a problem retrieving the review');

      Logging.Send(LogLevel.ERROR, responseObject);

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
    .sort({'created': -1})
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
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'OWN_REVIEWS_NOT_FOUND',
          message: `We experienced an issue attempting to retrieve your reviews`
        },
        error: error
      }, 404, `We experienced an issue attempting to retrieve your reviews`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
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
      populate: [{
        path: 'brand',
        model: 'Brand'
      }, {
        path: 'productType',
        model: 'Tag'
      }]
    })
    .populate({
      path: 'statistics',
      model: 'ReviewStatistic' 
    })
    .populate({
      path: 'user',
      model: 'User',
      populate: [{
        path: 'statistics',
        model: 'UserStatistic'
      }]
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
        }, 404, `The review could not be found for editing`);

        Logging.Send(LogLevel.WARNING, responseObject);

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
    .catch((error: Error) => {
      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'EDIT_REVIEW_RETRIEVAL_ERROR',
          message: 'There was a problem retrieving this review for editing'
        },
        error: error
      }, 401, 'There was a problem retrieving the review for editing');

      Logging.Send(LogLevel.WARNING, responseObject);

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

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    User.findOne({
      handle: handle,
      published: Workflow.PUBLISHED
    })
    .then((user: UserDocument) => {
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
    .catch((error: Error) => {

      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'USER_REVIEWS_NOT_FOUND',
          message: `We experienced an issue retrieving reviews for the user`
        },
        error: error
      }, 404, `We experienced an issue retrieving reviews for the user`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Retrieves a list of reviews based on the product id.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveListByProductIds(request: Request, response: Response): void {
    const queries: Array<string> = request.body.queries;

    if (!queries || queries.length === 0) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'PRODUCT_ID_NOT_PROVIDED_FOR_REVIEWS',
            title: `The product id is missing from the request`
          }
        }, 404, `The product id is missing from the request`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    Review.find({
      product: {
        $in: queries
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
      model: 'User'
    })
    .populate({
      path: 'user.userStatistics',
      model: 'UserStatistic'
    })
    .then((reviews: Array<ReviewDocument>) => {

      // Sort the results randomly.
      const sortedDocuments: Array<ReviewDocument> = [],
            tempReviews: Array<ReviewDocument> = [...reviews];

      for (let i = reviews.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp: ReviewDocument = tempReviews[i];
        sortedDocuments[i] = tempReviews[j];
        tempReviews[j] = temp;
      }

      // Declare a reviews list to be returned with the response.
      let reviewGroups: ReviewGroup;

      if (sortedDocuments.length > 0) {
        reviewGroups = ReviewCommon.GroupReviewsByProductIds(
          sortedDocuments);
      }

      // Set the response object.
      const responseObject: ResponseObject = Connect.setResponse({
        data: {
          reviews: reviewGroups
        }
      }, 200, 'Reviews found');

      // Return the response for the authenticated user.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Return an error indicating the list of reviews weren't found.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'PRODUCT_REVIEWS_NOT_FOUND',
          message: `We experienced an issue retrieving reviews for the requested product`
        },
        error: error
      }, 404, `We experienced an issue retrieving reviews for the requested product`);

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(responseObject.status).json(responseObject.data);
    });
  }

  /**
   * Retrieves a list of reviews based on the category label.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static RetrieveListsByCategories(request: Request, response: Response): void {
    const queries: Array<string> = request.body.queries,
          ignoreIds: Array<string> = request.body.ignore || [];

    if (!queries || queries.length === 0) {
      // Define the responseObject.
      const responseObject = Connect.setResponse({
          data: {
            errorCode: 'CATEGORY_LABELS_NOT_PROVIDED_FOR_REVIEWS',
            title: `The category labels are missing from the request`
          }
        }, 404, `The category labels are missing from the request`);

      Logging.Send(LogLevel.WARNING, responseObject);

      // Return the response.
      response.status(responseObject.status).json(responseObject.data);

      return;
    }

    // We're creating a promise for each query so we can limit each query
    // to a maximum number of results. We can't do this if we perform a single
    // lookup with all of the queries in a single array.
    const productPromises: Array<Promise<DocumentQuery<Array<ReviewDocument | null>, ReviewDocument> & any>> = [];

    let i = 0;

    do {
      const current: string = queries[i];

      let query;

      // If we should ignore any ids, make sure they are set in the query.
      if (ignoreIds.length > 0) {
        query = {
          _id: {
            $ne: ignoreIds
          },
          'categories.key': current
        };
      } else {
        query = {
          'categories.key': current
        };
      }

      productPromises.push(Product.find(query)
        .then((products: Array<ProductDocument>) => {

          // Collect all of the product id's matching the category.
          const productIdList: Array<string> = products.map((item: ProductDocument) => item._id);

          return Review.find({
            product: {
              $in: productIdList,
            },
            published: Workflow.PUBLISHED
          })
          .sort({'created': -1})
          .limit(8)
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
            return reviews;
          });
        })
        .catch((error: Error) => {
          // Define the responseObject.
          const responseObject = Connect.setResponse({
              data: {
                errorCode: 'FAILED_TO_RETRIEVE_REVIEWS_BY_CATEGORY',
                title: `The category labels are missing from the request`
              },
              error: error
            }, 404, `The category labels are missing from the request`);

          Logging.Send(LogLevel.ERROR, responseObject);

        })
      );

      i++;
    } while (i < queries.length); 

    Promise.all(productPromises)
      .then((listReviewDocuments: Array<Array<ReviewDocument>>) => {

        // Combine all of the reviews into a single array to be grouped by their
        // respective query.
        const reviewDocuments: Array<ReviewDocument> = listReviewDocuments.reduce(
          (
            previous: Array<ReviewDocument>,
            current: Array<ReviewDocument>
          ) => {
            return previous.concat(current);
          });

        // Declare a reviews list to be returned with the response.
        let reviewGroups: ReviewGroup;

        if (reviewDocuments.length > 0) {
          reviewGroups = ReviewCommon.GroupReviewsByCategoryQueries(
            queries, reviewDocuments);
        }

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            reviews: reviewGroups
          }
        }, 200, 'Reviews found');

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);
      })
      .catch((error: Error) => {

        // Return an error indicating the list of reviews weren't found.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEWS_FOR_CATEGORY_NOT_FOUND',
            message: `We experienced an issue retrieving reviews for the requested category`
          },
          error: error
        }, 404, `We experienced an issue retrieving reviews for the requested category`);

        Logging.Send(LogLevel.ERROR, responseObject);

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
    const description = request.body.description,
          id = request.params.id,
          links = request.body.links,
          recommended = request.body.recommended,
          sponsored = request.body.sponsored,
          thumbnail = request.body.thumbnail,
          title = request.body.title,
          userId = request.auth._id,
          videoFileType = request.body.videoFileType,
          videoSize = request.body.videoSize,
          videoTitle = request.body.videoTitle,
          youtube = {
            endTime: request.body.endTime || 0,
            startTime: request.body.startTime || 0,
            url: request.body.videoURL || ''
          };

    Review.findOneAndUpdate({
      _id: id,
      user: userId
    }, {
      description: description,
      links: links,
      recommended: recommended,
      sponsored: sponsored,
      thumbnail: thumbnail,
      title: title,
      youtube: youtube
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
            review: review.details
          }
        }, 200, `Review ${review._id}: Updated successfully`);

        Logging.Send(LogLevel.INFO, responseObject);
        
        // Return the response for the successful update.
        response.status(responseObject.status).json(responseObject.data);
        return;
      }  

      // Create a presigned request for the new video file.
      Video.CreatePresignedVideoRequest(
        videoTitle,
        videoSize,
        videoFileType,
        `reviews/${review._id}`
      ).then((requestData: S3.PresignedPost) => {

        // Set the response object.
        const responseObject: ResponseObject = Connect.setResponse({
          data: {
            review: review.details,
            presigned: requestData
          }
        }, 200, `Review ${review._id}: Updated successfully`);

        Logging.Send(LogLevel.INFO, responseObject);

        // Return the response for the authenticated user.
        response.status(responseObject.status).json(responseObject.data);

      })
      .catch((error: Error) => {
        // Return an error indicating the review wasn't created.
        const responseObject = Connect.setResponse({
          data: {
            errorCode: 'REVIEW_NOT_UPDATED',
            message: 'There was a problem updating your review'
          },
          error: error
        }, 401, 'There was a problem updating your review');

        Logging.Send(LogLevel.ERROR, responseObject);

        // Return the error response for the user.
        response.status(responseObject.status).json(responseObject.data);
      });
    })
    .catch((error: Error) => {

      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'EDIT_REVIEW_FAILED',
          message: 'There was a problem updating your review'
        },
        error: error
      }, 403, 'There was a problem updating your review');

      Logging.Send(LogLevel.ERROR, responseObject);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }

  /**
   * Deletes a review.
   *
   * @param {object} req
   * The request object.
   *
   * @param {object} res
   * The response object.
   */
  static Remove(request: AuthenticatedUserRequest, response: Response): void {
    const id = request.params.id,
          userId = request.auth._id;

    Review.findOneAndUpdate({
      _id: id,
      user: userId
    }, {
      published: Workflow.REMOVED
    }, {
      new: true,
      upsert: false
    })
    .then(() => {

      // Decrement the raves count.
      UserStatisticsCommon.IncrementRavesCount(userId, -1);

      // Set the response object.
      const responseObject = Connect.setResponse({
        data: {
          message: 'Review removed successfully'
        }
      }, 200, `Review ${id} removed successfully`);

      Logging.Send(LogLevel.INFO, responseObject);
        
      // Return the response for the successful update.
      response.status(responseObject.status).json(responseObject.data);
    })
    .catch((error: Error) => {

      // Return an error indicating the review wasn't created.
      const responseObject = Connect.setResponse({
        data: {
          errorCode: 'REMOVE_REVIEW_FAILED',
          message: 'There was a problem removing your review'
        },
        error: error
      }, 403, 'There was a problem removing your review');

      Logging.Send(LogLevel.INFO, responseObject);

      // Return the error response for the user.
      response.status(401).json(responseObject.data);
    });
  }
}
