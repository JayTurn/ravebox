/**
 * user.interface.ts
 * Interface for the user details.
 */

// Modules.
import * as Mongoose from 'mongoose';

// Enumerators.
import {
  UserRole,
  UserLinkType
} from './user.enum';

// Interfaces.
import {
  FollowDocument,
  Following
} from '../follow/follow.interface';
import { StreamData } from '../stream/stream.interface';
import {
  PublicUserStatisticsDetails,
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
  about?: string;
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
  statistics?: PublicUserStatisticsDetails;
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
  about?: string;
  avatar: string;
  handle: string;
  links?: Array<LinkDetails>;
}

/**
 * Channel interface.
 */
export interface UserChannel {
  profile?: PublicUserDetails;
  raveStreams?: Array<StreamData>;
}

/**
 * Links.
 */
export interface LinkDetails {
  linkType: UserLinkType;
  path: string;
}
