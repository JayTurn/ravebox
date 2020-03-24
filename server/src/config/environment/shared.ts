/**
 * Shared Environment Configuration.
 */
'use strict';

// Export the configuration shared across environments.
export const sharedConfig = {
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
  s3: {
    bucket: process.env.S3BUCKET // AWS ENV
  },
  // The length of time for authentication to remain valid.
  authenticationTimeout: '7d',
  // Refresh if there is an hour before authentication expiry.
  refreshBuffer: 3600,
  // Application roles.
  roles: ['tenant', 'landlord', 'admin'],
  providers: ['password'],
  seedConfig: false
};
