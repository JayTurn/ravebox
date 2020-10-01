/**
 * useRetrieveUsersList.hook.ts
 * Retrieves the list of app users.
 */

// Modules.
import API from '../../../utils/api/Api.model';
import * as React from 'react';
import Cookies from 'universal-cookie';

// Enumerators.
import {
  RequestType,
  RetrievalStatus
} from '../../../utils/api/Api.enum';

// Interfaces.
import { PrivateProfile } from '../../user/User.interface';
import {
  RetrieveUsersListParams,
  RetrieveUsersListResponse
} from './AdminUsers.interface';

/**
 * Returns a list of users if they exist.
 */
export function useRetrieveUsersList() {

  // Set the default state for retrieving the list of users.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  const [users, setUsers] = React.useState<Array<PrivateProfile>>([]);

  /**
   * Handle state updates based on the presence of an admin user.
   */
  React.useEffect(() => {
    const cookie: Cookies = new Cookies(),
          security: string = cookie.get('XSRF-TOKEN');

    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the list of users.
      API.requestAPI<RetrieveUsersListResponse>('admin/users', {
        method: RequestType.GET,
        headers: {
          'x-xsrf-token': security
        }
      })
      .then((response: RetrieveUsersListResponse) => {
        if (response.users) {
          setUsers(response.users);
          setRetrieved(RetrievalStatus.SUCCESS);
        } else {
          setRetrieved(RetrievalStatus.FAILED);
        }
      })
      .catch((error: Error) => {
        setRetrieved(RetrievalStatus.FAILED);
      });
    }
  }, [retrieved]);

  return {
    retrievalStatus: retrieved,
    users: users
  }
}
