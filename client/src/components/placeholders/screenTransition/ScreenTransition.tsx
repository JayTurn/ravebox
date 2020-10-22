/**
 * ScreenTransition.tsx
 * Renders a placeholder for screen transitions.
 */

// Modules.
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import * as React from 'react';

// Enumerators.
import { LogoColor } from '../../logo/Logo.enum';

// Components.
import Logo from '../../logo/Logo';

// Styles.
import './ScreenTransition.css';

/**
 * Renders the screen transition.
 */
const ScreenTransition: React.FC = () => {
  return (
    <Grid container direction='column'>
      <Grid item xs={12}>
        <Box className={'screen-transition'}>           
          <Logo iconOnly={true} fullWidth='60px' color={LogoColor.MAIN} />
        </Box>
      </Grid>
    </Grid>
  )
};

export default ScreenTransition;
