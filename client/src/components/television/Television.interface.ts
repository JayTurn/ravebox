/**
 * Televison.interface.tsx
 * Interfaces for television components.
 */

// Dependent enumerators.
import { TVItemType } from './TVItemType.enum';

/**
 * TVList interface.
 */
export interface TVSearch {
  page: number;
  total_results: number;
  total_pages: number;
  results: Array<TVItem>;
}

/**
 * TV show list properties.
 */
export interface TVShowListProps {
  list: Array<TVItem>;
  baseImageUrl: string;
  display: TVItemType;
}

/**
 * TV show list state.
 */
export interface TVShowListState {}

/**
 * TVItem interface.
 */
export interface TVItem {
  original_name: string;
  id: number;
  name: string;
  vote_average: string;
  first_air_date: string;
  original_language: string;
  overview: string;
  poster_path: string;
}

/**
 * TV item properties.
 */
export interface TVShowItemProps extends TVItem {
  baseImageUrl: string;
  display: TVItemType;
}

/**
 * TV item properties.
 */
export interface TVShowItemState {
}
