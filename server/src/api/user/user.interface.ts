/**
 * user.interface.ts
 * Interface for the user details.
 */

// Enumerators.
import { UserRole } from './user.enum';

// Interfaces.
import * as Mongoose from 'mongoose';

export interface UserDetailsDocument extends Mongoose.Document {
  authenticate: Function;
  createSalt: Function;
  email: string;
  emailVerified: boolean;
  encryptPassword: Function;
  expires: number;
  handle: string;
  _id: string;
  password: string;
  provider: string;
  privateProfile: PrivateUserDetails;
  publicProfile: PublicUserDetails;
  role: Array<UserRole>;
  salt: string;
}

export interface PrivateUserDetails {
  _id: string;
  handle: string;
  role: Array<UserRole>;
  email: string;
  emailVerified: boolean;
  expires: number;
}

export interface PublicUserDetails {
  _id: string;
  handle: string;
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
