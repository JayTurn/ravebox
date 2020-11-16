/**
 * TabMenu.interface.tsx
 * Interfaces for the tab menu.
 */

/**
 * TabMenu properties.
 */
export interface TabMenuProps {
  activeIndex: number;
  tabItems: Array<TabMenuItem>;
  updateActiveTab: (index: number) => void;
}

/**
 * Tab menu item properties.
 */
export interface TabMenuItem {
  title: string;
  id: string;
}
