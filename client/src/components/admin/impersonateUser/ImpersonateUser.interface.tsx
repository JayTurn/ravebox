/**
 * ImpersonateUser.interface.tsx
 * Interfaces for impersonating new user.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Properties for the create user interface.
 */
export interface ImpersonateUserProps extends RouteComponentProps {
  addXsrf?: (token: string) => {};
  id?: string;
  login?: (user: PrivateProfile) => {};
  profile?: PrivateProfile;
  xsrf?: string;
}

/**
 * Interface for the user creation api response.
 */
export interface ImpersonateUserResponse extends APIResponse {
  user: PrivateProfile;
}
