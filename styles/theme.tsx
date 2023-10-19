import React from 'react';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

///// CREATE THEME /////
// augment default theme interface to allow custom variables like drawerWidth
declare module '@mui/material/styles' {
  interface Theme {
    dimensions: {
      drawerWidth: Number;
    };
  }
  interface ThemeOptions {
    dimensions: {
      drawerWidth: number;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  dimensions: {
    drawerWidth: 380,
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
