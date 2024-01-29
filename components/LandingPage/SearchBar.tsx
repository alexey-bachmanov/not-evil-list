'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { executeSearch } from '@/store/searchSlice';

// Material UI imports
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = function () {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(executeSearch(query));
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
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ flexBasis: '100%', pr: 1 }}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: 'blue' }} />
      </IconButton>
    </Box>
  );
};

export default SearchBar;
