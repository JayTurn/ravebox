/**
 * Production Environment Configuration.
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
      uri = `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`;

const config: Partial<EnvironmentProperties> = {
  analytics: {
    amplitude: {
      apiKey: '979f2e5e3ef95ddec00ffb7a33fec431' 
    },
    google: {
      apiKey: ''
    }
  },
  aws: {
    accessKeyId: 'AKIAQZGCV7RFYQW3ZDA4',
    secretAccessKey: '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',
    region: 'us-east-1',
    signatureVersion: "v4"
  },
  database: {
    name: dbname,
    uri: uri,
    secret: 'yVDtwrgYpk1SarMBZULYjnYjJTmNdyem337hdjdf'
  },
  origins: [
    'https://ravebox.io',
  ],
  notifications: {
    key: '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',
    lists: [2, 3, 4]
  },
  port: 9000,
  security: {
    secret: 'FcHeMhPkRpUrWtZw3y5B8DaGdJfMjQmSpVsXuZx4',
    csrfSecret: '7DaFcHfMhPmSpUrXuZw3z6B8EbGdJgNjQmTqVsXv'
  },
  s3: {
    video: "ravebox-videos"
  }
};

export default config;
