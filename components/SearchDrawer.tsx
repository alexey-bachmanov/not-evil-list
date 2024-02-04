import React from 'react';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
import Drawer from './Drawer';

// MUI imports
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

const SearchDrawer: React.FC = function () {
  return (
    <Drawer
      isOpen={true}
      variant="permanent"
      layer={1}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SearchBar />
      <Divider variant="middle" />
      <SearchResultsList />
    </Drawer>
  );
};

export default SearchDrawer;
