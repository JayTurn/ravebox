/**
 * RaveboxTheme.tsx
 * Theme definitions for the ravebox application.
 */

// Modules.
import { createMuiTheme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles/withStyles';

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

export default createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [muli],
      },
    }
  },
  palette: {
    error: {
      light: '#F67135',
      main: '#D94D0E',
      dark: '#BB3A00',
      contrastText: '#FFFFFF'
    },
    primary: {
      light: '#A2A7FF',
      main: '#646AF0',
      dark: '#434AD9',
      contrastText: '#FFFFFF'
    },
    secondary: {
      light: '#62DECC',
      main: '#08CBAF',
      dark: '#00B89D',
      contrastText: '#FFFFFF'
    },
    text: {
      primary: '#363636',
      secondary: '#585858',
      disabled: '#939393',
      hint: '#6d6d6d'
    }
  },
  typography: {
    fontFamily: 'Muli, Arial, sans-serif',
    h1: {
      fontSize: '3rem',
      marginBottom: '0.5rem'
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 400,
      marginBottom: '0.5rem'
    },
    h3: {
      fontSize: '1.171rem'
    }
  }
});
