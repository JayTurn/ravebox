/**
 * authentication.interface.ts
 * Authentication interfaces.
 */

// Interfaces.
import { Request } from 'express';
import { 
  AuthenticatedUserDetails,
  PrivateUserDetails
} from '../../api/user/user.interface';
import {
  UserStatisticsDocument
} from '../../api/userStatistics/userStatistics.interface';

export interface UserAttachedRequest extends Request {
  user: PrivateUserDetails;
}

export interface AuthenticatedUserRequest extends Request {
  auth: AuthenticatedUserDetails;
  user?: PrivateUserDetails;
  userStatistics?: UserStatisticsDocument;
}
