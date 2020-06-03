/**
 * Analytics.interface.tsx
 * Interfaces for the analytics provider.
 */

// Modules.
import * as React from 'react';

// Interfaces.
import { AmplitudeClient } from 'amplitude-js';

/**
 * Analytics provider properties.
 */
export interface AnalyticsProviderProps {
  children: React.ReactNode;
}

/**
 * Analytics context properties.
 */
export interface AnalyticsContextProps {
  addUser: (userId: string) => (data: EventObject) => void;
  trackEvent: (name: string) => (data?: EventObject) => void;
  trackPageView: (page: PageTracking) => void;
  trackUser: (userId: string) => void;
}

/**
 * Generic event structure type.
 */
export type EventObject = Record<string, string | boolean | number>;

/**
 * Event data interface.
 */
export interface EventData {
  name: string;
  properties: EventObject;
}

/**
 * Page data interface.
 */
export interface PageTracking {
  properties: {
    path: string;
    title: string;
  };
  data?: EventObject;
  amplitude?: {
    label: string;
  };
}
