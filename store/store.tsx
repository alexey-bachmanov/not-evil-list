import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// slice imports
import searchSlice from './searchSlice';
import resultsSlice from './resultsSlice';

///// STORE COMPOSITION /////
export const store = configureStore({
  reducer: {
    search: searchSlice.reducer,
    results: resultsSlice.reducer,
  },
});

export const searchActions = searchSlice.actions;
export const resultsActions = resultsSlice.actions;

///// PROVIDER /////
export const ReduxProvider: React.FC<{ children: React.ReactNode }> =
  function ({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
