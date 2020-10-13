/**
 * useRetrieveCollectionById.hook.ts
 * Performs an search to return a collection based on the product id
 * provided.
 */

// Modules.
import API from '../../utils/api/Api.model';
import Cookies from 'universal-cookie';
import * as React from 'react';

// Enumerators.
import { CollectionContext } from './Collection.enum';
import {
  RequestType,
  RetrievalStatus
} from '../../utils/api/Api.enum';

// Interfaces.
import { Collection } from './Collection.interface';
import {
  RetrieveCollectionByIdParams,
  RetrieveCollectionByIdResponse
} from './Collection.interface';

// Utilities.
import { ViewStatus } from '../../utils/display/view/View';

/**
 * Returns a list of collection results if found.
 */
export function useRetrieveCollectionById(params: RetrieveCollectionByIdParams) {

  // Retrieve the id from the params provided.
  const context: CollectionContext = params.context;

  // Define the id to be used for searching for collections.
  const [id, setId] = React.useState<string>(params.id || '');

  // Define the retrieval status to be used for view rendering.
  const [retrievalStatus, setRetrievalStatus] = React.useState(
    params.retrievalStatus && params.id ?
    params.retrievalStatus : RetrievalStatus.NOT_REQUESTED
  );

  // Define the results to be returned.
  const [collections, setCollections] = React.useState<Array<Collection>>([]);

  /**
   * Handles performing a request for a a collection.
   *
   * @param { string } id - the id to be used for searching.
   */
  const retrieve: (
    id: string
  ) => void = (
    id: string
  ): void => {
    if (retrievalStatus !== RetrievalStatus.REQUESTED) {
      setId(id);
      setRetrievalStatus(RetrievalStatus.REQUESTED);
    }
  }

  /**
   * Handle state updates based on the retrieval status.
   */
  React.useEffect(() => {

    if (params.id !== id) {
      retrieve(params.id);
    }

    // If we haven't performed a request continue.
    if (retrievalStatus === RetrievalStatus.REQUESTED && id) {
      // Update the retrieval status to avoid subsequent requests.
      setRetrievalStatus(RetrievalStatus.WAITING);

      const cookie: Cookies = new Cookies(),
            security: string = cookie.get('XSRF-TOKEN');

      const path: string = `collection/${params.collectionType}/${id}`;

      // Perform the API request to get the collections.
      API.requestAPI<RetrieveCollectionByIdResponse>(path, {
        body: JSON.stringify({
          context: context
        }),
        headers: {
          'x-xsrf-token': security
        },
        method: RequestType.POST
      })
      .then((response: RetrieveCollectionByIdResponse) => {
        // Set the collections and update the retrieval state.
        if (setCollections) {
          setCollections(response.collections);
          setRetrievalStatus(RetrievalStatus.SUCCESS);

        } else {
          // We couldn't find any collections so return an appropriate response
          // for the view to render accordingly.
          setRetrievalStatus(RetrievalStatus.NOT_FOUND);
        }
      })
      .catch((error: Error) => {
        console.error(error);
        setRetrievalStatus(RetrievalStatus.FAILED);
      });
    }
  }, [retrievalStatus, collections, params.id, id]);

  return {
    collections,
    collectionStatus: ViewStatus(retrievalStatus),
    retrieveCollection: retrieve
  };
}
