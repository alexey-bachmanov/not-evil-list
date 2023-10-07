'use client';

// imports
import React from 'react';
import SearchBar from './SearchBar';

// Material UI imports
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const SearchContainer: React.FC = function () {
  let fakeList = [];
  for (let i = 0; i < 25; i++) {
    fakeList.push(i);
  }
  const listJSX = fakeList.map((val) => <ListItem key={val}>{val}</ListItem>);

  return (
    <>
      <SearchBar />
      <List>{listJSX}</List>
    </>
  );
};

export default SearchContainer;
