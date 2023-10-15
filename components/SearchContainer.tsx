'use client';

// imports
import React from 'react';
import SearchBar from './SearchBar';

// Material UI imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

const SearchContainer: React.FC = function () {
  let fakeList = [];
  for (let i = 0; i < 25; i++) {
    fakeList.push(i);
  }
  const listJSX = fakeList.map((val) => {
    return (
      <>
        <Divider />
        <ListItem key={val}>{val}</ListItem>
      </>
    );
  });

  return (
    <Drawer variant="permanent">
      <Box sx={{ p: 1 }}>
        <SearchBar />
      </Box>
      <List sx={{ overflowY: 'scroll' }}>{listJSX}</List>
      <ButtonGroup sx={{ p: 1 }}>
        <Button>Add</Button>
        <Button>Log in</Button>
      </ButtonGroup>
    </Drawer>
  );
};

export default SearchContainer;
