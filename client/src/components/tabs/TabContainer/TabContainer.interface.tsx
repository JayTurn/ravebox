/**
 * TabContainer.interface.tsx
 * Interfaces for the tab container.
 */

import * as React from 'react';

/**
 * Tab container properties.
 */
export interface TabContainerProps {
  activeIndex: number;
  index: number;
  children: React.ReactNode;
  updateHeight: (value: number) => void;
  toggleUpdate: boolean;
}
