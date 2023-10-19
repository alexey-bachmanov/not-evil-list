'use client';

// imports
import React from 'react';
import { useRouter } from 'next/navigation';
import SearchBar from './SearchBar';
import SearchResult from './SearchResult';
import Logo from './Logo';

// Material UI imports
import useTheme from '@mui/material/styles/useTheme';
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const SearchDrawer: React.FC = function () {
  const router = useRouter();
  let fakeList = [];
  for (let i = 0; i < 25; i++) {
    fakeList.push(i);
  }
  const listJSX = fakeList.map((val) => {
    return <SearchResult key={val} business={val} />;
  });
  listJSX.push(<Divider key="end-divider" variant="middle" />);

  return (
    <Drawer variant="permanent">
      <SearchBar />
      <List sx={{ overflowY: 'scroll' }}>{listJSX}</List>
      <ButtonGroup fullWidth sx={{ p: 1 }}>
        <Button onClick={() => router.push('/new-business')}>Add</Button>
        <Button>Log in</Button>
      </ButtonGroup>
    </Drawer>
  );
};

export default SearchDrawer;
