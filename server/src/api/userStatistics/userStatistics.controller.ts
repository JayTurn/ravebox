/**
 * userStatistics.controller.ts
 */

// Modules.
import {
  Request,
  Response,
  Router } from 'express';

/**
 * Routing controller for user statistics.
 * @class UserStatisticsController
 *
 * Route: /api/statistics
 *
 */
export default class UserStatisticsController {
  /**
   * Static method to create the index controller routes.
   */
  public static createRoutes(router: Router, apiPath: string): void {
    const path: string = apiPath + 'statistics/user';

    // Get the index route.
    router.get(path, (req: Request, res: Response) => {
      new UserStatisticsController().getStatus(req, res);
    });
  }

  /**
   * GET /
   * Index route.
   */
  public getStatus(req: Request, res: Response): void {
    res.status(200).json({'body': 'Review statistics logging successfully'});
  }
}
