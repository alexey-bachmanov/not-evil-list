'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import SearchResult from './SearchResult';
import { BusinessDataEntry } from '@/store/resultsSlice';

// MUI imports
import List from '@mui/material/List';

const SearchResultsList: React.FC = function () {
  const searchResults: BusinessDataEntry[] = useSelector(
    (state: any) => state.results.results
  );

  // convert search result list into JSX list
  const searchResultJSX = searchResults.map((val: BusinessDataEntry) => {
    return <SearchResult key={String(val.objectID)} business={val} />;
  });

  return (
    <List sx={{ overflowY: 'scroll', flexBasis: '100%' }}>
      {searchResultJSX}
    </List>
  );
};

export default SearchResultsList;
