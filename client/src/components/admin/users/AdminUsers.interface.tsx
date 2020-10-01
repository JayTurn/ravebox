/**
 * AdminUsers.interface.tsx
 * Interfaces for the screen to manage users.
 */

// Modules.
import { RouteComponentProps } from 'react-router';

// Interfaces.
import { APIResponse } from '../../../utils/api/Api.interface';
import { PrivateProfile } from '../../user/User.interface';

/**
 * Admin users properties.
 */
export interface AdminUsersProps extends RouteComponentProps {
}

/**
 * Parameters for retrieving a list of users.
 */
export interface RetrieveUsersListParams { }

export interface RetrieveUsersListResponse extends APIResponse {
  users: Array<PrivateProfile>;
}
