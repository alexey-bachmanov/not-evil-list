import React from 'react';

// MUI imports
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';

const SearchResult: React.FC<{ business: any }> = function ({ business }) {
  return (
    <>
      <Divider variant="middle" />
      <ListItem>Placeholder</ListItem>
    </>
  );
};

export default SearchResult;
