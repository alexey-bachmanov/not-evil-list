// custom background map component
'use client';
import Map from '@/components/Map';

// Material UI components
import Drawer from '@mui/material/Drawer';
import SearchContainer from '@/components/SearchContainer';

///// STYLES /////

///// PAGE COMPONENT /////
export default function HomePage() {
  return (
    <>
      <Map />
      <Drawer variant="permanent">
        <SearchContainer />
      </Drawer>
    </>
  );
}
