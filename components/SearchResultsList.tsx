'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SearchResult from './SearchResult';

// MUI imports
import List from '@mui/material/List';
import CircularProgress from '@mui/material/CircularProgress';
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
      <CircularProgress
        sx={{
          display: 'block',
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
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
