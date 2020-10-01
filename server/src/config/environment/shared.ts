/**
 * Shared Environment Configuration.
 */
'use strict';

// Export the configuration shared across environments.
export const sharedConfig = {
  analytics: {
    amplitude: {
      apiKey: '24b5a7dd44938c8470f4fa887931a9ee' 
    },
    google: {
      apiKey: ''
    }
  },
  aws: {
    accessKeyId: process.env.AWSACCESSKEY,
    secretAccessKey: process.env.AWSACCESSSECRET,
    region: process.env.AWSREGION,
    signatureVersion: process.env.AWSSIGNATURE
  },
  database: {
    secret: process.env.DATABASESECRET // AWS ENV
  },
  security: {
    secret: process.env.SECURITYSECRET, // AWS ENV
    csrfSecret: process.env.CSRFSECRET // AWS ENV
  },
  notifications: {
    key: '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',
    lists: [2, 3, 4]
  },
  s3: {
    bucket: process.env.S3BUCKET // AWS ENV
  },
  // The length of time for authentication to remain valid.
  authenticationTimeout: '7d',
  // Refresh if there is an hour before authentication expiry.
  refreshBuffer: 3600,
  // Application roles.
  roles: ['user', 'youtube', 'creator', 'admin'],
  providers: ['password'],
  seedConfig: false
};
