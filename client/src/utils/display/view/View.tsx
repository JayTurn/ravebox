/**
 * View.tsx
 * Common view handlers.
 */

// Enumerators.
import { RetrievalStatus } from '../../api/Api.enum';
import { ViewState } from './ViewState.enum';

/**
 * Simplified view state.
 *
 * @param { RetrievalStatus } retrievalStatus - the current api status.
 */
export const ViewStatus: (
  retrievalStatus: RetrievalStatus
) => ViewState = (
  retrievalStatus: RetrievalStatus
): ViewState => {

  let state: ViewState;

  switch (retrievalStatus) {
    case RetrievalStatus.SUCCESS:
    case RetrievalStatus.NOT_REQUESTED:
      state = ViewState.FOUND; 
      break;
    case RetrievalStatus.FAILED:
    case RetrievalStatus.NOT_FOUND:
      state = ViewState.NOT_FOUND; 
      break;
    default:
      state = ViewState.WAITING;
  }

  return state;
}
