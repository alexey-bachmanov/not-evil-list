import React from 'react';
import dynamic from 'next/dynamic';
import SearchDrawer from '@/components/LandingPage/SearchDrawer';
// leaflet assumes window object exists when it first runs, so to
// avoid SSR errors, we need to avoid even importing our Map component
// to keep leaflet from running
// import Map from '@/components/Map';
const Map = dynamic(() => import('@/components/Map'), { ssr: false });

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
