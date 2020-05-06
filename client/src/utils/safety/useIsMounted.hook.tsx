/**
 * useIsMounted.hook.tsx
 * Determines if a component is mounted to be used for race condition handling.
 */

// Modules.
import * as React from 'react';

/**
 * Checks if the current component is mounted.
 */
export const useIsMounted = () => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false
    };
  }, []);

  return isMounted;
}
