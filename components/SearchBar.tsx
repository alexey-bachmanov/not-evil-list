'use client';
// imports
import React from 'react';
import { useDispatch } from 'react-redux';

// Material UI imports
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = function () {
  // const dispatch = useDispatch();
  const dispatch = () => {};

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <TextField
        id="search-bar"
        className="text"
        label="Search..."
        variant="outlined"
        size="small"
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: 'blue' }} />
      </IconButton>
    </form>
  );
};

export default SearchBar;
