/**
 * user.interface.ts
 * Interface for the user details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { UserRole } from './user.enum';

// Interfaces.
import { ReviewDetails } from '../review/review.interface';
import {
  UserStatistics,
  UserStatisticsDocument
} from '../userStatistics/userStatistics.interface';

export interface UserDetailsDocument extends Mongoose.Document {
  about: string;
  authenticate: Function;
  createSalt: Function;
  email: string;
  emailVerified: boolean;
  encryptPassword: Function;
  expires: number;
  handle: string;
  _id: string;
  links: Array<LinkDetails>;
  oldEmail: string;
  password: string;
  provider: string;
  privateProfile: PrivateUserDetails;
  profileImage: string;
  publicProfile: PublicUserDetails;
  role: Array<UserRole>;
  salt: string;
  statistics: UserStatisticsDocument;
  updatePassword: Function;
}

export interface PrivateUserDetails {
  _id: string;
  handle: string;
  role: Array<UserRole>;
  email: string;
  emailVerified: boolean;
  expires: number;
  statistics?: UserStatistics;
}

export interface PublicUserDetails {
  about?: string;
  _id: string;
  handle: string;
  links?: Array<LinkDetails>;
  profileImage?: string;
  statistics?: UserStatistics;
}

export interface AuthenticatedUserDetails {
  _id: string;
  csrf: string;
  exp: number;
  iat: number;
  role: Array<UserRole>;
}

export interface SignupDetails {
  email: string;
  handle: string;
  password: string;
  provider: string;
}

export interface ProfileSettings {
  handle: string;
}

/**
 * Channel interface.
 */
export interface UserChannel {
  profile?: PublicUserDetails;
  reviews?: Array<ReviewDetails>;
}

/**
 * Links.
 */
export interface LinkDetails {
  title: string;
  path: string;
}
