'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import SearchResult from './SearchResult';

// MUI imports
import List from '@mui/material/List';

const SearchResultsList: React.FC = function () {
  const searchResults: any[] = useSelector(
    (state: RootState) => state.search.results
  );

  // convert search result list into JSX list
  const searchResultJSX = searchResults.map((val) => {
    return <SearchResult key={String(val._id)} business={val} />;
  });

  return (
    <List sx={{ overflowY: 'scroll', flexBasis: '100%' }}>
      {searchResultJSX}
    </List>
  );
};

export default SearchResultsList;
