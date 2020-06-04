/**
 * Logging.model.ts
 * Model for logging errors and information.
 */

// Modules.
import * as CloudWatch from 'winston-cloudwatch';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as Winston from 'winston';


// Interfaces.
import { ResponseObject } from '../../models/database/connect.interface';

// Enumerators.
import { LogLevel } from './Logging.enum';

const logger = Winston.createLogger({
  transports: [
    new CloudWatch({
      awsAccessKeyId: EnvConfig.aws.accessKeyId,
      awsRegion: 'us-east-1',
      awsSecretKey: EnvConfig.aws.secretAccessKey,
      jsonMessage: true,
      logGroupName: `/ravebox/server`,
      logStreamName: `${process.env.ENVIRONMENT}`
    })
  ]
});

/**
 * Logging model.
 * @class Logging
 */
export default class Logging {
  /**
   * Logs an event.
   */
  public static Send(level: LogLevel, message: ResponseObject): void {
    let code: string = level.toUpperCase();

    // Format the unique code we use for tracking specific events..
    if (message.data && message.data.errorCode) {
      code = `${message.data.errorCode}`;
    }

    switch (level) {
      case LogLevel.ERROR:
        logger.error({
          code: code,
          title: message.data.title,
          error: message.error
        });
        break;
      case LogLevel.WARNING:
        logger.warning({
          code: code,
          title: message.data.title,
          message: message.data.message
        });
        break;
      default:
        logger.info({
          title: message.data.title,
        });
    }
  }
}
