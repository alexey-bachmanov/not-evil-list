// custom background map component
'use client';
import React from 'react';
import Providers from '@/store/providers';
import Map from '@/components/Map';
import SearchDrawer from '@/components/SearchDrawer';

import Box from '@mui/material/Box';

export default function HomePage() {
  return (
    <Providers>
      <Box component="main">
        <Map />
        <SearchDrawer />
      </Box>
    </Providers>
  );
}
