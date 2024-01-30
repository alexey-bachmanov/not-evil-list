'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Map from '@/components/Map';
import SearchDrawer from '@/components/LandingPage/SearchDrawer';
import LoginDialog from '@/components/LandingPage/LoginDialog';
import AlertBar from '@/components/AlertBar';

// MUI imports
import Box from '@mui/material/Box';

export default function HomePage() {
  const isLoginDialogOpen = useSelector(
    (state: RootState) => state.ui.loginDialog.isOpen
  );

  return (
    <Box component="main" sx={{ display: 'flex' }}>
      <AlertBar />
      {isLoginDialogOpen ? <LoginDialog /> : null}
      <Box sx={{ width: '400px' }}>
        <SearchDrawer />
      </Box>
      <Box sx={{ flexBasis: '100%' }}>
        <Map />
      </Box>
    </Box>
  );
}
