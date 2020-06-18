/**
 * routes.ts
 */
import { Router } from 'express';

// Route Controllers.
import FollowController from '../api/follow/follow.controller';
import ReviewController from '../api/review/review.controller';
import ReviewStatisticsController from '../api/reviewStatistics/reviewStatistics.controller';
import ProductController from '../api/product/product.controller';
import SearchController from '../api/search/search.controller';
import UserController from '../api/user/user.controller';
//import EvaluationController from '../api/execution/evaluation.controller';
//import HealthController from '../api/health/health.controller';
//import InstrumentController from '../api/instrument/instrument.controller';
//import ReinforcementController from '../api/statistics/reinforcement.controller';
//import SimulationController from '../api/simulation/simulation.controller';
//import StatisticsController from '../api/statistics/statistics.controller';

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

    // Register the follow routes.
    FollowController.createRoutes(this.router, this.apiPath);
    // Register the product routes.
    ProductController.createRoutes(this.router, this.apiPath);
    // Register the review routes.
    ReviewController.createRoutes(this.router, this.apiPath);
    // Register the review statistics routes.
    ReviewStatisticsController.createRoutes(this.router, this.apiPath);
    // Register the search routes.
    SearchController.createRoutes(this.router, this.apiPath);
    // Register the user routes.
    UserController.createRoutes(this.router, this.apiPath);
  }
}
