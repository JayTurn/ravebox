/**
 * User.common.tsx
 *
 * Common functions for users.
 */

// Enumerators.
import {
  Role,
  UserLinkType
} from './User.enum';

// Interfaces.
import {
  PrivateProfile,
  ProfileStatistics,
  PublicProfile
} from './User.interface';

// Utilities.
import { CountIdentifier } from '../../utils/display/numeric/Numeric';

/**
 * Checks if the user has an admin role.
 *
 * @param { PrivateProfile } profile - the user's profile.
 */
export const isAdmin: (
  user: PrivateProfile
) => boolean = (
  user: PrivateProfile
): boolean => {
  return user.role.includes(Role.ADMIN);
}

/**
 * Retrieves a an external user avatar.
 */
export const getExternalAvatar: (
  user?: PublicProfile
) => string | undefined = (
  user?: PublicProfile
): string | undefined => {

  return user ? user.avatar : undefined;

  /*
  let avatar: string | undefined;
  if (user && user.role !== Role.YOUTUBE) {
    avatar = user.avatar;
  } else {
    avatar = 'https://d3jb681o407t0s.cloudfront.net/images/avatars/5f7566a18d8dda006f5b0403/youtube_profile-xgl9y8mk9a5583e5fjpp.png';
  }

  return avatar;
  */
}

/**
 * Retrieves an external link path.
 *
 * @param { UserLinkType } linkType - the chosen link type.
 *
 * @return string
 */
export const getExternalLinkPath: (
  linkType: UserLinkType
) => string = (
  linkType: UserLinkType
): string => {
  let path: string = 'https://';
  switch (linkType) {
    case UserLinkType.FACEBOOK:
      path += 'facebook.com/';
      break;
    case UserLinkType.INSTAGRAM:
      path += 'instagram.com/';
      break;
    case UserLinkType.LINKEDIN:
      path += 'linkedin.com/in/'; 
      break;
    case UserLinkType.PINTEREST:
      path += 'pinterest.com/'; 
      break;
    case UserLinkType.TIKTOK:
      path += 'tiktok.com/@';
      break;
    case UserLinkType.TWITTER:
      path += 'twitter.com/';
      break;
    case UserLinkType.YOUTUBE:
      path += 'youtube.com/c/'; 
      break;
    default:
  }

  return path;
};

/**
 * Formats the display of the user statistics.
 *
 * @param { ProfileStatistics } statistics - the user statistics.
 *
 * @return string
 */
export const formatStatistics: (
  statistics: ProfileStatistics | undefined
) => string = (
  statistics: ProfileStatistics | undefined
): string => {
  let result: string = '';

  if (!statistics) {
    return result;
  }

  const ravesCount: string = CountIdentifier(statistics.ravesCount)('rave');

  result += ravesCount;

  /*
  if (statistics.followers > 0) {
    const followerCount: string = CountIdentifier(statistics.followers)('follower');

    if (statistics.ravesCount > 0) {
      result += ` | `;
    }

    result += `${followerCount}`;
  }
  */

  return result;
} 
