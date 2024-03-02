'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, searchActions } from '@/store';

// Material UI imports
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar: React.FC = function () {
  const userRole = useSelector((state: RootState) => state.auth.user.role);
  const isInAdminMode = useSelector(
    (state: RootState) => state.admin.isInAdminMode
  );
  const [query, setQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // store the query for later and exexute it
    dispatch(searchActions.setSearchQuery(query));
    dispatch(searchActions.executeSearch(query));
  };

  const handleUnverifiedSearch = () => {
    setQuery('-all -unverified');
    dispatch(searchActions.setSearchQuery('-all -unverified'));
    dispatch(searchActions.executeSearch('-all -unverified'));
  };

  return (
    <>
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
          aria-label="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ flexBasis: '100%', pr: 1 }}
        />
        <IconButton type="submit" aria-label="search">
          <SearchIcon style={{ fill: 'blue' }} />
        </IconButton>
      </Box>
      {userRole === 'admin' && isInAdminMode && (
        <Button
          variant="outlined"
          onClick={handleUnverifiedSearch}
          sx={{ m: 1, marginTop: 0 }}
        >
          Search All Unverified
        </Button>
      )}
    </>
  );
};

export default SearchBar;
