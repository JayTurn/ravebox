/**
 * useRetrieveTagsList.hook.ts
 * Retrieves the list of app tags.
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
import { Tag } from '../../tag/Tag.interface';
import {
  RetrieveTagsListParams,
  RetrieveTagsListResponse
} from './AdminTags.interface';

/**
 * Returns a list of tags if they exist.
 */
export function useRetrieveTagsList(params: RetrieveTagsListParams) {

  // Set the default state for retrieving the list of tags.
  const [retrieved, setRetrieved] = React.useState(RetrievalStatus.REQUESTED); 

  const [tags, setTags] = React.useState<Array<Tag>>([]);

  const [options, setOptions] = React.useState<RetrieveTagsListParams>(params);

  /**
   * Handle state updates based on the presence of an admin user.
   */
  React.useEffect(() => {
    const cookie: Cookies = new Cookies(),
          security: string = cookie.get('XSRF-TOKEN');

    if (retrieved === RetrievalStatus.REQUESTED) {
      setRetrieved(RetrievalStatus.WAITING);

      // Perform the API request to get the list of users.
      API.requestAPI<RetrieveTagsListResponse>('admin/tags', {
        body: JSON.stringify(options),
        headers: {
          'x-xsrf-token': security
        },
        method: RequestType.POST

      })
      .then((response: RetrieveTagsListResponse) => {
        if (response.tags) {
          setTags(response.tags);
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

  /**
   * Handles a retrieval reset.
   */
  const reset: (
  ) => void = (
  ): void => {
    setRetrieved(RetrievalStatus.REQUESTED);
  } 

  /**
   * Updates a tag in the list.
   *
   * @param { Tag } tag - the tag to be updated.
   * @param { number } index - the index of the tag in the list.
   */
  const updateTagInList: (
    tag: Tag
  ) => (
    index: number
  ) => void = (
    tag: Tag
  ) => (
    index: number
  ): void => {
    const updatedTagList: Array<Tag> = [...tags];

    if (updatedTagList[index]) {
      updatedTagList[index] = {...tag};

      setTags([...updatedTagList]);
    }
  }

  return {
    reset: reset,
    retrievalStatus: retrieved,
    tags: tags,
    updateTagInList
  }
}
