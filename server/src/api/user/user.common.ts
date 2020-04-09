/**
 * User.common.ts
 * Common functions performed with a user document.
 */

// Modules.
import * as Jwt from 'jsonwebtoken';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import Notifications from '../../shared/notifications/Notifications.model';

// Enumerators.
import {
  EmailTemplate
} from '../../shared/notifications/Notifications.enum';

// Interfaces.
import { PrivateUserDetails } from './user.interface';

/**
 * UserCommon class.
 */
export default class UserCommon {
  /**
   * Creates an email verification token.
   *
   * @param { string } email - the email address.
   * @param { string } userId - the id of the user.
   */
  static GenerateEmailVerificationToken(email: string, userId: string): string {
    // Create the JWT.
    return Jwt.sign({ 
        'email': email,
        'userId': userId,
      }, EnvConfig.security.secret, {
        expiresIn: '1d'
      });
  }

  /**
   * Retrieves a password reset token.
   *
   * @param { string } token - the token to decode.
   */
  static GetEmailVerificationToken(token: string): string | {[key: string]: any} {
    // Decode the JWT.
    return Jwt.decode(token);
  }

  /**
   * Sends an email verification link.
   */
  static SendEmailVerification(user: PrivateUserDetails): void {

    // Create a new email verification token.
    const token: string = UserCommon.GenerateEmailVerificationToken(
      user.email, user._id)

    // Send the verification token to the provided email address.
    Notifications.SendTransactionalEmail(
      {email: user.email, name: user.handle},
      EmailTemplate.EMAIL_VERIFICATION,
      {
        token: `${process.env.PUBLIC_CLIENT}/verify/${token}`
      }
    );
  }
}
