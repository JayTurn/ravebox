/**
 * PaddedDivider.tsx
 * Padded divider to be re-used across the application.
 */

// Modules.
import * as React from 'react';
import { withStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

// Interfaces.
import { PaddedDividerProps } from './PaddedDivider.interface';

/**
 * Styled error divider.
 */
const StyledDivider = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.text.primary,
    opacity: '.45',
    marginBottom: '2rem',
    marginTop: '1rem'
  }
}))(Divider);


/**
 * Padded divider component.
 */
const PaddedDivider: React.FC<PaddedDividerProps> = (props: PaddedDividerProps) => {
  return (
    <StyledDivider />
  );
};

export default StyledDivider;
