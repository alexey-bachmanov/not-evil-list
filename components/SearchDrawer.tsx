import React from 'react';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';
import SearchButtonGroup from './SearchButtonGroup';

// MUI imports
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

const SearchDrawer: React.FC = function () {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SearchBar />
      <Divider variant="middle" />
      <SearchResultsList />
      <Divider variant="middle" />
      <SearchButtonGroup />
    </Box>
  );
};

export default SearchDrawer;
