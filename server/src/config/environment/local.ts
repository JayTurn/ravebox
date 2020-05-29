/**
 * Local Environment Configuration Example.
 *
 * Simply copy this file as 'local.js' with the following optional overrides.
 *
 * Override Options:
 *  port - Set a local port for which to start the Express Server.
 *  ip   - Define a custom ip address for the Express Server.
 *  root - Define a root path for the Express Server.
 */
'use strict';

// Interfaces.
import { EnvironmentProperties } from './environmentConfig.interface';

// Define the dbname and uri to be set in the config.
const dbname: string = process.env.MONGODB_NAME,
      uri = `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`;

const config: Partial<EnvironmentProperties> = {
  analytics: {
    amplitude: {
      apiKey: '24b5a7dd44938c8470f4fa887931a9ee' 
    },
    google: {
      apiKey: ''
    }
  },
  aws: {
    accessKeyId: 'AKIAQZGCV7RFVDNF32PN',
    secretAccessKey: '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',
    region: 'ap-southeast-2',
    signatureVersion: "v4"
  },
  elasticsearch: {
    url: 'http://127.0.0.1:9200'
  },
  database: {
    name: dbname,
    uri: uri,
    secret: 'yVDtwrgYpk1SarMBZULYjnYjJTmNdyem337hdjdf'
  },
  notifications: {
    key: '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',
    lists: [2, 3, 4]
  },
  origins: [
    'http://localhost:3000'
  ],
  //domain: 'http://localhost:9000',
  //liveReloadPort: 9001,
  port: 9000,
  security: {
    secret: 'xVDtwrgYpk1SarMBZULYjnYjJTmNaEJgoyQEWenM',
    csrfSecret: 'xYDtwrgYpk1SarMBZULYjnYjJTmNaEJgoyQEWenM'
  },
  s3: {
    video: "ravebox-videos"
  }
};

export default config;
