/**
 * RaveboxTheme.tsx
 * Modifications to the default theme to support desktop display.
 */

// Modules.
import { createMuiTheme, Theme } from '@material-ui/core/styles';

// Themes.
import { sharedTheme } from './RaveboxTheme';

// Create the desktop theme.
const theme = createMuiTheme({
  ...sharedTheme,
  typography: {
    body1: {
      color: sharedTheme.palette.text.primary
    },
    body2: {
      color: sharedTheme.palette.text.primary
    },
    fontFamily: 'Muli, Arial, sans-serif',
    h1: {
      color: sharedTheme.palette.text.primary,
      fontSize: '3rem',
      marginBottom: '0.5rem'
    },
    h2: {
      color: sharedTheme.palette.text.primary,
      fontSize: '1.875rem',
      fontWeight: 400,
      marginBottom: '0.5rem'
    },
    h3: {
      color: sharedTheme.palette.text.primary,
      fontSize: '1.171rem'
    },
    subtitle1: {
      color: sharedTheme.palette.text.primary
    },
    subtitle2: {
      color: sharedTheme.palette.text.primary
    },
  }
})

export default theme;
