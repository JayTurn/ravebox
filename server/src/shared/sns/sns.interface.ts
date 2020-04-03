/**
 * Interfaces for SNS communication.
 */

// Import enumerators.
import { SNSMessageType } from './sns.enum';

export interface SNSConfirmation {
  Type: SNSMessageType;
  MesageId: string;
  Token: string;
  TopicArn: string;
  Message: string;
  SubscribeURL: string;
  Timestamp: string;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
}

export interface SNSNotification {
  Type: SNSMessageType;
  MesageId: string;
  TopicArn: string;
  Subject: string;
  Message: string;
  Timestamp: string;
  SignatureVersion: string;
  Signature: string;
  SigningCertURL: string;
  UnsubscribeURL: string;
}
