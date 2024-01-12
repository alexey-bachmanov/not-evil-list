'use client';
import React from 'react';
import Map from '@/components/Map';
import SearchDrawer from '@/components/LandingPage/SearchDrawer';

// MUI imports
import Box from '@mui/material/Box';

export default function HomePage() {
  return (
    <Box component="main" sx={{ display: 'flex' }}>
      <Box sx={{ width: '400px' }}>
        <SearchDrawer />
      </Box>
      <Box sx={{ flexBasis: '100%' }}>
        <Map />
      </Box>
    </Box>
  );
}
