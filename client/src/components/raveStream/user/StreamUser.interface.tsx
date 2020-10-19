/**
 * StreamUser.interface.tsx
 *
 * Interfaces for the rave creator displayed in the stream.
 */

// Interfaces.
import { PublicProfile } from '../../user/User.interface';
import { RaveStream } from '../../raveStream/RaveStream.interface';
import { Review } from '../../review/Review.interface';

/**
 * Properties for the stream user component.
 */
export interface StreamUserProps {
  raveStream?: RaveStream;
  review?: Review;
  user?: PublicProfile;
}
