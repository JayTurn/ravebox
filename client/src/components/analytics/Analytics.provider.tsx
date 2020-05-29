/**
 * Analytics.provider.tsx
 * The provider for analytics events.
 */

// Modules.
import {
  AmplitudeClient,
  Identify 
} from 'amplitude-js';
import * as React from 'react';

// Interfaces.
import {
  AnalyticsContextProps,
  AnalyticsProviderProps,
  EventObject
} from './Analytics.interface';

// Create an analytics context.
const AnalyticsContext = React.createContext<AnalyticsContextProps | undefined>(undefined);

/**
 * Analytics provider.
 */
export const AnalyticsProvider = (
  props: AnalyticsProviderProps
) => {
  // Define the child components.
  const { children } = {...props};

  // Create a state for the amplitude instance.
  const [Amplitude, setAmplitude] = React.useState<AmplitudeClient | null>(null);

  /**
   * Initializes the amplitude client if it doesn't exist already.
   */
  const initialize: (
  ) => Promise<AmplitudeClient> = (
  ): Promise<AmplitudeClient> => {

    return new Promise<AmplitudeClient>((resolve: Function, reject: Function) => {
      if (typeof window !== 'undefined' && !Amplitude) {

        const amplitude = require('amplitude-js');

        const amplitudeInstance = amplitude.getInstance();

        amplitudeInstance.init(`${process.env.RAZZLE_AMPLITUDE_KEY}`);

        setAmplitude(amplitudeInstance);

        resolve(amplitudeInstance);
      } else {
        reject();
      }
    })
  }

  /**
   * Creates the user to be tracked.
   *
   * @param { string } userId - the id of the user.
   * @param { EventObject } data - the user data.
   */
  const addUser: (
    userId: string
  ) => (
    data: EventObject
  ) => void = (
    userId: string
  ) => (
    data: EventObject
  ): void => {
    if (Amplitude) {
      // Set the user id.
      Amplitude.setUserId(userId);
      // Update the user properties with the default values provided.
      Amplitude.setUserProperties({
        ...data,
        'user type': 'consumer',
        'reviews created': 0,
        'reviews rated': 0,
        'reviews watched': 0,
        'following': 0,
        'followers': 0
      });

      // Set the signup date and update the user identity.
      const identity: Identify = new Amplitude.Identify().setOnce('signed up', new Date().toISOString());
      Amplitude.identify(identity);

    } else {
      initialize()
        .then((instance: AmplitudeClient) => {
          // Set the user id.
          instance.setUserId(userId);
          // Update the user properties with the values provided.
          instance.setUserProperties({
            ...data,
            'user type': 'consumer',
            'reviews created': 0,
            'reviews rated': 0,
            'reviews watched': 0,
            'following': 0,
            'followers': 0
          });

          // Set the signup date and update the user identity.
          const identity: Identify = new instance.Identify().setOnce('signed up', new Date().toISOString());
          instance.identify(identity);
        });
    }
  }

  /**
   * Tracks an event.
   *
   * @param { string } name - the name of the event.
   * @param { EventObject } data? - optional data parameter.
   */
  const trackEvent: (
    name: string
  ) => (
    data?: EventObject
  ) => void = (
    name: string
  ) => (
    data?: EventObject
  ): void => {
    
    if (Amplitude) {
      // Perform the event.
      Amplitude.logEvent(name, data);
    } else {
      initialize()
        .then((instance: AmplitudeClient) => {
          instance.logEvent(name, data);
        });
    }
  }

  /**
   * Sets the user id for the current session.
   *
   * @param { string } userId - the id of the user.
   */
  const trackUser: (
    userId: string
  ) => void = (
    userId: string
  ): void => {
    if (Amplitude) {
      // Set the user id.
      Amplitude.setUserId(userId);
    } else {
      initialize()
        .then((instance: AmplitudeClient) => {
          // Set the user id.
          instance.setUserId(userId);
        });
    }
  }

  /**
   * Loads the amplitude client if we have a window component.
   */
  React.useEffect(() => {

    if (typeof window !== 'undefined' && !Amplitude) {

      const amplitude = require('amplitude-js');

      const amplitudeInstance = amplitude.getInstance();

      amplitudeInstance.init(`${process.env.RAZZLE_AMPLITUDE_KEY}`);

      setAmplitude(amplitudeInstance);

    }

  }, []);

  const contextState: AnalyticsContextProps = {
    addUser,
    trackEvent,
    trackUser
  }

  return (
    <AnalyticsContext.Provider value={contextState}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Export the analytics context hook.
 */
export const useAnalytics = () => React.useContext(AnalyticsContext);
