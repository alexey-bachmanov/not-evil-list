import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

///// CREATE THEME /////
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5dba63',
    },
    secondary: {
      main: '#715dbd',
    },
    background: {
      default: '#ebf6ec',
      paper: '#dbe9d0',
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
