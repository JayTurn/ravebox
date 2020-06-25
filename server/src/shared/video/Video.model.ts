/**
 * Video.model.ts
 * Model for handling the storage and playback of video.
 */

// Modules.
import * as S3 from 'aws-sdk/clients/s3';
import EnvConfig from '../../config/environment/environmentBaseConfig';

// Interfaces.
import { VideoUploadMetadata } from './Video.interface';

/**
 * Video management class.
 */
export default class Video {

  /**
   * Creates a presigned request to be used for video uploads.
   *
   * @param { string } filename - the name of the file to be uploaded.
   * @param { string } fileSize - the size of the file to be uploaded.
   * @param { string } fileType - the type of the file to be uploaded.
   * @param { string } s3Location - the path to the s3 file location.
   */
  static CreatePresignedVideoRequest(
    filename: string,
    fileSize: string,
    fileType: string,
    s3Location: string
  ): Promise<S3.PresignedPost> {

    // Define the filepath by combining the file name and s3 location.
    const filePath = `${s3Location}/${filename}`;

    // Create the S3 presign paramters to generate a new request object.
    const params: S3.PresignedPost.Params = {
      Bucket: `ravebox-media-source`,
      Conditions: [
        ['content-length-range', 100, fileSize],
        ['starts-with', '$key', filePath]
      ],
      Fields: {
        key: filePath
      }
    };

    // Creates the s3 client connection.
    const client: S3 = new S3({
      accessKeyId: EnvConfig.aws.accessKeyId,
      secretAccessKey: EnvConfig.aws.secretAccessKey,
      region: 'ap-southeast-2',
      signatureVersion: EnvConfig.aws.signatureVersion
    }); 
    
    // Create a new presigned post request and return the object as part of
    // a promise response.
    return new Promise((resolve: Function, reject: Function) => {
      client.createPresignedPost(params, (error: Error, data: S3.PresignedPost) => {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  }

  /**
   * Creates a presigned request to be used for video metadata uploads.
   *
   * @param { string } filename - the name of the file to be uploaded.
   * @param { string } fileSize - the size of the file to be uploaded.
   * @param { string } fileType - the type of the file to be uploaded.
   * @param { string } s3Location - the path to the s3 file location.
   */
  static CreateMetadataFile(
    metadata: VideoUploadMetadata 
  ): S3.ManagedUpload {

    const extensionIndex: number = metadata.srcVideo.lastIndexOf('.'); 

    const key = `${metadata.srcVideo.substr(0, extensionIndex)}.json`;

    const metadataBuffer: Buffer = Buffer.from(JSON.stringify(metadata, null, 2));

    // Creates the s3 client connection.
    const client: S3 = new S3({
      accessKeyId: EnvConfig.aws.accessKeyId,
      secretAccessKey: EnvConfig.aws.secretAccessKey,
      region: EnvConfig.aws.region,
      signatureVersion: EnvConfig.aws.signatureVersion
    }); 

    return client.upload({
      Bucket: metadata.srcBucket,
      Key: key,
      Body: metadataBuffer
    });
  }
}
