/**
 * RaveboxTheme.tsx
 * Theme definitions for the ravebox application.
 */

// Modules.
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/styles/withStyles';

export const sharedTheme = {
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
}

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
      fontSize: '2rem',
      marginBottom: '0.5rem'
    },
    h2: {
      color: sharedTheme.palette.text.primary,
      fontSize: '1.5rem',
      fontWeight: 400,
      marginBottom: '0.5rem'
    },
    h3: {
      color: sharedTheme.palette.text.primary,
      fontSize: '1.25rem'
    },
    subtitle1: {
      color: sharedTheme.palette.text.primary
    },
    subtitle2: {
      color: sharedTheme.palette.text.primary
    },
  }
});

export default theme;
