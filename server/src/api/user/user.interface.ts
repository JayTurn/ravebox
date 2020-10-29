/**
 * user.interface.ts
 * Interface for the user details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import { UserRole } from './user.enum';

// Interfaces.
import {
  FollowDocument,
  Following
} from '../follow/follow.interface';
import { ReviewDetails } from '../review/review.interface';
import {
  UserStatisticsDetails,
  UserStatisticsDocument
} from '../userStatistics/userStatistics.interface';

export interface UserDocument extends Mongoose.Document {
  _id: Mongoose.Types.ObjectId;
  about: string;
  avatar: string;
  authenticate: Function;
  createSalt: Function;
  email: string;
  emailVerified: boolean;
  encryptPassword: Function;
  expires: number;
  following: FollowDocument;
  handle: string;
  links: Array<LinkDetails>;
  oldEmail: string;
  password: string;
  provider: string;
  privateProfile: PrivateUserDetails;
  publicProfile: PublicUserDetails;
  role: Array<UserRole>;
  salt: string;
  statistics: UserStatisticsDocument;
  updatePassword: Function;
}

export interface PrivateUserDetails {
  _id: string;
  avatar: string;
  handle: string;
  role: Array<UserRole>;
  email: string;
  emailVerified: boolean;
  expires: number;
  following?: Following;
  statistics?: UserStatisticsDetails;
}

export interface PublicUserDetails {
  about?: string;
  avatar: string;
  _id: string;
  handle: string;
  links?: Array<LinkDetails>;
  profileImage?: string;
  statistics?: UserStatisticsDetails;
  role: UserRole;
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
  avatar: string;
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
