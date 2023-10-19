'use client';

// imports
import React from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import SearchResultsList from './SearchResultsList';

// Material UI imports
import Drawer from '@mui/material/Drawer';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const SearchDrawer: React.FC = function () {
  const router = useRouter();

  return (
    <Drawer variant="permanent">
      <SearchBar />
      <SearchResultsList />
      <ButtonGroup fullWidth sx={{ p: 1 }}>
        <Button onClick={() => router.push('/new-business')}>Add</Button>
        <Button>Log in</Button>
      </ButtonGroup>
    </Drawer>
  );
};

export default SearchDrawer;
