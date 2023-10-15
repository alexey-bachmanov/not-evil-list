// custom background map component
'use client';
import Map from '@/components/Map';
import SearchContainer from '@/components/SearchContainer';

import Box from '@mui/material/Box';

export default function HomePage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <SearchContainer />
      <Map />
    </Box>
  );
}
