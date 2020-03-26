/**
 * user.model.js
 * User Class to manage the user model.
 */
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as Mongoose from 'mongoose';
import * as Jwt from 'jsonwebtoken';
import * as Crypto from 'crypto';
import * as _ from 'lodash';

// Interfaces.
import { UserDetailsDocument } from './user.interface';

// Import additional subschemas.
//import Name from '../../../shared/schemas/name.schema';
//import Location from '../../../shared/schemas/location.schema';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the User Schema to be the base for the User model.
const UserSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    lowercase: true,
  },
  //name: {
    //type: Name,
    //es_indexed: false
  //},
  //phone: {
    //type: String,
    //es_indexed: false
  //},
  //address: {
    //type: Location,
    //es_indexed: false
  //},
  password: {
    type: String,
  },
  provider: {
    type: String,
  },
  role: {
    type: Array,
    default: [ EnvConfig.roles[0] ],
  },
  salt: {
    type: String,
  }
});

// Define a private profile to be used for responses.
UserSchema
  .virtual('privateProfile')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role,
      'email': this.email,
      //'name': this.name,
      //'phone': this.phone,
      //'address': this.address,
      // @todo: avatar
      'expires': this.expires
      //'searchPreferences': this.searchPreferences,
      //'settings': this.settings,
    };
  });

// Define a public profile to be used for responses.
UserSchema
  .virtual('publicProfile')
  .get(function() {
    return {
      '_id': this._id,
      'email': this.email
      //'name': this.name,
      //'phone': this.phone,
      //'address': this.address,
      // @todo: avatar
      //'searchPreferences': this.searchPreferences,
      //'settings': this.settings,
    };
  });

// Define fullname profile handling.
UserSchema
  .virtual('fullname')
  .set(function(name: string) {
    // Divide the name by the spaces identified.
    const split = name.split(' '),
          count = split.length;

    // Set the first and last names.
    this.set('name.first', split[0]);
    this.set('name.last', split[count - 1]);
  });

// Define a virtual expiration to be added to the profile.
UserSchema
  .virtual('expires')
  .get(function() {
    // Set the expiration property.
    return this.expiration;
  })
  .set(function(expires: Date) {
    // Set the expiration property.
    this.expiration = expires;
  });

// Validate the email provided isn't empty.
UserSchema
  .path('email')
  .validate(function(email: string) {
    if (this.provider !== EnvConfig.providers[0]) {
      return true;
    }

    return email.length;
  }, 'EMAIL_EMPTY');

// Validate the email provided hasn't been taken.
UserSchema
  .path('email')
  .validate(function(email: string, callback: Function) {
    // Get the instance of this Schema.
    //let _this = this;

    // Return the result from attempting to find the email address in the
    // database.
    return (): void => this.constructor.findOne({email: email})
      .then((user: UserDetailsDocument) => {
        // If a user was found.
        if (user) {
          // If this schema id and user id match, assume we are updating an
          // existing account.
          if (this._id === user._id) {
            // Return true.
            return callback(true);
          }
          // Otherwise, this email is already in use, return false.
          return callback(false);
        }
        // This email address is available, return true.
        return callback(true);
      })
      .catch((error: Error) => {
        // Throw an error for the User creation.
        throw error;
      });
  }, 'EMAIL_ALREADY_REGISTERED');

/**
 * Pre-Save hook to manage password encryption before storing.
 */
UserSchema
  .pre<UserDetailsDocument>('save', function(next: Mongoose.HookNextFunction) {
    let _this: UserDetailsDocument;

    // If this is a new or updated password.
    if (this.isModified('password')) {

      // Make a local version of this available.
      _this = this;

      // If the password exists and this user was created as a password
      // provider.
      if (_.isString(this.password) && this.provider === EnvConfig.providers[0]) {
        // Create a new salt.
        this.createSalt((error: Error, salt: string) => {
          // If there was an error.
          if (error) {
            next(error);
          }

          // Store the newly created salt.
          _this.salt = salt;

          // Encrypt the password using the newly created salt.
          _this.encryptPassword(_this.password, _this.salt, (error: Error, passwordHash: string) => {
            // If there was an error.
            if (error) {
              next(error);
            }

            // Replace the User password with the hashed version.
            _this.password = passwordHash;
            // Exit the Pre-Save hook.
            next();
          });
        });
      } else {
        // The password isn't a string or we don't have a default provider.
        next();
      }
    } else {
      // We aren't updating or modifying the password so move to the next
      // middleware;
      next();
    }
  });

