import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

///// CREATE THEME /////
// create an interface so we can store custom variables in our theme and keep
// typescript happy
declare module '@mui/material/styles' {
  interface Theme {
    dimensions: {
      drawerWidth: number;
    };
  }
}

// we'll define our pallete first, because we use it to color specific components
// further down the createTheme process
let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      dark: '#369f3f',
      main: '#5dba63',
      light: '#a1d5a3',
    },
    secondary: {
      dark: '#4f3eab',
      main: '#715dbd',
      light: '#aca0d8',
    },
    background: {
      default: '#ebf6ec',
      paper: '#dbe9d0',
    },
  },
});

// define our custom variables
theme = createTheme(theme, {
  dimensions: {
    drawerWidth: 300,
  },
});

// customize our scrollbars to look more on-brand
const scrollbarForeground = theme.palette.primary.main;
const scrollbarBackground = theme.palette.background.paper;
const scrollbarActive = theme.palette.primary.dark;
theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            backgroundColor: scrollbarBackground,
            width: 10,
            borderRadius: 10,
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: 10,
            backgroundColor: scrollbarForeground,
            minHeight: 36,
            // border: `3px solid ${scrollbarActive}`,
          },
          '*::-webkit-scrollbar-thumb:focus': {
            backgroundColor: scrollbarActive,
          },
          '*::-webkit-scrollbar-thumb:active': {
            backgroundColor: scrollbarActive,
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: scrollbarActive,
          },
          '*::-webkit-scrollbar-corner': {
            backgroundColor: scrollbarBackground,
          },
        },
      },
    },
  },
});

///// CREATE THEME PROVIDER /////

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = function ({
  children,
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
