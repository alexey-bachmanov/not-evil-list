'use client';
import React from 'react';
import { useDispatch } from 'react-redux';

// Material UI imports
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = function () {
  // const dispatch = useDispatch();
  const dispatch = () => {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send search query to a custom hook (useSearch?) and redux state
    // TODO: custom hook uses useEffect to make a call to our backend api?
    // TODO: backend does the DB query and returns list of results
    // TODO: results are stored in redux state for SearchResultsList to use
  };

  return (
    <Box
      component="form"
      width="100%"
      onSubmit={handleSubmit}
      sx={{ p: 1, display: 'flex' }}
    >
      <TextField
        id="search-bar"
        className="text"
        label="Search..."
        variant="outlined"
        size="small"
        sx={{ flexBasis: '100%', pr: 1 }}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: 'blue' }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
