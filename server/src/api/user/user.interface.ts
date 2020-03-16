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
  encryptPassword: Function;
  expires: number;
  _id: string;
  password: string;
  provider: string;
  privateProfile: PrivateUserDetails;
  role: Array<UserRole>;
  salt: string;
}

export interface PrivateUserDetails {
  _id: string;
  role: Array<UserRole>;
  email: string;
  expires: number;
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
  password: string;
  provider: string;
}
