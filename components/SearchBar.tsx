'use client';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { searchActions } from '@/store';

// Material UI imports
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = function () {
  const dispatch = useDispatch();
  const searchBoxPointer = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // this if statement will always pass unless something is terribly, terribly wrong
    // it's only here to assure typescript that searchBoxPointer.current exists
    if (searchBoxPointer.current) {
      const query = searchBoxPointer.current.value;
      // make a fetch call to our backend API
      // TODO: any kind of error handling here
      const response = await fetch('/api/businesses', {
        method: 'GET',
        headers: {
          'search-query': query,
        },
      });
      // parse the response data
      const responseParsed = await response.json();
      console.log(responseParsed.data.businesses);
      // pass search query and results up to redux state
      dispatch(
        searchActions.executeSearch({
          query: query,
          results: responseParsed.data.businesses,
        })
      );
    }
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
        inputRef={searchBoxPointer}
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
