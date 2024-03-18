'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SearchResult from './SearchResult';

// MUI imports
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const SearchResultsList: React.FC = function () {
  // load stuff from our redux store
  const searchResults = useSelector((state: RootState) => state.search.results);
  const loadingStatus = useSelector((state: RootState) => state.search.status);
  const errorMessage = useSelector((state: RootState) => state.search.error);

  // convert search result list into JSX list
  let searchResultJSX: React.JSX.Element;
  // display placeholder for empty list
  if (searchResults.length > 0) {
    searchResultJSX = (
      <>
        {searchResults.map((val) => (
          <SearchResult key={String(val._id)} business={val} />
        ))}
      </>
    );
  } else {
    searchResultJSX = (
      <Typography variant="body1">
        {"There don't seem to be any results..."}
      </Typography>
    );
  }

  // determine what we're gonna show in the results list
  let displayedJSX;
  if (loadingStatus === 'loading') {
    displayedJSX = (
      <Stack alignItems="center" justifyContent="center" height="100%">
        <CircularProgress />
      </Stack>
    );
  }
  if (loadingStatus === 'failure') {
    displayedJSX = <p>{errorMessage}</p>;
  }
  if (loadingStatus === 'success') {
    displayedJSX = searchResultJSX;
  }
  return (
    <List sx={{ overflowY: 'auto', flexBasis: '100%', p: 0 }}>
      {displayedJSX}
    </List>
  );
};

export default SearchResultsList;
