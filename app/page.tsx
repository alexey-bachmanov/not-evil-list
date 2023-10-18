// custom background map component
'use client';
import Map from '@/components/Map';
import SearchDrawer from '@/components/SearchDrawer';

import Box from '@mui/material/Box';

export default function HomePage() {
  return (
    <Box component="main">
      <Map />
      <SearchDrawer />
    </Box>
  );
}
