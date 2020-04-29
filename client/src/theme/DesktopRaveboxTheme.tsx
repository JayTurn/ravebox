/**
 * RaveboxTheme.tsx
 * Modifications to the default theme to support desktop display.
 */

// Modules.
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles/withStyles';

// Themes.
import { sharedTheme } from './RaveboxTheme';

// Fonts.
import Muli from '../fonts/muli/Muli-VariableFont_wght.ttf';

const muli: CSSProperties = {
  fontFamily: 'Muli',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 500,
  src: `
    local('Muli'),
    url(${Muli}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

// Create the desktop theme.
const theme = createMuiTheme({
  ...sharedTheme,
  typography: {
    fontFamily: '"Muli", sans-serif',
    body1: {
      color: sharedTheme.palette.text.primary
    },
    body2: {
      color: sharedTheme.palette.text.primary
    },
    h1: {
      color: sharedTheme.palette.text.primary,
      fontFamily: '"Muli"',
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