// Attach methods to the Schema User model with Promises.
UserSchema.methods = {
  /**
   * Validates the passwords.
   *
   * @param {string} password
   * The user provided password.
   *
   * @param {function} callback
   * The callback method to be triggered on completion.
   */
  authenticate: function(password: string, callback: Function): void {
    // Store a local copy of the instance for validation.
    //let _this = this;

    // Encrypt the password.
    this.encryptPassword(password, this.salt, (error: Error, passwordGenerated: string) => {

      // If there was an error encrypting the password.
      if (error) {
        return callback(error);
      }

      // If the provided password matches encrypted password stored against
      // the user.
      if (this.password === passwordGenerated) {
        // Return a true authentication statte.
        return callback(null, true);
      } else {
        // The passwords don't match so return a non-authentication state.
        return callback(null, false);
      }
    });
  },

  /**
   * Encrypts the provided password.
   *
   * @param {string} password
   * The password string.
   *
   * @param {function} callback
   * The callback to be triggered on completion.
   */
  encryptPassword: function(password: string, salt: string, callback: Function): void {

    // If we haven't been provided a password or the salt doesn't exist, exit.
    if (!password || !salt) {
      callback(true);
    }

    // Set the iterations used for the encrypted key creation.
    const iterations = 1000;
    // Set the byte length for the requested key.
    const keyLength = 64;
    // Set the HMAC digest algorithm.
    const digest = 'sha512';
    // Set the salt as a buffer based on the provided salt using
    // base64 encoding.
    const saltBuffer = new Buffer(salt, 'base64');

    // Create Password-Based Key Derivation Function 2 key based on the
    // password, salt and iteration values.
    return Crypto.pbkdf2(password, saltBuffer, iterations, keyLength, digest, (error, key) => {
      // Return any errors.
      if (error) {
        callback(error);
      }

      // No errors were found, so return the key.
      return callback(null, key.toString('base64'));

    });
  },

  /**
   * Update a password.
   *
   * @param { string } password - the new password to be updated.
   * @param { string } oldPassword - the old password.
   */
  updatePassword: function(password: string, callback: Function): void {

    // Check if this is a string and the user created a password access account.
    if (_.isString(password) && this.provider === EnvConfig.providers[0]) {

      // Create a new salt.
      this.createSalt((error: Error, salt: string) => {
        // If there was an error.
        if (error) {
          // Trigger the callback error.
          callback(error);
        }

        // Store the newly created salt.
        //_this.salt = salt;

        // Encrypt the password using the newly created salt.
        this.encryptPassword(password, salt, (error: Error, passwordHash: string) => {
          // If there was an error.
          if (error) {
            // Trigger the callback error.
            callback(error);
          }

         // Return the password and hash value. 
         callback(false, passwordHash, salt);

        });
      });
    } else {
      // The password isn't a string or we don't have a default provider.
      // Trigger the error callback.
      callback(true);
    }

  },

  /**
   * Creates a random salt value.
   *
   * @param {function} callback
   * The callback to be triggered on completion.
   */
  createSalt: function(callback: Function): void {
    // Define the byteSize for the salt.
    const byteSize = 16;

    // Create the salt based on random bytes.
    return Crypto.randomBytes(byteSize, (error, salt) => {
      // Return the error.
      if (error) {
        callback(error);
      }

      // Return the base64 encoded salt string.
      return callback(null, salt.toString('base64'));
    });
  }
};

/**
 * Attach Static methods to the Schema.
 */
UserSchema.statics = {
  /**
   * Creates forgot password token.
   *
   * @param { string } emailAddress - the email address.
   * @param { string } userId - the id of the user.
   */
  generatePasswordResetToken(emailAddress: string, userId: string): string {
    // Create the JWT.
    return Jwt.sign({ 
        'emailAddress': emailAddress,
        'userId': userId,
      }, EnvConfig.security.secret, {
        expiresIn: '15m'
      });
  },

  /**
   * Retrieves a password reset token.
   *
   * @param { string } token - the token to decode.
   */
  getPasswordResetToken(token: string): string | {[key: string]: string | Date} {
    // Decode the JWT.
    return Jwt.decode(token);
  }

};

// Declare the User mongoose model.
const User: Mongoose.Model<UserDetailsDocument> = Mongoose.model('User', UserSchema);

// Declare the User mongoose model.
export default User;
