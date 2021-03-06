/**
 * environmentConfig.interface.ts
 * Interfaces for the environment config.
 */

// Enumerators.
import { UserRole } from '../../api/user/user.enum';

export interface EnvironmentProperties {
  admin: string;
  analytics: AnalyticsProperties;
  authenticationTimeout: string;
  aws: AWSProperties;
  CDN: string;
  database?: DatabaseProperties;
  elasticsearch: ElasticsearchProperties;
  env: string;
  ip: string;
  notifications: NotificationProperties;
  origins: Array<string>;
  port: string | number;
  providers: Array<string>;
  refreshBuffer: string;
  roles: Array<UserRole>;
  root: string;
  s3: S3Properties;
  security?: SecurityProperties;
}

export interface AnalyticsProperties {
  amplitude: {
    apiKey: string;
  };
  google: {
    apiKey: string;
  };
}

export interface AWSProperties {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  signatureVersion: string;
}

export interface DatabaseProperties {
  secret: string;
  name: string;
  uri: string;
}

export interface ElasticsearchProperties {
  url: string;
}

export interface SecurityProperties {
  secret: string;
  csrfSecret: string;
}

export interface S3Properties {
  video: string;
}

export interface NotificationProperties {
  key: string;
  lists: Array<number>;
}
