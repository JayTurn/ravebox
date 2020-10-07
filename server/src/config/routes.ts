/**
 * routes.ts
 */
import { Router } from 'express';

// Route Controllers.
import AdminController from '../api/admin/admin.controller';
import BrandController from '../api/brand/brand.controller';
import FollowController from '../api/follow/follow.controller';
import InvitationController from '../api/invitation/invitation.controller';
import ReviewController from '../api/review/review.controller';
import ReviewStatisticsController from '../api/reviewStatistics/reviewStatistics.controller';
import ProductController from '../api/product/product.controller';
import SearchController from '../api/search/search.controller';
import TagController from '../api/tag/tag.controller';
import UserController from '../api/user/user.controller';

/**
 * RoutesController class.
 * @class RoutesController
 */
export default class RoutesController {
  // Declare a router property to store the registered routes.
  public router: Router;
  // Declare a base api path.
  public apiPath = '/api/';

  /**
   * Class constructor
   * @constructor
   */
  constructor() {
    // Instantiate the router to be pass to classes for route registration.
    this.router = Router();

    // Register the admin routes.
    AdminController.createRoutes(this.router, this.apiPath);
    // Register the brand routes.
    BrandController.createRoutes(this.router, this.apiPath);
    // Register the follow routes.
    FollowController.createRoutes(this.router, this.apiPath);
    // Register the invitation routes.
    InvitationController.createRoutes(this.router, this.apiPath);
    // Register the product routes.
    ProductController.createRoutes(this.router, this.apiPath);
    // Register the review routes.
    ReviewController.createRoutes(this.router, this.apiPath);
    // Register the review statistics routes.
    ReviewStatisticsController.createRoutes(this.router, this.apiPath);
    // Register the search routes.
    SearchController.createRoutes(this.router, this.apiPath);
    // Register the tag routes.
    TagController.createRoutes(this.router, this.apiPath);
    // Register the user routes.
    UserController.createRoutes(this.router, this.apiPath);
  }
}
