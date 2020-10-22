/**
 * RaveStream.common.tsx
 * Common functions for rave streams.
 */

// Enumerators.
import { RaveStreamType } from './RaveStream.enum';

// Interfaces.
import {
  RaveStream,
  RaveStreamURLParams
} from './RaveStream.interface';

/**
 * Creates an empty rave Stream object for use in object definitions.
 *
 * @return EventObject
 */
export const emptyRaveStream: (
) => RaveStream = (
): RaveStream => {
  return {
    reviews: [],
    streamType: RaveStreamType.PRODUCT,
    title: ''
  };
}

/**
 * Formats the url path based on the parameters provided.
 *
 * @param { RaveStreamURLParams } params - the URL parameters provided.
 *
 * @return string
 */
export const buildRaveStreamPath: (
  params: RaveStreamURLParams
) => string = (
  params: RaveStreamURLParams
): string => {
  let path: string = `${params.streamType}`;

  if (params.firstPath) {
    path += `/${params.firstPath}`;
  }

  if (params.secondPath) {
    path += `/${params.secondPath}`;
  }

  if (params.thirdPath) {
    path += `/${params.thirdPath}`;
  }

  return path;
}
