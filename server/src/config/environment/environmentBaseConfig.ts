/**
 * environment-base-config.js
 *
 * The base environment configuration to be extended.
 */
'use strict';
import * as Path from 'path';
//import * as Fs from 'fs';
import * as _ from 'lodash';
//import * as s from 'underscore.string';
import { sharedConfig } from './shared';

// Enumerators.
import { UserRole } from '../../api/user/user.enum';

// Interfaces.
import {
  AWSProperties,
  EnvironmentProperties,
  DatabaseProperties,
  S3Properties,
  SecurityProperties
} from './environmentConfig.interface';
//import AWS from 'aws-sdk';

// Extend lodash with underscore.string to support ES2015 string functions.
//_.mixin(s.exports());

// Environment configuration.
const config: EnvironmentProperties = require(__dirname + '/' + process.env.ENVIRONMENT).default;

/**
 * EnvConfig Class.
 */
class EnvConfig implements EnvironmentProperties {
  // Node environment.
  public authenticationTimeout: string; 
  public aws: AWSProperties = {
    accessKeyId: '',
    secretAccessKey: '',
    region: '',
    signatureVersion: ''
  };
  public env: string = process.env.NODE_ENV;
  public root: string = Path.normalize(__dirname + '/../../../');
  public port: string | number = process.env.PORT || 9000;
  public ip: string = process.env.IP || '0.0.0.0';
  public database: DatabaseProperties;
  public refreshBuffer: string;
  public roles: Array<UserRole>;
  public providers: Array<string>;
  public security: SecurityProperties;
  public s3: S3Properties = {
    video: ''
  };

  /**
   * EnvConfig constructor.
   */
  constructor() {
    // Extend the base configuration with shared settings.
    _.merge(this, sharedConfig);

    this.extendConfig()
  }

  /**
   * Extends the base configuration with environment specific settings.
   *
   * @param { function } callback - callback function.
   */
  extendConfig(): void {
    // If this is the local environment.
    //if (this.env === 'local' || this.env === 'test') {
      // Load the local environment settings. 
      //let config: EnvironmentProperties = require(__dirname + '/' + process.env.NODE_ENV + '.js');

      // Extend the instance settings with the envicornment config.
    _.merge(this, config);

      // Trigger the callback and exit.
      //return callback(false);
    //}

    /*
    // Create an S3 object from the shared credentials.
    let S3 = new AWS.S3(this.aws);

    // Get the environment specific configuration file from AWS S3.
    S3.getObject({
      Bucket: process.env.S3BUCKET,
      Key: 'private/credentials/config.json'
    }, (error, configuration) => {
      // If we have an error.
      if (error) {
        // Return the error in the callback.
        callback(error);
      }

      // Extend the instance settings with the envicornment config.
      _.merge(this, JSON.parse(configuration.Body.toString()));

      // Get the database server certificate for this environment.
      this.database.options.mongos.sslCA = [Fs.readFileSync(Path.join(__dirname, '../../../../', 'certificates', this.database.certificate))];

       // The file was retrieved successfully.
       callback(false);
    });
    */
  }
}

export default new EnvConfig();
